import * as React from 'react';

import { cn } from '@/lib/utils';
import { Mic, SendHorizonal } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  
}

const InputMain = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative w-full lg:w-[670px] ">
        <input
          type={type}
          className={cn(
            'flex h-[70px] w-full shadow-md rounded-4xl border border-border focus:border-border bg-input-bg pl-5 pr-14 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-input-foreground disabled:cursor-not-allowed disabled:opacity-50 outline-none transition-colors',
            className
          )}
          ref={ref}
          {...props}
        />
        {/* <button className='absolute left-5 top-1/2 transform -translate-y-1/2' onClick={() => props.onChange && props.onChange({ target: { value: '' } })}>
        <Mic className="text-gray-500 hover:text-gray-700 w-5 h-5" />
      </button> */}

        <button className='absolute right-5 top-1/2 transform -translate-y-1/2'>
          <SendHorizonal className="text-gray-500 hover:text-gray-700 w-5 h-5" />
        </button>
      </div>
    );
  }
);
InputMain.displayName = 'InputMain';

export { InputMain };
