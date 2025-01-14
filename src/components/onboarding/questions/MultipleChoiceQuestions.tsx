import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface MultipleChoiceQuestionProps {
  question: string;
  description?: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  maxSelections?: number;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  description,
  options,
  value,
  onChange,
  maxSelections = 3,
}) => {
  const handleChange = (option: string, checked: boolean) => {
    if (checked && value.length >= maxSelections) {
      return;
    }
    
    const newValue = checked
      ? [...value, option]
      : value.filter(v => v !== option);
    
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{question}</h3>
        {description && (
          <p className="text-sm text-gray-500">
            {description} (Max {maxSelections} selections)
          </p>
        )}
      </div>
      <div className="space-y-3">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-3">
            <Checkbox
              id={option}
              checked={value.includes(option)}
              onCheckedChange={(checked) => 
                handleChange(option, checked as boolean)
              }
              disabled={!value.includes(option) && value.length >= maxSelections}
            />
            <Label htmlFor={option}>{option}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;