import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { animation, Subtitle, TextFadeIn, Title } from './headings';
import clsx from 'clsx';
import Image from 'next/image';
import heart from 'public/assets/images/cora3.png';
import { ButtonNext } from '@/components/Button';
import { QuestionStep } from '@/lib/types';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

type Props = {
  step: QuestionStep;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  onClick: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export default function StepInput({ step, register, errors, onClick, handleKeyDown }: Props) {
  return (
    <AnimatePresence>
      <div className="grid text-center justify-items-center h-fit">
        <div className="mb-9 grid gap-3 h-fit">
          {step?.title && (
          <Title id={`question-${step._id}`} animation={animation} classname='lg:text-[2.5rem] text-foreground'>
              <span className={clsx('hidden sm:font-medium sm:flex')}>
                <Image
                  src={heart}
                  alt="Corazon"
                  height={36}
                  width={36}
                  className="mr-3 h-9 w-9"
                />
                Hola,{' '}
              </span>
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
        <input
          type="text"
          autoFocus
          onKeyDown={handleKeyDown}
          className="focus:outline-none bg-transparent text-7xl w-full text-center text-[#ADCDDC] sm:text-primary"
          {...register(step._id, {
            required: 'Este campo es obligatorio',
            validate: (value) =>
              value.trim().length > 0 || 'El campo no puede estar vacío'
          })}
        />
        {errors[step._id] && (
          <p className="text-red-500 text-sm mt-2">
            <p>{errors[step._id]?.message as string}</p>
          </p>
        )}
      </div>
      <ButtonNext onClick={onClick}>Comenzar</ButtonNext>
    </AnimatePresence>
  );
}
