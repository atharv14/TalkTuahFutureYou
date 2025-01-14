import React from 'react';
import { Progress } from '@/components/ui/progress';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="space-y-2">
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-gray-500 text-center">
        Question {currentStep + 1} of {totalSteps}
      </p>
    </div>
  );
};

export default OnboardingProgress;