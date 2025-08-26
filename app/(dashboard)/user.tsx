import { Button } from '@/components/ui/button';
import { auth, signOut } from '@/lib/auth';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { doLogout } from '../login/actions';
import { Bell } from 'lucide-react';
import { ModeToggle } from '@/components/ui/mode-toggle';

export async function User() {
  let session = await auth();
  let user = session?.user;

  return (
    <div className="ml-auto md:grow-0 flex gap-2 items-center">

      <Button variant="ghost" size="icon" className="relative rounded-full">
        <Bell className="w-5 h-5" />
        {/* <span className="absolute top-2.5 right-3 inline-flex items-center justify-center w-2 h-2 bg-primary rounded-full"></span> */}
      </Button>

      <div className="flex items-center gap-2 mr-2">
        <span className='capitalize font-semibold'>{user?.name ? user.name : user?.email}</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Image
              src={user?.image ?? '/placeholder-user.jpg'}
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* <DropdownMenuLabel>My Account </DropdownMenuLabel>
          <DropdownMenuSeparator /> */}
          {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
          {/* <DropdownMenuItem>
            <Link target="_blank" href="https://www.vilotech.co/contact">Support</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator /> */}
          {user ? (
            <DropdownMenuItem>
              <form
                action={async () => {
                  'use server';
                  await doLogout();
                }}
              >
                <button type="submit">Sign Out</button>
              </form>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>
              <Link href="/login">Sign In</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ModeToggle />
    </div >
  );
}
