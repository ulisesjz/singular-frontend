import Image, { StaticImageData } from 'next/image';
import React from 'react';
import infoImg from 'public/assets/images/pause.png';
import pause1 from "public/assets/images/onboarding/primera.png"
import pause2 from "public/assets/images/onboarding/segunda.png"
import pause3 from "public/assets/images/onboarding/ultima.jpg"
import { animation, Subtitle, TextFadeIn, Title } from './headings';
import { ButtonNext } from '@/components/Button';
import { History } from 'lucide-react';
import clsx from 'clsx';
import { PauseStep } from '@/lib/types';

type Props = {
  step: PauseStep;
  onClick: () => void;
  onSkip: () => void;
  onFinish: () => void;
};

export const pauseImages: Record<string,StaticImageData> = {
  "pause-1": pause1,
  "pause-2": pause2,
  "pause-3": pause3
};

function StepPause({ step, onClick, onSkip, onFinish }: Props) {
  return (
    <>
      <Image
        src={pauseImages[step._id]}
        alt=""
        className="max-h-dvh h-full w-full object-cover"
      />
      {/* sm:max-w-[550px] */}
      <div
        className={
          'grid gap-6 justify-items-center h-fit sm:max-w-[450px]  text-center self-center md:hidden px-7'
        }
      >
        <div className="grid gap-3">
          <Title id={step._id} animation={animation}>
            {step.title.mobile}
          </Title>
          {step.subtitle.mobile.map((sub, i) => (
            <Subtitle
              id={`subtitle-step-${step._id}-${i}`}
              animation={animation}
              className="font-light text-xl italic"
            >
              {sub}
            </Subtitle>
          ))}
        </div>
        <div className="grid gap-3 justify-items-center">
          <ButtonNext onClick={onClick} variant="primary">
            {step.cta.mobile}
          </ButtonNext>
          {step.skippable && (
            <ButtonNext onClick={onSkip} variant="secondary">
              Skip
            </ButtonNext>
          )}
          <div className="flex items-center text-xs font-medium text-[#666666]">
            <History className="h-4" />
            Te tomará 5 minutos.
          </div>
        </div>
      </div>
      <div
        className={clsx(
          'hidden gap-5 max-lg:px-4 lg:pr-4 self-center h-fit md:grid ',
          step.finish
            ? 'text-center justify-items-center'
            : 'text-left content-start lg:ml-[8vw]',
          step.skippable ? 'sm:max-w-[380px]' : 'sm:max-w-[525px]'
        )}
      >
        <TextFadeIn
          key={step._id}
          animation={animation}
          className="font-medium text-xl md:text-2xl text-foreground"
        >
          {step.title.desktop}{' '}
        </TextFadeIn>
        {step.subtitle.desktop.map((sub, i) => (
          <TextFadeIn
            key={`subtitle-step-${step._id}-${i}`}
            animation={animation}
            className="font-light text-lg text-[#666666] "
          >
            {sub}
          </TextFadeIn>
        ))}
        <div className="grid gap-2">
          <div className="flex gap-7">
            {step.finish ? (
              <ButtonNext onClick={onFinish} variant="primary">
                {step.cta.desktop}
              </ButtonNext>
            ) : (
              <ButtonNext onClick={onClick} variant="primary">
                {step.cta.desktop}
              </ButtonNext>
            )}

            {step.skippable && (
              <ButtonNext onClick={onSkip} variant="secondary">
                Skip
              </ButtonNext>
            )}
          </div>

          {!step.finish && (
            <span className="text-xs text-[#666666] flex justify-items-center items-center">
              <History className="h-4" />
              Te tomará 5 minutos.
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export default StepPause;
