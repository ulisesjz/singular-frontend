'use client';
import clsx from 'clsx';
import { motion, scale } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useTheme } from 'next-themes';

type Props = {
  images: { url: string; alt: string }[];
  title: string;
  prompt: string;
  description: string;
  isActiveOverlay?: boolean;
  setIsActiveOverlay?: (isActive: boolean) => void;
  handleClickCTA: (message: string) => void;
};

export default function HoverCard({
  images,
  title,
  description,
  prompt,
  setIsActiveOverlay,
  isActiveOverlay,
  handleClickCTA
}: Props) {
  const [isActive, setIsActive] = useState(false);

  const { theme } = useTheme();

  return (
    <div
      className="w-24 h-24 relative cursor-pointer"
      onMouseEnter={() => {
        setIsActive(true);
        setIsActiveOverlay?.(true);
      }}
      onMouseLeave={() => {
        setIsActive(false);
        setIsActiveOverlay?.(false);
      }}
    >
      <div className={clsx('w-24 h-24 z-50')}>
        <Image
          src={images[2].url}
          alt={images[2].alt}
          width={96}
          height={96}
          className={clsx(
            'absolute bottom-0 left-0 w-24 h-24 rounded-4xl object-cover object-bottom transform transition-transform duration-300 z-20',
            isActive && ' scale-75 translate-y-[12px] duration-300 mt-5',
            theme === 'dark' && 'filter brightness-75',
            isActiveOverlay && !isActive && 'blur-sm'
          )}
        />
      </div>

      {isActive && (
        <>
          {[
            /*LeftCard*/
            {
              id: 'left',
              x: '-110%',
              rotate: -19,
              delay: 0.1,
              y: '-52px',
              image: images[0].url,
              scale: 1
            },
            /*RightCArd*/
            {
              id: 'right',
              x: '10%',
              rotate: 19,
              delay: 0.1,
              y: '-52px',
              image: images[1].url,
              scale: 1
            },
            /*CEnterCard*/
            {
              id: 'center',
              x: '-50%',
              rotate: 0,
              delay: 0.1,
              y: '-55px',
              image: images[2].url,
              scale: 1
            }
          ].map(({ id, x, rotate, delay, y, image, scale }, i) => (
            <motion.div
              key={`${title}-image-${i}`}
              className={clsx(
                'absolute bottom-10 z-50  rounded-2xl overflow-hidden',
                id == 'center' && 'w-[212px] h-[285px]',
                id == "left" && 'w-[182px] h-[242.5px]', id == "right" && 'w-[182px] h-[242.5px]'
              )}
              initial={{ opacity: 0, scale: 0.8, y: 40, x: '-50%', rotate: 0 }}
              animate={{ opacity: 1, scale, y, x, rotate }}
              exit={{ opacity: 0, scale: 0, y: 150, x: '-50%', rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 25,
                delay
              }}
              style={{
                left: '50%',
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'bottom'
              }}
            >
              <div className="relative bg-gradient-to-b from-black/5 to-transparent w-full h-full" />
            </motion.div>
          ))}

          {/* Hace que no se dispare el event onMouseLeave */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-[50%] w-24 h-24 bg-transparent z-50"></div>

          <motion.div
            className="absolute top-16 min-w-64 pt-10 z-50 grid text-center"
            initial={{ opacity: 0, scale: 0.8, y: '-20px', x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.8, y: '-20px', x: '-50%' }}
            transition={{ duration: 0.1 }}
            style={{ left: '50%' }}
          >
            <motion.span
              className="text-3xl font-medium text-[#3D3D3A]"
              initial={{ opacity: 0, y: '-20px' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-20px' }}
              transition={{
                type: 'spring',
                stiffness: 550,
                damping: 20,
                delay: 0.1
              }}
            >
              {title}
            </motion.span>

            <motion.span
              className="text-sm text-foreground/80 leading-relaxed mb-2 text-balance"
              initial={{ opacity: 0, y: '-20px' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-20px' }}
              transition={{
                type: 'spring',
                stiffness: 550,
                damping: 20,
                delay: 0.15
              }}
            >
              {description}
              {/* Explore the <span className='italic text-primary'>science of speed</span> and <span className='italic text-primary'> aerodynamics</span> through <span className='font-bold dark:text-primary-foreground'>Formula 1</span> */}
            </motion.span>

            <motion.div
              initial={{ opacity: 0, y: '-20px' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-20px' }}
              transition={{
                type: 'spring',
                stiffness: 550,
                damping: 20,
                delay: 0.2
              }}
            >
              <Button
                className="text-xs font-medium rounded-full px-5 py-2.5 transition-transform hover:scale-105"
                onClick={() => handleClickCTA(prompt)}
              >
                Let’s explore!
              </Button>
            </motion.div>
          </motion.div>
        </>
      )}
    </div>
  );
}
