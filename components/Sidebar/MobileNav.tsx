'use client';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useChatContext } from 'context/ChatContext';
import { PanelLeft, SquarePen } from 'lucide-react';
import { HomeIcon } from '@/components/header-icons.jsx';
import { NavItem } from 'app/(dashboard)/nav-item';
import clsx from 'clsx';

export function MobileNav() {
    const { threads, activeThreadId, setActiveThreadId } = useChatContext();

    const handleNewThread = async () => {
        setActiveThreadId('');
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-5 text-lg font-medium pt-5 ">
                    <Link
                        href="/#"
                        className="flex items-center gap-4 px-2.5 text-white hover:text-foreground"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 bg-primary ">
                            <HomeIcon width={20} height={20} />
                        </div>
                        Home
                    </Link>
                    <div className="flex flex-col items-left gap-1 px-2 sm:py-5">
                        <h4 className="text-sm font-medium text-muted-foreground px-2">Chats</h4>
                        <NavItem href="#" label="Nuevo chat" onClick={handleNewThread}>
                            <SquarePen
                                width={20}
                                height={20}
                                strokeWidth={1.5}
                                color="gray"
                                className="cursor-default"
                            />
                        </NavItem>
                        {threads.map((thread: any) => (
                            thread.messages && thread.messages.length > 0 && (
                                <Link
                                    key={thread.threadId}
                                    href="#"
                                    className={clsx("flex items-center gap-4 px-2.5 text-white hover:text-foreground font-normal my-1 py-2 text-sm", {
                                        'border border-primary bg-primary/10 rounded-lg': activeThreadId === thread.threadId
                                    })}
                                    onClick={() => setActiveThreadId(thread.threadId)}
                                >
                                    {thread.messages[0].content}
                                </Link>
                            )
                        ))}
                    </div>

                </nav>
            </SheetContent>
        </Sheet>
    );
}