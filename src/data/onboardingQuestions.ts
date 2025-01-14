// src/data/onboardingQuestions.ts
import { OnboardingQuestion } from '@/types/onboarding';

export const questions: OnboardingQuestion[] = [
  {
    id: 'financial_goals',
    type: 'multiple',
    question: 'What are your top financial goals?',
    description: 'Select up to 3 goals that matter most to you',
    options: [
      'Save for retirement',
      'Buy a house',
      'Start a business',
      'Pay off debt',
      'Build emergency fund',
      'Invest in stock market',
      'Save for education'
    ],
    required: true
  },
  {
    id: 'risk_tolerance',
    type: 'slider',
    question: 'How comfortable are you with financial risk?',
    description: 'On a scale of 1-10, where 1 is very conservative and 10 is very aggressive',
    min: 1,
    max: 10,
    required: true
  },
  {
    id: 'income_range',
    type: 'single',
    question: 'What is your current annual income range?',
    options: [
      'Under $30,000',
      '$30,000 - $60,000',
      '$60,000 - $100,000',
      '$100,000 - $150,000',
      'Over $150,000'
    ],
    required: true
  },
  {
    id: 'financial_worry',
    type: 'text',
    question: 'What is your biggest financial worry?',
    description: 'This helps us understand your priorities',
    required: true
  },
  {
    id: 'timeline',
    type: 'single',
    question: 'When would you like to achieve your primary financial goal?',
    options: [
      '1-2 years',
      '3-5 years',
      '5-10 years',
      '10+ years'
    ],
    required: true
  }
];