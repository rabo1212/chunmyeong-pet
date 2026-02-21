"use client";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export default function StepIndicator({
  currentStep,
  totalSteps = 6,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4 px-4">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                isActive
                  ? "bg-pet-apricot text-pet-dark scale-110"
                  : isCompleted
                    ? "bg-pet-apricot/30 text-pet-apricot"
                    : "bg-pet-deep border border-pet-apricot/20 text-pet-cream/40"
              }`}
            >
              {isCompleted ? "🐾" : step}
            </div>
            {step < totalSteps && (
              <div
                className={`w-4 h-0.5 transition-colors duration-300 ${
                  isCompleted ? "bg-pet-apricot/40" : "bg-pet-apricot/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
