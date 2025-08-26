import React from 'react';

type Props = {};

const TypingDots = (props: Props) => {
  return (
    <div className="flex space-x-1 self-start ">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0s]" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.15s]" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]" />
    </div>
  );
};

export default TypingDots;
