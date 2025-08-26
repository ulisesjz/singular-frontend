import React from 'react';

type Props = {};

export const Loading = (props: Props) => {
  return (
    <div className="w-full h-full grid place-content-center">
      {' '}
      <div className="flex justify-center items-center h-full">
        <PuffLoader/>
      </div>
    </div>
  );
};

export const LoadingCards = () => {
  return (
    <div className="w-full h-full grid place-content-center">
      {' '}
      <div className="flex flex-col justify-center items-center h-full space-y-4">
        <PuffLoader/>
        <p className="text-center text-primary text-lg animate-pulse">
          Estamos optimizando tu área de estudio...
        </p>
      </div>
    </div>
  );
};

const PuffLoader = () => {
  return(
    <svg
          className="w-32 h-32"
          viewBox="0 0 44 44"
          xmlns="http://www.w3.org/2000/svg"
          stroke="hsl(var(--primary))"
        >
          <g fill="none" fill-rule="evenodd" stroke-width="2">
            <circle cx="22" cy="22" r="1">
              <animate
                attributeName="r"
                begin="0s"
                dur="1.8s"
                values="1; 20"
                calcMode="spline"
                keyTimes="0; 1"
                keySplines="0.165, 0.84, 0.44, 1"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                begin="0s"
                dur="1.8s"
                values="1; 0"
                calcMode="spline"
                keyTimes="0; 1"
                keySplines="0.3, 0.61, 0.355, 1"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="22" cy="22" r="1">
              <animate
                attributeName="r"
                begin="-0.9s"
                dur="1.8s"
                values="1; 20"
                calcMode="spline"
                keyTimes="0; 1"
                keySplines="0.165, 0.84, 0.44, 1"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                begin="-0.9s"
                dur="1.8s"
                values="1; 0"
                calcMode="spline"
                keyTimes="0; 1"
                keySplines="0.3, 0.61, 0.355, 1"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </svg>
  )
}
