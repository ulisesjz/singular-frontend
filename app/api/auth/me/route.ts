import { auth } from '@/lib/auth';
import { getUserByEmail } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getUserByEmail(session.user.email);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(user);
}
