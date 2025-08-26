'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavItem({
  href,
  label,
  children,
  onClick,
  className
}: {
  href: string;
  label: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={clsx(
            'flex items-center gap-2 px-2 h-9 rounded-lg transition-colors hover:text-foreground hover:bg-primary hover:cursor-pointer',
            {
              'bg-primary text-primary-foreground': href === '/' ? pathname === '/' : pathname === href,
              'text-foreground': href !== '/' ? pathname !== href : pathname !== '/'
            },
            className
          )}
          onClick={onClick}
        >
          {/* Ícono con margen negativo para sobresalir */}
          {children && (
            <span className="flex h-8 w-8 items-center justify-center -ml-2">
              {children}
            </span>
          )}

          {/* Label */}
          <span className="text-sm truncate">{label}</span>
        </Link>
      </TooltipTrigger>
      {label && (
        <TooltipContent side="right">{label}</TooltipContent>
      )}
    </Tooltip>
  );
}
