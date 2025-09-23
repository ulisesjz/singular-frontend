'use client';
import * as React from 'react';
import { useEffect, useReducer, useState } from 'react';
import logo from 'public/assets/images/singular-logo.svg';
import singularText from 'public/assets/images/singular-text-pause0.svg';
import emoji1 from 'public/assets/images/emoji1.png';
import emoji2 from 'public/assets/images/emoji2.png';
import emoji3 from 'public/assets/images/emoji3.png';
import Image from 'next/image';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { ProgressGuide } from '@/components/progress-guide';
import { ChevronLeft } from 'lucide-react';
import StepInput from '@/components/onboarding/step-input';
import { Subtitle, TextFadeIn } from '@/components/onboarding/headings';
import StepSelect from '@/components/onboarding/step-select';
import StepPause from '@/components/onboarding/step-pause';
import StepArea from '@/components/onboarding/step-area';
import { ButtonNext } from '@/components/Button';
import { createThread } from '@/lib/threads';
import { Sorts_Mill_Goudy } from 'next/font/google';
import Link from 'next/link';

import type { InfoStep, PauseStep, QuestionStep, Step } from '@/lib/types';
import { Loading } from '@/components/loading';
import { getQuestions, sendAnswers } from '@/lib/api';
import { useChatContext } from 'context/ChatContext';

const sortsMillGoudy = Sorts_Mill_Goudy({
  weight: ['400'], // Solo soporta 400 normal e italic
  subsets: ['latin'],
  style: ['normal', 'italic'], // Si querés cursiva
  display: 'swap' // Para mejor performance
});

type Props = {};

