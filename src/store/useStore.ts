import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  isOnboarded: boolean
  isLoggedIn: boolean
  user: { name: string; weight: number; targetCalories: number; country: string; goal: string } | null
  meals: any[]
  waterCups: number
  plan: 'free' | 'gold'
  completeOnboarding: (data: { name: string; goal: string }) => void
  login: (email: string) => void
  skipLogin: () => void
  addMeal: (meal: any) => void
  setWaterCups: (cups: number) => void
  upgradeToGold: () => void
  signOut: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isOnboarded: false,
      isLoggedIn: false,
      user: null,
      meals: [],
      waterCups: 0,
      plan: 'free',
      completeOnboarding: (data) =>
        set({
          isOnboarded: true,
          user: {
            name: data.name,
            weight: 69,
            targetCalories: 2300,
            country: 'MA',
            goal: data.goal,
          },
        }),
      login: (email) => set({ isLoggedIn: true, isOnboarded: true }),
      skipLogin: () => set({ isOnboarded: true, isLoggedIn: false }),
      addMeal: (meal) => set((s) => ({ meals: [...s.meals, meal] })),
      setWaterCups: (cups) => set({ waterCups: cups }),
      upgradeToGold: () => set({ plan: 'gold' }),
      signOut: () => set({ isLoggedIn: false, user: null, meals: [], waterCups: 0 }),
    }),
    { name: 'rashaqa-store' }
  )
)
