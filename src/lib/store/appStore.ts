import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState } from '@/types/store';
// import { FinancialMetric, TimelineState } from '@/types/timeline';

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userProfile: null,
      isOnboarded: false,

      // Existing actions
      setUserProfile: (profile) => 
        set({ userProfile: profile }),

      setOnboarded: (status) => 
        set({ isOnboarded: status }),

      updateAnswers: (answers) =>
        set((state) => ({
          userProfile: state.userProfile ? {
            ...state.userProfile,
            answers,
          } : {
            answers,
            timeline: {
              scenarios: [],
              activeScenarioId: null,
              comparisonScenarioId: null,
              timeRange: '5years'
            }
          },
        })),

      updateFuturePersona: (persona) =>
        set((state) => ({
          userProfile: state.userProfile ? {
            ...state.userProfile,
            futurePersona: persona,
          } : null,
        })),

      // Timeline actions
      updateTimelineData: (scenarioId, metrics) =>
        set((state) => {
          if (!state.userProfile?.timeline) return state;
      
          const existingScenario = state.userProfile.timeline.scenarios.find(
            s => s.id === scenarioId
          );
      
          return {
            userProfile: {
              ...state.userProfile,
              timeline: {
                ...state.userProfile.timeline,
                scenarios: existingScenario
                  ? state.userProfile.timeline.scenarios.map(scenario =>
                      scenario.id === scenarioId
                        ? { ...scenario, metrics }
                        : scenario
                    )
                  : [...state.userProfile.timeline.scenarios, {
                      id: scenarioId,
                      name: "Comparison Scenario",
                      description: "Modified financial scenario",
                      metrics,
                      assumptions: {
                        savingsRate: 20,
                        investmentReturn: 8,
                        inflationRate: 2.5
                      }
                    }],
                comparisonScenarioId: scenarioId // Set as comparison scenario when adding new
              },
            },
          };
        }),
      

      setActiveScenario: (scenarioId) =>
        set((state) => {
          if (!state.userProfile?.timeline) return state;
          
          return {
            userProfile: {
              ...state.userProfile,
              timeline: {
                ...state.userProfile.timeline,
                activeScenarioId: scenarioId,
              },
            },
          };
        }),

      setComparisonScenario: (scenarioId) =>
        set((state) => {
          if (!state.userProfile?.timeline) return state;
          
          return {
            userProfile: {
              ...state.userProfile,
              timeline: {
                ...state.userProfile.timeline,
                comparisonScenarioId: scenarioId,
              },
            },
          };
        }),

      setTimeRange: (range) =>
        set((state) => {
          if (!state.userProfile?.timeline) return state;
          
          return {
            userProfile: {
              ...state.userProfile,
              timeline: {
                ...state.userProfile.timeline,
                timeRange: range,
              },
            },
          };
        }),

      reset: () => set({
        userProfile: null,
        isOnboarded: false,
      }),
    }),
    {
      name: 'finchat-storage',
      partialize: (state) => ({
        userProfile: state.userProfile,
        isOnboarded: state.isOnboarded,
      }),
    }
  )
);

export default useAppStore;