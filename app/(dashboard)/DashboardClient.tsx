// app/dashboard/DashboardClient.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import heart from 'public/assets/images/cora3.png';
import { InputMain } from '@/components/ui/inputMain';
import CardsContainer from '@/components/CardsContainer';

import { createThread, getThreadById, getThreads } from '@/lib/threads';
import { getCardsDetails, getUser, streamAssistantReply } from '@/lib/api';
import { Card, ChatMessage, User } from '@/lib/types';
import { Loading, LoadingCards } from '@/components/loading';
import { cn } from '@/lib/utils';
import TypingDots from '@/components/typing-dots';
import clsx from 'clsx';
import Markdown from 'react-markdown';
import { motion } from 'framer-motion';
import { LINEAMIENTO_INSTRUCTION } from '@/lib/utils';
import { fetchImagesForCard } from '@/lib/unsplash';
import { useChatContext } from 'context/ChatContext';

export default function DashboardClient({
  userName,
  userEmail,
  userId,
  user
}: {
  userName: string;
  userEmail: string;
  userId: string;
  user: User;
}) {
  const [loading, setLoading] = useState(true);

  const {
    activeThreadId,
    setActiveThreadId,
    pendingThreadId,
    setPendingThreadId,
    handleFirstMessage,
    chatHistory,
    setChatHistory,
    loadingMessage,
    setLoadingMessage,
    setIsTyping
  } = useChatContext();
  const [assistantId, setAssistantId] = useState<string | null>(null);
  const [flagReload, setFlagReload] = useState(true);

  // Chat states
  const [message, setMessage] = useState('');
  const [hasSentMessage, setHasSentMessage] = useState(false);

  //Cards Content States
  const [contentCardsPrompt, setContentCardsPrompt] = useState<Card[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 640) {
      setIsMobile(true);
    }
  }, []);

  //Cargamos el thread
  useEffect(() => {
    if (flagReload) {
      setChatHistory([]);
      setHasSentMessage(false);
      setLoading(true)
    } else {
      setFlagReload(true);
    }
    if (!activeThreadId) return;
    const thread = getThreadById(activeThreadId);
    thread
      .then((data) => {
        if (data) {
          setChatHistory(data.messages);
          setAssistantId(data.assistantId);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error al cargar la conversación:', err);
      });
  }, [activeThreadId]);

  //Generamos el contenido de las tarjetas
  useEffect(() => {
    const fetchCardsData = async () => {
      const cached = user.cardsDetails;

      const isExpired =
        !cached ||
        Date.now() - new Date(cached.lastUpdated).getTime() > 86400000;

      //si no pasaron las 24HS devolvemos las tarjetas que ya teniamos guardadas
      if (!isExpired) {
        setContentCardsPrompt(cached.data);
        return;
      }

      setLoadingCards(true);

      const cards = await getCardsDetails(userId);
      const enrichedCards = await Promise.all(
        cards.cards.map(async (card: any) => {
          const images = await fetchImagesForCard(card.img_ref);

          return {
            title: card.title,
            description: card.description,
            prompt: card.prompt,
            images // array de 3 imágenes
          };
        })
      );

      setContentCardsPrompt(enrichedCards);

      await fetch('/api/user/update/card-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          cards: enrichedCards
        })
      });

      setLoadingCards(false);
    };

    fetchCardsData();
  }, []);

  //Hace que el scroll del chat este siempre al final
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  //Handlers
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || loadingMessage) return;

    if (!hasSentMessage) setHasSentMessage(true);

    let threadId = activeThreadId;
    let assistantIdUpdated = assistantId;

    setChatHistory((prev) => [...prev, { role: 'user', content: message }]);
    setLoadingMessage(true);
    setIsTyping(true)
    setMessage('');

    let assistantReply = '';
    let firstChunkReceived = false;

    // Agrega mensaje temporal vacío del assistant
    setChatHistory((prev) => [...prev, { role: 'assistant', content: '' }]);

    // Si es el primer mensaje en pending thread → marcar como usado
    if (activeThreadId === pendingThreadId) {
      await handleFirstMessage(userId, message);
    }

    await streamAssistantReply(
      {
        assistantId: assistantIdUpdated,
        threadId,
        userMessage: message,
        instruction: LINEAMIENTO_INSTRUCTION
      },
      (chunk: string) => {
        assistantReply += chunk;

        // Apaga el loading al primer chunk recibido
        if (!firstChunkReceived) {
          firstChunkReceived = true;
          setLoadingMessage(false);
        }

        // Actualiza el último mensaje con el texto acumulado
        setChatHistory((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: assistantReply
          };
          return updated;
        });
      }
    );
    setIsTyping(false)
  };

  if (loading && !loadingCards) {
    return <Loading />;
  }

  if (loadingCards) {
    return <LoadingCards />;
  }

  return (
    <div
      className={clsx(
        'grid w-full h-full justify-items-center',
        !chatHistory.length
          ? 'place-content-center gap-5 lg:gap-8'
          : 'grid-rows-[calc(100dvh-167px)_1fr]'
        //100dvh - 65px del header, 70px del input, 6px de padding-top y 16px de padding-bottom = 167px total a restar
      )}
    >
      {/* Título */}
      {!chatHistory.length && !hasSentMessage && (
        <div className="flex justify-center items-center leading-none tracking-tight transition-opacity duration-500">
          <div className="h-5 w-5 md:h-7 md:w-7 lg:h-9 lg:w-9 max-h-9 mr-4">
            <Image src={heart} alt="Corazon" height={36} width={36} />
          </div>
          <span className="text-lg min-[350px]:text-xl min-[400px]:text-2xl min-[475px]:text-3xl sm:text-4xl font-normal">
            <span className="font-medium capitalize">{userName}</span>, ¿que
            querés <span className="text-primary">explorar</span> hoy?
          </span>
        </div>
      )}

      {/* Chat messages */}
      {(chatHistory.length > 0 || hasSentMessage) && activeThreadId && (
        <div className="w-full h-full gap-2 p-4 grid overflow-y-auto transition-all duration-700">
          <div className="w-full max-w-3xl mx-auto px-4 flex flex-col justify-end gap-6 py-4">
            {chatHistory.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={cn(
                  'p-4 rounded-xl w-fit break-words',
                  msg.role === 'user'
                    ? 'ml-auto bg-white dark:bg-blue-600 max-w-[50%]'
                    : 'mr-auto'
                )}
              >
                {msg.role === 'user' ? (
                  <span className="text-sm">{msg.content}</span>
                ) : (
                  <div className="max-w-3xl w-full mx-auto px-4">
                    <Markdown
                      key={`${index}-${msg.content.length}`}
                      className="prose-lg dark:prose-invert text-base leading-relaxed max-w-none text-foreground"
                    >
                      {msg.content}
                    </Markdown>
                  </div>
                )}
                {loadingMessage &&
                  msg.role === 'assistant' &&
                  index === chatHistory.length - 1 && <TypingDots />}
              </motion.div>
            ))}

            <div ref={endOfMessagesRef} />
          </div>
        </div>
      )}

      {/* Input */}
      <div
        className={cn(
          'flex flex-col w-full transition-all duration-500',
          chatHistory.length || hasSentMessage
            ? 'fixed bottom-6 max-w-[670px] z-20 px-4'
            : 'relative'
        )}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(message);
          }}
        >
          <InputMain
            type="text"
            placeholder={
              isMobile
                ? 'Escribí una curiosidad...'
                : 'Escribí una pregunta o una curiosidad...'
            }
            value={message}
            onChange={handleMessageChange}
          />
        </form>
      </div>

      {/* Cards */}
      {!chatHistory.length && !hasSentMessage && (
        <CardsContainer
          contentCards={contentCardsPrompt}
          loading={loadingCards}
          handleClickCTA={handleSendMessage}
        />
      )}
    </div>
  );
}
