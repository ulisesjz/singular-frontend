import Link from 'next/link';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Analytics } from '@vercel/analytics/react';
import { User } from './user';
import Providers from './providers';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserByEmail } from '@/lib/db';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  const user = await getUserByEmail(
    session.user.email as string
  );

  if (user.hasCompletedOnboarding === false) {
    redirect('/enter');
  }

  return (
    <Providers>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:py-3"> */}
          <header className="sticky top-0 z-30 flex items-center justify-between h-fit border-b px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="md:hidden" />
            {/* <DashboardBreadcrumb /> */}
            {/* <SearchInput /> */}
            <User />
          </header>
          <main className="flex-1">{children}</main>
        </SidebarInset>
        <Analytics />

        {/* Powered By ViloTech Footer */}
        <div className="fixed bottom-4 right-4 z-50">
          <Link
            href="https://vilotech.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-md"
          >
            <small className="font-medium">Powered by ViloTech</small>
          </Link>
        </div>
      </SidebarProvider>
    </Providers>
  );
}



function DashboardBreadcrumb() {
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="#">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="#">Agents</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>All Agents</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
