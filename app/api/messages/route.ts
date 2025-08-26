import { NextResponse } from 'next/server';
import { addMessageToThread, getThreadByThreadId, connectDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get('threadId');
    const body = await request.json();

    // Validate required fields
    if (!threadId) {
      return new NextResponse(
        JSON.stringify({ error: 'threadId parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!body.role || !body.content) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields: role or content' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Ensure database connection
    await connectDB();

    // Check if thread exists
    const existingThread = await getThreadByThreadId(threadId);
    if (!existingThread) {
      return new NextResponse(
        JSON.stringify({ error: 'Thread not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Add message to thread
    const message = {
      role: body.role,
      content: body.content,
      timestamp: new Date()
    };

    const updatedThread = await addMessageToThread(threadId, message);

    return new NextResponse(
      JSON.stringify({ message: 'Message added successfully', thread: updatedThread }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error adding message:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to add message', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get('threadId');

    if (!threadId) {
      return new NextResponse(
        JSON.stringify({ error: 'threadId parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Ensure database connection
    await connectDB();

    // Get thread with messages
    const thread = await getThreadByThreadId(threadId);

    if (!thread) {
      return new NextResponse(
        JSON.stringify({ error: 'Thread not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new NextResponse(
      JSON.stringify({ thread }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error fetching thread:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch thread', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 