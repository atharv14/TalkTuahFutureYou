import React from 'react';

interface QuestionWrapperProps {
  children: React.ReactNode;
  isActive: boolean;
}

const QuestionWrapper: React.FC<QuestionWrapperProps> = ({ 
  children, 
  isActive 
}) => {
  if (!isActive) return null;

  return (
    <div className="transition-all duration-300 ease-in-out">
      {children}
    </div>
  );
};

export default QuestionWrapper;