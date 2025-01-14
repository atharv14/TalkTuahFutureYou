import React from 'react';
import { Input } from '@/components/ui/input';

interface TextQuestionProps {
  question: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextQuestion: React.FC<TextQuestionProps> = ({
  question,
  description,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{question}</h3>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  );
};

export default TextQuestion;