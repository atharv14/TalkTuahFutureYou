// src/lib/utils/timeline.ts
import { TimelineScenario, FinancialMetric } from '@/types/timeline';
import { OnboardingAnswer } from '@/types/onboarding';
import { v4 as uuidv4 } from 'uuid';

interface GenerateMetricsParams {
    income: number;
    savingsRate: number;
    investmentReturn: number;
    timeRange: '1year' | '5years' | '10years';
    additionalIncome?: number;
    debtPayment?: number;
}

export const generateFinancialMetrics = ({
    income,
    savingsRate,
    investmentReturn,
    timeRange,
    additionalIncome = 0,
    debtPayment = 0,
}: GenerateMetricsParams): FinancialMetric[] => {
    const metrics: FinancialMetric[] = [];
    const monthsToGenerate = {
        '1year': 12,
        '5years': 60,
        '10years': 120
    }[timeRange];

    // Monthly calculations
    let currentMonthlyIncome = (income / 12) + additionalIncome;
    const monthlySavingsRate = savingsRate / 100;
    const monthlyInvestmentReturn = investmentReturn / 100 / 12;
    const annualIncomeGrowthRate = 0.30;
    const monthlyIncomeGrowthRate = Math.pow(1 + annualIncomeGrowthRate, 1 / 12) - 1;

    let currentSavings = 0;
    let currentInvestments = 0;

    const startDate = new Date(2025, 0, 1);

    for (let i = 0; i <= monthsToGenerate; i++) {
        const currentDate = new Date(startDate);
        currentDate.setMonth(startDate.getMonth() + i);

        if (i > 0) {
            currentInvestments = currentInvestments * (1 + monthlyInvestmentReturn);
            currentMonthlyIncome *= (1 + monthlyIncomeGrowthRate);
        }
        
        // Adjust savings based on debt payment
        const monthlySavings = Math.max(0, (currentMonthlyIncome * monthlySavingsRate) - debtPayment);
        currentSavings += monthlySavings;
        currentInvestments += monthlySavings * 0.7;

        metrics.push({
            amount: currentSavings,
            date: currentDate.toISOString(),
            type: 'savings'
        }, {
            amount: currentInvestments,
            date: currentDate.toISOString(),
            type: 'investment'
        }, {
            amount: currentMonthlyIncome,
            date: currentDate.toISOString(),
            type: 'income'
        });
    }

    return metrics;
};

export const generateDefaultScenario = (answers: OnboardingAnswer[], timeRange: '1year' | '5years' | '10years' = '5years'): TimelineScenario => {
    // Extract income from onboarding answers
    const incomeAnswer = answers.find(a => a.questionId === 'income_range');
    const incomeMap: { [key: string]: number } = {
        'Under $30,000': 25000,
        '$30,000 - $60,000': 45000,
        '$60,000 - $100,000': 80000,
        '$100,000 - $150,000': 125000,
        'Over $150,000': 200000
    };
    const baseIncome = incomeMap[incomeAnswer?.answer as string] || 50000;

    // Extract risk tolerance for investment return estimation
    const riskAnswer = answers.find(a => a.questionId === 'risk_tolerance');
    const riskTolerance = Number(riskAnswer?.answer) || 5;
    const estimatedReturn = 4 + (riskTolerance * 0.8); // 4-12% return based on risk tolerance

    const defaultScenario: TimelineScenario = {
        id: uuidv4(),
        name: 'Base Scenario',
        description: 'Your projected financial journey based on current habits',
        metrics: generateFinancialMetrics({
            income: baseIncome,
            savingsRate: 20, // Default 20% savings rate
            investmentReturn: estimatedReturn,
            timeRange: timeRange
        }),
        assumptions: {
            savingsRate: 20,
            investmentReturn: estimatedReturn,
            inflationRate: 2.5
        }
    };

    return defaultScenario;
};

export const getIncomeFromAnswers = (answers: OnboardingAnswer[]): number => {
    const incomeAnswer = answers.find(a => a.questionId === 'income_range');
    const incomeMap: { [key: string]: number } = {
        'Under $30,000': 25000,
        '$30,000 - $60,000': 45000,
        '$60,000 - $100,000': 80000,
        '$100,000 - $150,000': 125000,
        'Over $150,000': 200000
    };
    return incomeMap[incomeAnswer?.answer as string] || 50000;
};