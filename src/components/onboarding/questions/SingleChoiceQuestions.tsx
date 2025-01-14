import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SingleChoiceQuestionProps {
  question: string;
  description?: string;
  options: string[];
  value?: string;
  onChange: (value: string) => void;
}

const SingleChoiceQuestion: React.FC<SingleChoiceQuestionProps> = ({
  question,
  description,
  options,
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
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="space-y-3"
      >
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-3">
            <RadioGroupItem value={option} id={option} />
            <Label htmlFor={option}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default SingleChoiceQuestion;