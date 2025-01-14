import { OnboardingAnswer } from './onboarding';
import { FuturePersona } from './chat';

export interface AppState {
  userProfile: {
    answers: OnboardingAnswer[];
    futurePersona?: FuturePersona;
  } | null;
  isOnboarded: boolean;
  setUserProfile: (profile: AppState['userProfile']) => void;
  setOnboarded: (status: boolean) => void;
  updateAnswers: (answers: OnboardingAnswer[]) => void;
  updateFuturePersona: (persona: FuturePersona) => void;
  reset: () => void;
}