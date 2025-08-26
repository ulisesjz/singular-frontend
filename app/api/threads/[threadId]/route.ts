import { NextResponse } from 'next/server';
import {
  connectDB,
  getThreadByThreadId
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  context: { params: Promise<{ threadId: string }> }
): Promise<Response> {
  try {
     const { threadId } = await context.params;
     
    if (!threadId) {
      return new NextResponse(
        JSON.stringify({ error: 'threadId parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Ensure database connection
    await connectDB();

    // Get threads for the user
    const thread = await getThreadByThreadId(threadId);

    return new NextResponse(JSON.stringify({ thread }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error fetching thread:', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Failed to fetch thread',
        details: error.message
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}