export default function page({ }: Props) {
  const infoSteps = [
    // {
    //   title: '¡Hola!',
    //   subtitles: ['Es un gusto enorme tenerte en este viaje :)'],
    //   action: 'NEXT',
    //   cta: 'Siguiente',
    //   typeInput: 'info'
    // },
    {
      subtitles: [
        // <>
        //   En <span className="font-bold">Singular</span>, creemos que aprender
        //   es algo extraordinario.
        // </>,
        'Aprender es algo extraordinario.',
        'Al expandir lo que sabemos, crece nuestra capacidad',
        'de imaginar, de soñar, y de transformar el mundo.',
        'Y ocurre de verdad cuando seguimos nuestra curiosidad.',
        'Por eso creamos una experiencia que guía a cada persona',
        ' a descubrir quién es. A conectar con sus intereses.',
        'Y a desplegar su potencial infinito.'
      ],
      action: 'NEXT',
      cta: 'Comenzar',
      typeInput: 'info'
    },
    {
      subtitles: [
        'Para personalizar tu experiencia vamos a hacerte unas preguntas.',
        <>
          Antes, queremos que sepas qué nos hace distintos de{' '}
          <span className="font-normal">ChatGPT</span>.
        </>
      ],
      action: 'NEXT',
      cta: 'Comenzar',
      typeInput: 'info'
    }
  ];

  const pauseSteps = [
    {
      _id: 'pause-1',
      title: { mobile: 'Sigamos :)', desktop: '¡Gracias!' },
      subtitle: {
        mobile: [
          'Así conocemos qué te mueve, cómo pensás y qué te entusiasma.'
        ],
        desktop: [
          'Lo que nos cuentes va a ayudar a que el tutor te entienda mejor: qué te mueve, cómo pensás, qué te entusiasma.',
          'No hay respuestas correctas ni incorrectas.',
          'Solo sé vos.'
        ]
      },
      action: 'NEXT',
      cta: { mobile: 'Siguiente', desktop: '¡Estoy listo!' },
      typeInput: 'pause',
      image: true
    },
    {
      _id: 'pause-2',
      title: { mobile: '¡Gracias!', desktop: '¡Qué gustazo!' },
      subtitle: {
        mobile: [
          'Quedan 5 preguntas más para que tu tutor se adapte mejor a vos.',
          '¿Seguimos?'
        ],
        desktop: [
          'Si tenés ganas, hay 5 preguntas más para que tu tutor te conozca mejor.',
          'Si no, podés pasar y arrancamos directo.'
        ]
      },
      action: 'NEXT',
      cta: { mobile: 'Seguir', desktop: '¡Seguimos!' },
      typeInput: 'pause',
      skippable: true,
      image: true
    },
    {
      _id: 'pause-3',
      title: {
        mobile: 'Listo,',
        desktop: '¡Tu espacio para aprender está listo!'
      },
      subtitle: {
        mobile: [
          'Tu espacio para aprender está listo.',
          ' Preguntá, explorá, y creá sin límites.',
          'lorem iosum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
          '¡Nos vemos dentro!'
        ],
        desktop: ['Preguntá, explorá y creá sin límites.', '¡Nos vemos dentro!']
      },
      cta: { mobile: 'Entrar', desktop: 'Entrar' },
      typeInput: 'pause',
      image: true,
      finish: true
    }
  ];

  const { setPendingThreadId, assistantId } = useChatContext()

  const [steps, setSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getQuestions();
        setSteps([
          ...infoSteps.slice(0, 1),
          ...data.questions.slice(0, 1),
          infoSteps[1],
          ...data.questions.slice(1, 3),
          pauseSteps[0],
          ...data.questions
            .slice(3, 9)
            .map((q: QuestionStep) => ({ ...q, hasGuide: true, fase: 2 })),
          pauseSteps[1],
          ...data.questions
            .slice(9)
            .map((q: QuestionStep) => ({ ...q, hasGuide: true, fase: 3 })),
          pauseSteps[2]
        ]);
        setIsLoading(false);
      } catch (err) {
        console.error('Error cargando preguntas:', err);
      }
    };

    fetchData();
  }, []);

  type OnboardingState = {
    stepIndex: number;
  };

  type Action = { type: 'NEXT' } | { type: 'BACK' } | { type: 'END' };

  function onboardingReducer(
    state: OnboardingState,
    action: Action
  ): OnboardingState {
    switch (action.type) {
      case 'NEXT':
        return { ...state, stepIndex: state.stepIndex + 1 };
      case 'BACK':
        return { ...state, stepIndex: state.stepIndex - 1 };
      case 'END':
        return { ...state, stepIndex: steps.length - 1 };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(onboardingReducer, {
    stepIndex: 0
  });

  const currentStep = steps[state.stepIndex];
  const currentFase =
    currentStep && 'fase' in currentStep && typeof currentStep.fase === 'number'
      ? currentStep.fase
      : null;

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    mode: 'onChange'
  });

  const name = watch(!isLoading ? (isQuestionStep(steps[1]) && steps[1]._id || '') : '');

  const handleSteps = async (action: Action) => {
    if (
      'required' in currentStep &&
      currentStep.required &&
      action.type === 'NEXT'
    ) {
      const isValid = await trigger(currentStep._id);
      if (!isValid) return;
    }

    const currentIndex = steps.findIndex((step) => step === currentStep);
    const nextStep = steps[currentIndex + 1];

    if (nextStep && steps[steps.length - 1] === nextStep) {
      handleSendData();
    }

    dispatch(action);
  };

  const handleClickSelected = (item: string) => {
    setSelectedCountry(item);
    setValue((currentStep as QuestionStep)._id, item);
    handleSteps({ type: 'NEXT' });
  };

  const handleSendData = async () => {
    const formData = getValues();
    const answers = Object.entries(formData).map(([questionId, response]) => ({
      questionId,
      response
    }));

    try {
      const sessionRes = await fetch('/api/auth/me');
      const sessionData = await sessionRes.json();

      if (!sessionRes.ok || !sessionData._id) {
        console.error('Usuario no autorizado o ID no disponible');
        return;
      }

      const userId = sessionData._id;
      const userEmail = sessionData.email;

      const threadId = await createThread(
        assistantId,
        userEmail
      );
      setPendingThreadId(threadId)
      sendAnswers(userId, answers);
      dispatch({ type: 'END' });
    } catch (error) {
      console.error('Error en handleSendData:', error);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (
      e.key === 'Enter' &&
      (currentStep.typeInput === 'input' || currentStep.typeInput === 'area')
    ) {
      e.preventDefault();
      handleSteps({ type: 'NEXT' });
    }
  };

  const handleFinish = async () => {
    window.location.href = '/';
  };

  function isQuestionStep(step: Step): step is QuestionStep {
    return (
      step.typeInput === 'input' ||
      step.typeInput === 'select' ||
      step.typeInput === 'area'
    );
  }
  function isInfoStep(step: Step): step is InfoStep {
    return step.typeInput === 'info';
  }

  const stepGlobalIndex = (() => {
    if (!currentStep || !('fase' in currentStep) || !currentStep.hasGuide)
      return null;

    const guideStepsInFase = steps.filter(
      (step): step is QuestionStep =>
        isQuestionStep(step) &&
        !!step.hasGuide &&
        step.fase === currentStep.fase
    );

    const indexInFase = guideStepsInFase.findIndex(
      (step) => step === currentStep
    );

    return indexInFase === -1 ? null : indexInFase;
  })();

  const animation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4 }
  };

  const animationFadeInX = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
    transition: { duration: 0.4 }
  };

  if (isLoading) {
    return <Loading />;
  }
  return (
    <motion.div
      className={clsx(
        'relative h-dvh w-full grid  grid-cols-1',
        currentStep.typeInput == 'info' && 'px-7 pb-10 pt-12 md:pt-24',
        // state.stepIndex == 0 && 'grid-rows-[1fr_minmax(120px,180px)_56px]  ',
        currentStep.typeInput == 'input' &&
        'sm:grid-rows-[minmax(120px,_225px)_56px] md:grid-rows-[193px_56px] md:place-content-center',
        currentStep.typeInput == 'area' &&
        'md:grid-rows-[minmax(120px,_268px)_56px] md:pt-[185px] gap-5',
        currentStep.typeInput == 'pause'
          ? 'max-md:grid-rows-2 md:grid-cols-2 justify-items-start'
          : 'max-w-[1280px] mx-auto justify-items-center',
        currentStep.typeInput === 'pause' &&
        'finish' in currentStep &&
        currentStep.finish &&
        'justify-items-center',
        currentStep.typeInput == 'select' &&
        `max-md:pt-32 md:pt-40 pb-10 grid-rows-[1fr_56px]`
      )}
    >
      <Image
        src={logo.src}
        alt="image"
        width={293}
        height={165}
        className={clsx(
          'justify-self-center self-center',
          state.stepIndex >= 0 &&
          'absolute top-4 left-7 h-14 w-28 lg:w-[123px] lg:h-[69px] object-contain opacity-60 hover:opacity-100 transition-opacity',
          currentStep.typeInput == 'pause' && 'hidden'
        )}
      />
      {isInfoStep(currentStep) && state.stepIndex == 0 && (
        <>
          <div className="grid gap-3 md:gap-10 justify-items-center h-fit sm:max-w-[550px] text-center self-center">
            <TextFadeIn
              key={`title-step-${state.stepIndex}`}
              animation={animation}
              className="font-bold text-4xl"
            >
              {currentStep.title}
            </TextFadeIn>
            <div
              className={`grid leading-[25px] max-sm:max-w-[300px] sm:max-w-[550px] text-left ${sortsMillGoudy.className}`}
            >
              {currentStep.subtitles.map((sub, i) => (
                <TextFadeIn
                  key={`subtitle-step-${state.stepIndex}-${i}`}
                  animation={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -10 },
                    transition: { duration: 0.5, delay: i * 0.3 } // ⬅ delay en cadena
                  }}
                  className="font-light text-xl"
                >
                  {sub}
                </TextFadeIn>
              ))}
              <motion.div
                key={'singular text'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.4,
                  delay: currentStep.subtitles.length * 0.3
                }}
              >
                <Image
                  src={singularText.src}
                  alt="singular"
                  width={95}
                  height={27}
                  className={clsx(
                    state.stepIndex == 0 ? 'flex mt-3' : 'hidden'
                  )}
                />
              </motion.div>
            </div>

            <ButtonNext
              onClick={() => handleSteps({ type: 'NEXT' })}
              animation={state.stepIndex === 0 ? {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -10 },
                transition: { duration: 0.5, delay: (currentStep.subtitles.length + 1) * 0.3 }
              } : undefined}
            >
              {infoSteps[state.stepIndex].cta}
            </ButtonNext>
          </div>
        </>
      )}

      {isInfoStep(currentStep) && state.stepIndex == 2 && (
        <>
          <div className="grid gap-3 md:gap-4 h-fit sm:max-w-[550px] text-left self-center">
            <TextFadeIn
              animation={{
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -10 },
                transition: { duration: 0.5, delay: 1 * 0.3 }
              }}
            >
              <span className="text-[2rem]">
                ¡Bienvenido, <span className="font-medium">{name}</span>! :{')'}
              </span>
            </TextFadeIn>
            <div className="grid font-light">
              <TextFadeIn
                animation={{
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -10 },
                  transition: { duration: 0.5, delay: 2 * 0.3 }
                }}
              >
                <span className="text-[1rem]">{currentStep.subtitles[0]}</span>
              </TextFadeIn>
              <TextFadeIn
                animation={{
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -10 },
                  transition: { duration: 0.5, delay: 3 * 0.3 }
                }}
              >
                <span className="text-[1rem]">{currentStep.subtitles[1]}</span>
              </TextFadeIn>
            </div>

            <div className="grid gap-6">
              <motion.div
                className="grid grid-cols-[50px,435px] gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: 4 * 0.3 }}
              >
                <Image
                  src={emoji1.src}
                  width={50}
                  height={50}
                  alt="emoji"
                  className="pt-1"
                />
                <div>
                  <h4 className="font-semibold leading-7">
                    Diseñado para el aprendizaje
                  </h4>
                  <p className="font-light leading-7">
                    No es una IA que da respuestas genéricas.
                  </p>
                  <p className="font-light leading-7">
                    Es un compañero que te enseña a aprender, a reflexionar, y a
                    explorar ideas que expanden tu forma de ver el mundo.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="grid grid-cols-[50px,1fr] gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: 5 * 0.3 }}
              >
                <Image
                  src={emoji2.src}
                  width={50}
                  height={50}
                  alt="emoji"
                  className="pt-1"
                />
                <div>
                  <h4 className="font-semibold leading-7">
                    Se adapta a tus intereses
                  </h4>
                  <p className="font-light leading-7">
                    Cuanto más lo usás, mejor te entiende.
                  </p>
                  <p className="font-light leading-7">
                    Reconoce lo que te gusta y cómo aprendés mejor, y ajusta los
                    temas según eso.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="grid grid-cols-[50px,1fr] gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: 6 * 0.3 }}
              >
                <Image
                  src={emoji3.src}
                  width={50}
                  height={50}
                  alt="emoji"
                  className="pt-1"
                />
                <div>
                  <h4 className="font-semibold leading-7">
                    Te propone antes de que preguntes
                  </h4>
                  <p className="font-light leading-7">
                    Este guía es activo. Te sugiere ideas, desafíos y contenidos
                    pensados especificamente para vos.
                  </p>
                </div>
              </motion.div>
            </div>
            <ButtonNext
              className='self-center justify-self-center'
              onClick={() => handleSteps({ type: 'NEXT' })}
              animation={{
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -10 },
                transition: { duration: 0.5, delay: 7 * 0.3 }
              }}
            >
              Avanzar
            </ButtonNext>
          </div>
        </>
      )}

      {currentStep.typeInput == 'input' && (
        <StepInput
          step={currentStep}
          register={register}
          errors={errors}
          onClick={() => handleSteps({ type: 'NEXT' })}
          handleKeyDown={handleKeyDown}
        />
      )}

      {currentStep.typeInput == 'select' && (
        <StepSelect
          step={currentStep}
          stateIndex={state.stepIndex}
          register={register}
          errors={errors}
          onClick={handleClickSelected}
        />
      )}

      {currentStep.typeInput == 'pause' && (
        <StepPause
          step={currentStep as PauseStep}
          onClick={() => handleSteps({ type: 'NEXT' })}
          onFinish={handleFinish}
          onSkip={handleSendData}
        />
      )}

      {currentStep.typeInput == 'area' && (
        <StepArea
          step={currentStep}
          register={register}
          errors={errors}
          onClick={() => handleSteps({ type: 'NEXT' })}
        />
      )}

      {stepGlobalIndex !== undefined &&
        currentFase != null &&
        steps.length > 0 && (
          <ProgressGuide
            stepIndex={stepGlobalIndex}
            steps={steps}
            fase={currentFase}
          />
        )}

      {state.stepIndex > 2 &&
        currentStep.typeInput !== 'pause' &&
        currentStep.typeInput !== 'input' &&
        state.stepIndex < steps.length - 1 && (
          <button
            className={
              'absolute  flex text-gray-400 top-16 left-12 lg:top-28 lg:left-32'
            }
            onClick={() => handleSteps({ type: 'BACK' })}
          >
            <ChevronLeft /> Volver
          </button>
        )}
    </motion.div>
  );
}
