import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { OnboardingData, NutritionTargets } from './calc'

interface OnboardingState {
  data: Partial<OnboardingData>
  targets: NutritionTargets | null
  update: (partial: Partial<OnboardingData>) => void
  setTargets: (t: NutritionTargets) => void
  reset: () => void
}

export const useOnboarding = create<OnboardingState>()(
  persist(
    (set) => ({
      data: {},
      targets: null,
      update: (partial) => set((s) => ({ data: { ...s.data, ...partial } })),
      setTargets: (t) => set({ targets: t }),
      reset: () => set({ data: {}, targets: null }),
    }),
    { name: 'rashaqa-onboarding' }
  )
)
