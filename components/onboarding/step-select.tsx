import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { animation, Subtitle, Title } from './headings';
import { motion } from 'framer-motion';
import argFlag from "public/assets/images/flags/arg.svg"
import colFlag from "public/assets/images/flags/col.svg"
import mexFlag from "public/assets/images/flags/mex.svg"
import chiFlag from "public/assets/images/flags/chi.svg"
import espFlag from "public/assets/images/flags/esp.svg"
import brFlag from "public/assets/images/flags/br.svg"
import usaFlag from "public/assets/images/flags/usa.svg"
import uruFlag from "public/assets/images/flags/uru.svg"

import { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { QuestionStep } from '@/lib/types';
import clsx from 'clsx';
import Image, { StaticImageData } from 'next/image';

type Props = {
  step: QuestionStep;
  stateIndex:Number;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  onClick: (value: string) => void;
};

export const countryFlags: Record<string, StaticImageData> = {
  Argentina: argFlag,
  Colombia: colFlag,
  México: mexFlag,
  Uruguay: uruFlag,
  Chile: chiFlag,
  España: espFlag,
  Brasil: brFlag,
  'Estados Unidos': usaFlag
};

export default function StepSelect({ step,stateIndex, register, errors, onClick }: Props) {
  return (
    <AnimatePresence>
      <div className="grid text-center justify-items-center h-fit">
        <div className="mb-5 grid gap-3 h-fit">
          {step?.title && (
            <Title
              id={`question-${step._id}`}
              animation={animation}
              className=""
            >
              {step.title}
            </Title>
          )}
          {step?.subtitle && (
            <Subtitle
              id={`subtitle-${step._id}`}
              animation={animation}
              stepType={step.typeInput}
            >
              {step?.subtitle}
            </Subtitle>
          )}
        </div>
        <motion.div
          key={`container-${step._id}`}
          {...animation}
          className={clsx(
            'grid gap-2',
            step.options?.length == 3
              ? 'grid-cols-3 w-full max-md:max-w-[352px]'
              : 'grid-cols-2 md:grid-cols-4'
          )}
        >
          {step.options?.map((item) => (
            <button
              key={item.img}
              onClick={() => onClick(item.title)}
              className={clsx(
                `h-28 w-full max-md:max-w-32 py-2 px-4 rounded-xl border-[1.3px] text-sm font-medium transition hover:bg-[#DDF4FF] hover:text-[#1899D6] hover:border-[#84D8FF]  `,
                step.options?.length == 3
                  ? 'font-semibold text-xl h-36 md:text-4xl md:h-52 md:w-40 border-[#E5E5E5] border-2 text-[#AFAFAF]'
                  : 'md:w-36 md:h-32'
              )}
            >
              <div className="flex flex-col items-center justify-center gap-2">
              {item.img && (
                <Image
                  src={`/assets/images/flags/${item.img}.svg` || '/flags/default.png'}
                  alt={`Bandera de ${item.title}`}
                  width={63}
                  height={43}
                  className="object-cover"
                />
              )}
                <span>{item.title}</span>
              </div>
            </button>
          ))}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
