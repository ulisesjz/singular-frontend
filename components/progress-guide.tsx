export const ProgressGuide = ({
  stepIndex,
  steps,
  fase
}: {
  stepIndex: number | null;
  steps: any[];
  fase: number;
}) => {
  if (stepIndex === null) return null;

  const guideStepsInFase = steps.filter(
    (step) => step && step.hasGuide && step.fase === fase
  );
  const totalDots = guideStepsInFase.length;

  return (
    <div className="flex gap-[10px] justify-center items-center mt-2 max-h-14 self-end lg:absolute lg:top-28 lg:right-32">
      {Array.from({ length: totalDots }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i === stepIndex
              ? 'bg-primary'
              : 'bg-gray-300 '
          }`}
        />
      ))}
    </div>
  );
};
