"'use client'"
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import Image, { StaticImageData } from 'next/image'
import { useState } from 'react'
import { Button } from './ui/button'

type Props = {
    img: StaticImageData,
    altText?: string,
    category?: string,
    title?: string,
    description?: string,
    setIsActiveBlur?: (isActive: boolean) => void,
}

export default function HoverCard({ img, altText, title, category, description, setIsActiveBlur }: Props) {
    const [isActive, setIsActive] = useState(false);
    const cards = [
        { x: '-30%', rotate: 7, delay: 0.1 },
        { x: '-50%', rotate: -4, delay: 0.2 },
        { x: '-70%', rotate: -15, delay: 0.3 },
    ];
    return (
        <>
            <div className='w-24 h-24 rounded-[30px] relative cursor-pointer' onMouseEnter={() => { setIsActive(true); setIsActiveBlur?.(true); }} onMouseLeave={() => { setIsActive(false); setIsActiveBlur?.(false); }}>
                <div className={clsx('w-24 h-24 z-50')}
                >
                    <Image
                        src={img}
                        alt={altText ? altText : 'Imagen de ejemplo'}
                        className={clsx('absolute bottom-0 left-0 w-24 h-24 rounded-[30px] object-cover object-bottom transform transition-transform duration-300 ', isActive && 'z-50  scale-75 translate-y-4  mt-5')}
                    />
                </div>

                {isActive && (
                    <>
                        {cards.map(({ x, rotate, delay }, i) => (
                            <motion.div
                                key={i}
                                className="absolute bottom-10 z-50 w-52 h-72 rounded-xl overflow-hidden"
                                initial={{ opacity: 0, scale: 0.9, y: 50, x: '-30%', rotate: 7 }}
                                animate={{ opacity: 1, scale: 1, y: -20, x, rotate }}
                                exit={{ opacity: 0, scale: 0.9, y: 50, x: '-30%', rotate: 7 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 18,
                                    duration: 0.5,
                                    ease: 'easeOut',
                                    delay,
                                }}
                                style={{
                                    left: '50%',
                                    backgroundImage: `url(${img.src})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'bottom',
                                    WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 98%)',
                                }}
                            >
                                <div className="relative bg-gradient-to-b from-black/60 to-transparent w-full h-full" />
                            </motion.div>
                        ))}
                        {/* <motion.div
                            className='absolute bottom-10 z-50 w-52 h-72 rounded-xl overflow-hidden'
                            initial={{ opacity: 0, scale: 0.8, y: 40, x: "-50%", rotate: 0 }}
                            animate={{ opacity: 1, scale: 1, y: "-35px", x: "-80%", rotate: -15 }}
                            exit={{ opacity: 0, scale: 0.8, y: 40, x: "-50%", rotate: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 600,
                                damping: 18,
                                delay: 0.1, 
                            }}
                            style={{
                                left: "50%",
                                backgroundImage: `url(${img.src})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'bottom',
                                WebkitMaskImage: "linear-gradient(to bottom, black 75%, transparent 98%)",
                            }}
                        >
                            <div className='relative bg-gradient-to-b from-black/60 to-transparent w-full h-full' />
                        </motion.div>

                        <motion.div
                            className='absolute bottom-10 z-50 w-52 h-72 rounded-xl overflow-hidden'
                            initial={{ opacity: 0, scale: 0.8, y: 40, x: "-50%", rotate: 0 }}
                            animate={{ opacity: 1, scale: 1, y: "-35px", x: "-20%", rotate: 15 }}
                            exit={{ opacity: 0, scale: 0.8, y: 40, x: "-50%", rotate: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 600,
                                damping: 18,
                                delay: 0.2, 
                            }}
                            style={{
                                left: "50%",
                                backgroundImage: `url(${img.src})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'bottom',
                                WebkitMaskImage: "linear-gradient(to bottom, black 75%, transparent 98%)",
                            }}
                        >
                            <div className='relative bg-gradient-to-b from-black/60 to-transparent w-full h-full' />
                        </motion.div>

                        <motion.div
                            className='absolute bottom-10 z-50 w-52 h-72 rounded-xl overflow-hidden'
                            initial={{ opacity: 0, scale: 0.8, y: 0, x: "-50%" }}
                            animate={{ opacity: 1, scale: 1, y: "-55px", x: "-50%" }}
                            exit={{ opacity: 0, scale: 0.8, y: 0, x: "-50%" }}
                            transition={{
                                type: "spring",
                                stiffness: 600,
                                damping: 18,
                                delay: 0.3, 
                            }}
                            style={{
                                left: "50%",
                                backgroundImage: `url(${img.src})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'bottom',
                                WebkitMaskImage: "linear-gradient(to bottom, black 75%, transparent 98%)",
                            }}
                        >
                            <div className='relative bg-gradient-to-b from-black/60 to-transparent w-full h-full' />
                        </motion.div> */}

                        {/* Overlay para no cortar event onMouseEnter */}
                        <div className='absolute bottom-0 left-0 w-24 h-24 bg-transparent z-50'></div>

                        <motion.div
                            className="absolute top-16 min-w-52 pt-10 z-50 grid gap-1 text-center"
                            initial={{ opacity: 0, scale: 0.8, y: "-20px", x: "-50%" }}
                            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
                            exit={{ opacity: 0, scale: 0.8, y: "-20px", x: "-50%" }}
                            style={{ left: "50%" }}
                        >
                            <motion.span
                                className="font-medium text-2xl"
                                initial={{ opacity: 0, y: "-20px" }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: "-20px" }}
                                transition={{
                                    type: "spring",
                                    stiffness: 550,
                                    damping: 20,
                                    delay: 0.25,
                                }}
                            >
                                Cross Roads
                            </motion.span>

                            <motion.span
                                className="font-medium text-xs"
                                initial={{ opacity: 0, y: "-20px" }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: "-20px" }}
                                transition={{
                                    type: "spring",
                                    stiffness: 550,
                                    damping: 20,
                                    delay: 0.3,
                                }}
                            >
                                Explore the science of speed and aerodynamics through Formula 1
                            </motion.span>

                            <motion.div
                                initial={{ opacity: 0, y: "-20px" }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: "-20px" }}
                                transition={{
                                    type: "spring",
                                    stiffness: 550,
                                    damping: 20,
                                    delay: 0.35,
                                }}
                            >
                                <Button className="text-sm" onClick={() => { alert("CTA Clicked") }}>CTA</Button>
                            </motion.div>
                        </motion.div>
                    </>

                )}


            </div>
        </>
    )
}