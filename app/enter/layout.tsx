import { auth } from '@/lib/auth';
import { getUserByEmail } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }
  
  const user = await getUserByEmail(session.user.email as string);

  if (user.hasCompletedOnboarding === true) {
    redirect('/');
  }
  return <div>{children}</div>;
}
