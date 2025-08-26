import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { animation, Subtitle, Title } from './headings';
import clsx from 'clsx';
import { ButtonNext } from '@/components/Button';

import { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { QuestionStep } from '@/lib/types';

type Props = {
  step: QuestionStep;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  onClick: () => void;
};

export default function StepArea({ step, register, errors, onClick }: Props) {
  return (
    <AnimatePresence>
      <div className="grid text-center justify-items-center h-fit">
        <div className="mb-7 grid gap-1 h-fit">
          {step?.title && (
            <Title id={`question-${step._id}`} animation={animation}>
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
        <textarea
          key={step._id}
          autoFocus
          className="focus:outline-none bg-transparent text-2xl lg:text-[28px] max-sm:max-w-80 w-full lg:w-[700px] text-[#ADCDDC] border-[#ADCDDC] border-b-2 resize-none 
    max-h-[128px] md:max-h-[160px]
    overflow-y-auto font-light"
          rows={2}
          {...register(step._id, {
            required: 'Este campo es obligatorio',
            validate: {
              notEmpty: (value) =>
                value.trim().length > 0 || 'El campo no puede estar vacío',
              notGeneric: (value) =>
                !['no sé', 'nose', 'no se', 'nada'].includes(
                  value.trim().toLowerCase()
                ) || 'Dale, animate a contarnos algo más :)'
            }
          })}
        />
        {errors[step._id] && (
          <p className="text-red-500 text-sm mt-2">
            <p>{errors[step._id]?.message as string}</p>
          </p>
        )}
      </div>
      <ButtonNext onClick={onClick}>Seguir</ButtonNext>
    </AnimatePresence>
  );
}
