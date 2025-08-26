import { clsx } from 'clsx';
import { MouseEventHandler, ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';

type ButtonNextProps = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  animation?: Partial<MotionProps>;
  className?: string;
  variant?: 'primary' | 'secondary';
};

export function ButtonNext({
  children,
  onClick,
  animation,
  className = '',
  variant = 'primary'
}: ButtonNextProps) {
  return (
    <motion.button
      type="button"
      key="fade-button"
      {...(animation ?? {})}
      onClick={onClick}
      className={clsx(
        ` rounded-full lg:rounded-[20px] px-8  font-medium min-w-32 max-w-40  transition-colors md:w-40 h-[51px] ${className}`,
        variant === 'primary' &&
          'bg-[#666666] text-primary-foreground hover:md:bg-primary',
        variant === 'secondary' &&
          'bg-transparent border border-[#666666] text-[#666666] hover:border-primary hover:text-primary'
      )}
    >
      {children}
    </motion.button>
  );
}
