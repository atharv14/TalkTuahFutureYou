export type QuestionType = 'single' | 'multiple' | 'slider' | 'text';

export interface OnboardingQuestion {
  id: string;
  type: QuestionType;
  question: string;
  description?: string;
  options?: string[];
  min?: number;
  max?: number;
  required: boolean;
}

export interface OnboardingAnswer {
  questionId: string;
  answer: string | string[] | number;
}