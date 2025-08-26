'use client';

import { createThread } from '@/lib/threads';
import { useChatContext } from 'context/ChatContext';
import {
  Home,
  Zap,
  Users,
  Brain,
  MessageCircle,
  SquarePen
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { ThreadItem } from './Sidebar/threadItem';

export function AppSidebar() {
  const {
    threads,
    activeThreadId,
    setActiveThreadId,
    userEmail,
    pendingThreadId,
    isTyping
  } = useChatContext();

  const strokeWidth = 1.5;

  const handleNewThread = async () => {
    setActiveThreadId(pendingThreadId);
  };

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarTrigger className="h-8 w-8 ml-auto md:ml-0 md:flex" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* New Chat Button */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={isTyping ? () => {} : handleNewThread}
                  tooltip="Nuevo chat"
                >
                  <SquarePen width={20} height={20} strokeWidth={strokeWidth} />
                  <span>Nuevo chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Chats Section */}
        {threads && threads.length > 0 && (
          <SidebarGroup className="flex-1 group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Chats</SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col h-full">
              {/* Threads List */}
              <div className="flex-1 overflow-auto">
                <SidebarMenu>
                  {threads.map(
                    (thread: any) =>
                      thread.messages && (
                        <SidebarMenuItem key={thread.threadId}>
                          <SidebarMenuButton
                            asChild
                            isActive={activeThreadId === thread.threadId}
                            className={clsx(
                              'w-full justify-start text-left',
                              activeThreadId === thread.threadId &&
                                'bg-sidebar-accent'
                            )}
                          >
                            <ThreadItem
                              href="#"
                              label={thread.name || 'Nuevo Chat'}
                              onClick={() => setActiveThreadId(thread.threadId)}
                              threadId={thread.threadId}
                              className="w-full"
                            />
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                  )}
                </SidebarMenu>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Configuración">
                            <Link href="#">
                                <MessageCircle width={20} height={20} />
                                <span>Configuración</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter> */}
    </Sidebar>
  );
}
