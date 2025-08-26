'use client';
import HoverCard from './HoverCard';
import { StaticImageData } from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import HoverCardMobile from './HoverCardMobile';

type Props = {
  contentCards: {
    images: { url: string; alt: string }[];
    title: string;
    prompt: string;
    description: string;
  }[];
  loading?: boolean;
  handleClickCTA: (message: string) => void;
};

export default function CardsContainer({ contentCards, loading, handleClickCTA }: Props) {
  const [isActiveOverlay, setIsActiveOverlay] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">Cargando tarjetas...</p>
      </div>
    );
  }

  return (
    <>
      {/* className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10 mt-2' */}
      <div className="hidden lg:grid lg:grid-cols-4 lg:gap-7 lg:mt-2">
        {contentCards.map((card, index) => (
          <AnimatePresence key={`${card.title}-animate`}>
          <HoverCard
            key={card.title}
            images={card.images}
            title={card.title}
            description={card.description}
            setIsActiveOverlay={setIsActiveOverlay}
            isActiveOverlay={isActiveOverlay}
            handleClickCTA={handleClickCTA}
            prompt={card.prompt}
          />
          </AnimatePresence>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:hidden">
        {/* {contentCards.map((card, index) => (
          <HoverCardMobile
            key={index}
            img={card.img}
            title={card.title}
            category={card.category || ''}
            description={card.description}
            layoutId={`card${index}`}
          />
        ))} */}
      </div>
      {isActiveOverlay && (
        <motion.div
          className="fixed inset-0 lg:backdrop-blur-sm w-screen h-dvh top-0 left-0 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0, ease: 'easeInOut' }}
        />
      )}
    </>
  );
}
