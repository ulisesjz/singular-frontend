"'use client'"
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import Image, { StaticImageData } from 'next/image'
import { useState } from 'react'

type Props = {
    img: StaticImageData,
    altText?: string,
    category?: string,
    title?: string,
    description?: string,
}

export default function PopupCard({ img, altText, title, category, description }: Props) {
    const [isActive, setIsActive] = useState(false);
    return (
        <>
            <div className='w-24 h-24 rounded-[30px] relative cursor-pointer' onMouseEnter={() => setIsActive(true)} onMouseLeave={() => setIsActive(false)}>
                <div
                    onClick={() => setIsActive(!isActive)}

                >
                    <Image
                        src={img}
                        alt={altText ? altText : 'Imagen de ejemplo'}
                        className='absolute bottom-0 left-0 w-24 h-24 rounded-[30px] object-cover object-bottom'
                    />
                </div>
                <AnimatePresence>
                    {isActive && (
                        <motion.div
                            className='absolute bottom-10 z-50 w-52 h-72 rounded-xl overflow-hidden'
                            initial={{ opacity: 0, scale: 0.8, y: 30, x: "-50%" }}
                            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
                            exit={{ opacity: 0, scale: 0.8, y: 30, x: "-50%" }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            style={{
                                left: "50%",
                                backgroundImage: `url(${img.src})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'bottom',
                            }}
                        >
                            <div className='relative bg-gradient-to-b from-black/60 to-transparent w-full h-full'
                            >
                                <div className='z-60 p-4 grid gap-1'>
                                    {category && <span className='text-[10px] font-bold text-white'>{category}</span>}
                                    {title && <h3 className='text-xl font-bold text-white'>{title}</h3>}
                                    {description && <p className='text-xs font-light text-white'>{description}</p>}
                                </div>


                                {/* <Image
                                    src={img}
                                    alt={altText ? altText : 'Imagen de ejemplo'}
                                    fill
                                    className='object-cover z-50'
                                /> */}
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
                {/* Hace que no se dispare el efecto de onMouseEnter con OnMouseLeave */}
                <div className='absolute top-0 left-0 w-24 h-24 z-20'></div>
            </div>
            <AnimatePresence>
                {isActive &&
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className='fixed inset-0 bg-white/40 w-screen h-dvh top-0 left-0 z-10'
                    >

                    </motion.div>
                }

            </AnimatePresence>
        </>
    )
}