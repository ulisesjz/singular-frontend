import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
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

export async function User() {
  let session = await auth();
  let user = session?.user;

  return (
    <div className="ml-auto md:grow-0 flex items-center gap-2">
      <div className="flex items-center gap-2 mr-2">
        <span className="capitalize font-semibold">
          {user?.name ? user.name : user?.email}
        </span>
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
                <button type="submit">Cerrar Sesión</button>
              </form>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>
              <Link href="/login">Sign In</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
