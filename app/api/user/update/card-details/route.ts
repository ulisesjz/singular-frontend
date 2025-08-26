// app/api/user/update-card-details/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { updateUserCardsDetails } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { userId, cards } = body;

  if (!userId || !cards) {
    return NextResponse.json(
      { error: 'Missing userId or cards' },
      { status: 400 }
    );
  }

  try {

    const res = await updateUserCardsDetails(userId, {
      data: cards,
      lastUpdated: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating cards:', err);
    return NextResponse.json(
      { error: 'Failed to update cards' },
      { status: 500 }
    );
  }
}
