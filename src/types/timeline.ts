export interface FinancialMetric {
    amount: number;
    date: string;
    type: 'savings' | 'investment' | 'debt' | 'income';
}

export type LifeEventType =
    | 'career_change'
    | 'home_purchase'
    | 'education'
    | 'business_startup'
    | 'major_expense';

export interface LifeEvent {
    id: string;
    type: LifeEventType;
    name: string;
    description: string;
    timing: number; // Month number when event occurs
    financialImpact: {
        initialCost: number;
        monthlyIncome?: number;
        monthlyExpense?: number;
        savingsRateChange?: number;
        investmentReturnChange?: number;
    };
}

export interface FinancialMetric {
    amount: number;
    date: string;
    type: 'savings' | 'investment' | 'debt' | 'income';
}

export interface TimelineScenario {
    id: string;
    name: string;
    description: string;
    metrics: FinancialMetric[];
    assumptions: {
        savingsRate: number;
        investmentReturn: number;
        inflationRate: number;
    };
    lifeEvents?: LifeEvent[];
}

export interface TimelineState {
    scenarios: TimelineScenario[];
    activeScenarioId: string | null;
    comparisonScenarioId: string | null;
    timeRange: '1year' | '5years' | '10years';
}