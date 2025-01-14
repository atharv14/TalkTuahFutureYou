// src/lib/store/appStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState } from '@/types/store';
// import { OnboardingAnswer } from '@/types/onboarding';
// import { FuturePersona } from '@/types/chat';

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userProfile: null,
      isOnboarded: false,

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
          },
        })),

      updateFuturePersona: (persona) =>
        set((state) => ({
          userProfile: state.userProfile ? {
            ...state.userProfile,
            futurePersona: persona,
          } : null,
        })),

      // Add the missing reset function
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