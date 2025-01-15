import { OnboardingAnswer } from './onboarding';
import { FuturePersona } from './chat';
import { TimelineState, FinancialMetric } from './timeline';

export interface UserProfile {
  answers: OnboardingAnswer[];
  futurePersona?: FuturePersona;
  timeline: TimelineState;  
}

export interface AppState {
  userProfile: UserProfile | null;
  isOnboarded: boolean;
  
  // Existing actions
  setUserProfile: (profile: UserProfile | null) => void;
  setOnboarded: (status: boolean) => void;
  updateAnswers: (answers: OnboardingAnswer[]) => void;
  updateFuturePersona: (persona: FuturePersona) => void;
  
  // Timeline actions
  updateTimelineData: (scenarioId: string, metrics: FinancialMetric[]) => void;
  setActiveScenario: (scenarioId: string) => void;
  setComparisonScenario: (scenarioId: string | null) => void;
  setTimeRange: (range: TimelineState['timeRange']) => void;
  reset: () => void;
}