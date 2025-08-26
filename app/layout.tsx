import './globals.css';
import './custom.css';

import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from "next-auth/react";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ThemeProvider } from "@/components/ThemeProvider"
import { ChatProvider } from 'context/ChatContext';

export const metadata = {
  title: 'Singular',
  description:
    'Singular AI Tutor',
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`flex min-h-screen w-full flex-col bg-background text-foreground antialiased ${GeistSans.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <ChatProvider>
              {children}
            </ChatProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
      <Analytics />
    </html>
  );
}
