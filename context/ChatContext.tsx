'use client';
import {
  createThread,
  deleteThread,
  getThreadById,
  getThreads,
  updateThread
} from '@/lib/threads';
import { ChatMessage } from '@/lib/types';
import { BASE_URL } from '@/lib/utils';
import { createContext, useContext, useEffect, useState } from 'react';
import { threadId } from 'worker_threads';

interface Thread {
  _id?: string;
  assistantId: string;
  threadId: string;
  userEmail: string;
  createdAt: Date;
  messages: any[]; // o ThreadMessage[]
  isPendingThread: boolean;
  name: string | null;
}

interface ChatContextType {
  threads: Thread[];
  setThreads: React.Dispatch<React.SetStateAction<Thread[]>>;
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
  pendingThreadId: string | null;
  setPendingThreadId: (id: string | null) => void;
  userEmail: string | null;
  handleFirstMessage: (userId: string, message: string) => Promise<void>;
  handleDeleteThread: (threadId: string) => Promise<void>;
  assistantId: string;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  loadingMessage: boolean;
  setLoadingMessage: (state: boolean) => void;
  isTyping: boolean;
  setIsTyping: (state: boolean) => void;
}

const ChatContext = createContext<ChatContextType>({
  threads: [],
  setThreads: () => { },
  activeThreadId: null,
  setActiveThreadId: () => { },
  pendingThreadId: null,
  setPendingThreadId: () => { },
  userEmail: null,
  handleFirstMessage: async () => { },
  handleDeleteThread: async () => { },
  assistantId: '',
  chatHistory: [],
  setChatHistory: () => { },
  loadingMessage: false,
  setLoadingMessage: () => { },
  isTyping: false,
  setIsTyping: () => { }
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [pendingThreadId, setPendingThreadId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false)
  //const assistantId = 'asst_idxwrgJMC4ZDty85dg5CnCYo';
  const assistantId = process.env.NEXT_PUBLIC_ASSISTANT_ID;

  console.log(assistantId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await fetch('/api/auth/me');
        const sessionData = await sessionRes.json();

        if (!sessionRes.ok || !sessionData.email) {
          console.error('Usuario no autorizado o email no disponible');
          return;
        }
        setUserEmail(sessionData.email);
        const data = (await getThreads()) as {
          threads: Thread[];
        };

        if (data) {
          const visibleThreads = data.threads.filter((t) => !t.isPendingThread);
          const pendingThread = data.threads.find((t) => t.isPendingThread);

          setThreads(visibleThreads);

          if (pendingThread) {
            setPendingThreadId(pendingThread.threadId);
            setActiveThreadId(pendingThread.threadId);
          } else {
            // Si no hay thread pendiente, crear uno
            const newPending = await createThread(
              assistantId,
              sessionData.email
            );
            setPendingThreadId(newPending);
          }
        }
      } catch (err) {
        console.error('Error al cargar threads:', err);
      }
    };

    fetchData();
  }, []);

  const handleFirstMessage = async (userId: string, message: string) => {
    if (!activeThreadId) return;

    // Marcar thread como usado
    await updateThread(activeThreadId, { isPendingThread: false });

    // Agregarlo a la lista visible
    const usedThread = await getThreadById(activeThreadId);
    if (usedThread) {
      setThreads((prev) => [usedThread as Thread, ...prev]);
    }

    //crear nuevo pending thread
    if (userEmail) {
      const newPending = await createThread(assistantId, userEmail);

      if (newPending) {
        setPendingThreadId(newPending);
      } else {
        console.error('No se pudo crear el pending thread');
      }
    }

    //Iniciar stream para generar nombre del thread
    const response = await fetch(`${BASE_URL}/thread/generate-name`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        threadId: activeThreadId,
        firstMessage: message
      })
    });

    if (!response.body) {
      console.error('No stream body');
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let nameBuffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);

      // Detectar nombre final
      if (chunk.includes('event: finalName')) {
        const match = chunk.match(/data:\s*(.*)/);
        if (match) {
          const finalName = JSON.parse(match[1]);
          setThreads((prevThreads) =>
            prevThreads.map((t) =>
              t.threadId === activeThreadId ? { ...t, name: finalName } : t
            )
          );
        }
      }
    }
  };

  const handleDeleteThread = async (threadId: string) => {
    try {
      await deleteThread(threadId); // llamada a API
      setThreads((prev) => prev.filter((t) => t.threadId !== threadId));

      // Si borraste el activo, limpiar activeThreadId
      if (activeThreadId === threadId) {
        setActiveThreadId(null);
      }
    } catch (err) {
      console.error('Error deleting thread:', err);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        threads,
        setThreads,
        activeThreadId,
        setActiveThreadId,
        pendingThreadId,
        setPendingThreadId,
        userEmail,
        handleFirstMessage,
        handleDeleteThread,
        assistantId,
        chatHistory,
        setChatHistory,
        loadingMessage,
        setLoadingMessage,
        isTyping,
        setIsTyping
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
}
