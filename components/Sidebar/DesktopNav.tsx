'use client';
import { createThread } from '@/lib/threads';
import { NavItem } from 'app/(dashboard)/nav-item';
import clsx from 'clsx';
import { useChatContext } from 'context/ChatContext';
import {
  Home,
  Menu,
  Zap,
  Users,
  Brain,
  MessageCircle,
  SquarePen
} from 'lucide-react';
import { ThreadItem } from './threadItem';

export function DesktopNavWrapper() {
  const {
    threads,
    activeThreadId,
    setActiveThreadId,
    userEmail,
    pendingThreadId
  } = useChatContext();
  const strokeWidth = 1.5;

  const handleNewThread = async () => {
    setActiveThreadId(pendingThreadId);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-56 flex-col bg-sidebarBg border-r border-border sm:flex">
      <nav className="flex flex-col items-left gap-4 px-4 sm:py-3">
        <Menu className="h-10 w-5" />
      </nav>
      <nav className="flex flex-col items-left gap-4 px-2 sm:py-5">
        <NavItem href="/" label="Inicio">
          <Home width={20} height={20} strokeWidth={strokeWidth} />
        </NavItem>
        <NavItem href="#" label="Proximamente...">
          <Zap
            width={20}
            height={20}
            strokeWidth={strokeWidth}
            color="gray"
            className="cursor-default"
          />
        </NavItem>
        <NavItem href="#" label="Proximamente...">
          <Users
            width={20}
            height={20}
            strokeWidth={strokeWidth}
            color="gray"
            className="cursor-default"
          />
        </NavItem>
        <NavItem href="#" label="Proximamente...">
          <Brain
            width={20}
            height={20}
            strokeWidth={strokeWidth}
            color="gray"
            className="cursor-default"
          />
        </NavItem>
      </nav>
      <nav className="flex flex-col items-left gap-1 px-2 sm:pt-5 h-fit max-h-[45%]">
        <h4 className="text-sm font-medium text-muted-foreground px-2">
          Chats
        </h4>
        <NavItem href="#" label="Nuevo chat" onClick={handleNewThread}>
          <SquarePen
            width={20}
            height={20}
            strokeWidth={strokeWidth}
            color="gray"
            className="cursor-default"
          />
        </NavItem>
        <ul className='overflow-auto'>
          {threads.map(
            (thread: any) =>
              thread.messages && (
                <ThreadItem
                  key={thread.threadId}
                  href="#"
                  label={thread.name || 'chat'}
                  onClick={() => setActiveThreadId(thread.threadId)}
                  className={clsx(
                    ``,
                    activeThreadId === thread.threadId &&
                    'border border-primary bg-primary/10'
                  )}
                  threadId={thread.threadId}
                />
              )
          )}
        </ul>
      </nav>
      <nav className="mt-auto flex flex-col items-left gap-4 px-2 sm:pb-5">
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip> */}
        <NavItem href="#" label="">
          <MessageCircle width={20} height={20} />
        </NavItem>
      </nav>
    </aside>
  );
}
