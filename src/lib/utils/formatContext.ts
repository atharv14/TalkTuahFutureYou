import { TimelineScenario, TimelineState } from '@/types/timeline';
import { OnboardingAnswer } from '@/types/onboarding';
import { formatCurrency } from './formatters';

export const formatFinancialContext = (
  metrics: TimelineScenario['metrics'],
  timeRange: TimelineState['timeRange']
): string => {
  const latestMetrics = metrics.reduce((acc: Record<string, number>, metric) => {
    acc[metric.type] = metric.amount;
    return acc;
  }, {});

  return `
### Current Financial Status
- Monthly Income: ${formatCurrency(latestMetrics.income)}
- Total Savings: ${formatCurrency(latestMetrics.savings)}
- Investment Portfolio: ${formatCurrency(latestMetrics.investment)}
- Timeline View: ${timeRange}
`;
};

export const formatGoalsContext = (answers: OnboardingAnswer[]): string => {
  const goals = answers.find(a => a.questionId === 'financial_goals')?.answer;
  const timeline = answers.find(a => a.questionId === 'timeline')?.answer;
  const worry = answers.find(a => a.questionId === 'financial_worry')?.answer;

  return `
### Financial Goals and Timeline
- Goals: ${Array.isArray(goals) ? goals.join(', ') : goals}
- Target Timeline: ${timeline}
- Main Financial Concern: ${worry}
`;
};