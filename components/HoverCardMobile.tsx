'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StaticImageData } from 'next/image'

type Props = {
    img: {
        imgIcon: StaticImageData
        imgCenter: StaticImageData
        imgLeft: StaticImageData
        imgRight: StaticImageData
    }
    title?: string
    description?: string
    layoutId: string,
    category: string
}

export default function HoverCardMobile({ img, title = 'Surprise!', description = 'Explore something cool', layoutId, category }: Props) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <motion.div
                key="trigger"
                layoutId={layoutId}
                onClick={() => setIsOpen(true)}
                className="relative w-24 h-24 rounded-4xl bg-cover bg-bottom cursor-pointer"
                whileTap={{ scale: 0.95 }}

                transition={{
                    duration: 0.3,
                    ease: [0, 0.71, 0.2, 1.01],
                }}
                style={{
                    backgroundImage: `url(${img.imgCenter.src})`
                }}
            />
            <AnimatePresence mode="wait">



                {isOpen && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center'>
                        {/* Fondo oscuro */}
                        <motion.div
                            className="inset-0 bg-black/50 backdrop-blur-sm z-40 h-dvh w-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Card expandido */}
                        <motion.div
                            layoutId={layoutId}
                            className="absolute z-50 min-w-[213px] w-[70vw] sm:w-[25vw] max-w-sm aspect-[3/4] rounded-2xl bg-cover bg-bottom flex flex-col justify-end text-white overflow-hidden border-8 shadow-sm border-[#F5F5F7]"
                            style={{
                                backgroundImage: `url(${img.imgCenter.src})`
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8, y: 100 }} // 👈 animación de salida personalizada
                            transition={{ type: "spring", stiffness: 400, damping: 30, layout: { duration: 0.2 } }}
                        >
                            <div className='bg-gradient-to-b from-black/60 to-transparent w-full h-full py-5 px-4 grid'
                            >
                                <div className='z-60 grid gap-1 h-fit'>
                                    {category && <span className='text-[10px] font-bold text-white'>{category}</span>}
                                    {title && <h3 className='text-xl font-bold text-white'>{title}</h3>}
                                    {description && <p className='text-xs font-light text-white'>{description}</p>}
                                </div>
                                {/* <motion.button
                                    onClick={() => setIsOpen(false)}
                                    className="bg-primary text-primary-foreground h-fit w-fit py-1 px-4 rounded text-sm self-end justify-self-center"
                                >
                                    Let's Explore
                                </motion.button> */}
                            </div>


                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </>
    )
}
