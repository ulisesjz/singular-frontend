import clsx from 'clsx';
import { motion, MotionProps } from 'framer-motion';
import { ReactNode } from 'react';

export const animation = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4 }
};
export const animationFadeInX = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
  transition: { duration: 0.4 }
};

type TextFadeInProps = {
  children: ReactNode;
  animation?: Partial<MotionProps>;
  className?: string;
  id?: string;
  stepType?: string;
  classname?: string;
};

export function TextFadeIn({ id, animation, className, children }: TextFadeInProps) {
  return (
    <motion.span key={id} {...(animation ?? {})} className={className}>
      {children}
    </motion.span>
  );
}

export function Title({ id, animation, children, classname }: TextFadeInProps) {
  return (
    <TextFadeIn
      id={id}
      animation={animation}
      className={
        `font-bold max-sm:max-w-[343px] sm:font-normal sm:flex sm:gap-2 text-[2.5rem] leading-10 text-foreground md:text-[30px] ${classname}`
      }
    >
      {children}
    </TextFadeIn>
  );
}
export function Subtitle({
  id,
  animation,
  children,
  stepType
}: TextFadeInProps) {
  return (
    <TextFadeIn
      id={id}
      animation={animation}
      className={clsx(
        'font-light text-lg sm:text-xl italic text-[#666666]',
        stepType == "input" && ' sm:hidden'
      )}
    >
      {children}
    </TextFadeIn>
  );
}
