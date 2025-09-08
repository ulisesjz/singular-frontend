import { NextResponse } from 'next/server';
import { createThread, getThreadsByUserEmail, connectDB, getUserByEmail } from '../../../lib/db';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<Response> {
  try {
    // Parse and validate the request body
    const body = await request.json();

    // Validate required fields
    if (!body.assistantId || !body.threadId || !body.userEmail) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields: assistantId, threadId, or userEmail' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Ensure database connection
    await connectDB();

    // Create the thread
    const thread = await createThread(body.assistantId, body.threadId, body.userEmail);

    // Return a success response
    return new NextResponse(
      JSON.stringify({ message: 'Thread created successfully', thread }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    // Handle errors gracefully
    console.error('Thread creation error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create Thread', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET(): Promise<Response> {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return new NextResponse(
        JSON.stringify({ error: 'userEmail parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await getUserByEmail(userEmail);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Ensure database connection
    await connectDB();

    // Get threads for the user
    const threads = await getThreadsByUserEmail(userEmail);

    return new NextResponse(
      JSON.stringify({ threads }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error fetching threads:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch threads', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}