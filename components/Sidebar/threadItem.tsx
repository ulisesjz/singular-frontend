'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThreadActionsMenu } from './thread-action-menu';
import { useState } from 'react';
import { useChatContext } from 'context/ChatContext';

export function ThreadItem({
  href,
  label,
  children,
  onClick,
  className,
  threadId
}: {
  href: string;
  label: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  threadId: string
}) {
  const pathname = usePathname();

  const { handleDeleteThread, isTyping } = useChatContext()

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={clsx(
            'relative group flex items-center gap-2 px-2 h-9 min-h-9 rounded-lg transition-colors hover:text-foreground hover:border-primary hover:border hover:bg-primary/10 hover:cursor-pointer', menuOpen ? "bg-primary/10 border-primary border" : "hover:bg-primary/10 hover:border-primary hover:border",
            {
              'bg-primary text-primary-foreground':
                href === '/' ? pathname === '/' : pathname === href,
              'text-foreground':
                href !== '/' ? pathname !== href : pathname !== '/'
            },
            className
          )}
          onClick={isTyping ? ()=>{} : onClick}
        >
          {/* Ícono con margen negativo para sobresalir */}
          {children && (
            <span className="flex h-8 w-8 items-center justify-center -ml-2">
              {children}
            </span>
          )}

          {/* Label */}
          <span className={clsx("text-sm truncate")}>{label}</span>
          {/* <div className={clsx("absolute right-2 opacity-0  transition-opacity hover:text-white", menuOpen ? "opacity-100 text-white":"group-hover:opacity-100")}>
            <ThreadActionsMenu
              onRename={() => console.log('Renombrar', label)}
              onArchive={() => console.log('Archivar', label)}
              onDelete={() => handleDeleteThread(threadId)}
              onOpenChange={setMenuOpen}
              menuOpen={menuOpen}
            />
          </div> */}
        </Link>
      </TooltipTrigger>
      {/* {label && <TooltipContent side="right">{label}</TooltipContent>} */}
    </Tooltip>
  );
}
