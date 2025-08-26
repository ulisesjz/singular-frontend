import { auth } from '@/lib/auth';
import DashboardClient from './DashboardClient';
import { getUserByEmail } from '@/lib/db';

export default async function Dashboard() {
  const session = await auth();
  const user = session?.user;

  const res = await getUserByEmail(user?.email || '');
  const plainUser = JSON.parse(JSON.stringify(res));
  
  return (
    <DashboardClient
      userName={user?.name || 'User'}
      userEmail={user?.email || ''}
      userId={plainUser._id}
      user={plainUser}
    />
  );
}
