import React from 'react';
import { Slider } from '@/components/ui/slider';

interface SliderQuestionProps {
  question: string;
  description?: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

const SliderQuestion: React.FC<SliderQuestionProps> = ({
  question,
  description,
  min,
  max,
  value,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{question}</h3>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="space-y-3">
        <Slider
          min={min}
          max={max}
          step={1}
          value={[value]}
          onValueChange={([val]) => onChange(val)}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Conservative ({min})</span>
          <span>Current: {value}</span>
          <span>Aggressive ({max})</span>
        </div>
      </div>
    </div>
  );
};

export default SliderQuestion;