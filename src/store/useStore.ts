import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/* ============ Types ============ */

export interface MacroTargets {
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  water_ml: number
}

export interface UserProfile {
  name: string
  weight: number
  targetCalories: number
  country: string
  goal: string
  age?: number
  gender?: 'male' | 'female'
  height_cm?: number
  target_weight_kg?: number
  activity_level?: string
  diet_preference?: string
}

export interface OnboardingData {
  name: string
  goal: string
  age?: number
  gender?: 'male' | 'female'
  height_cm?: number
  weight_kg?: number
  target_weight_kg?: number
  activity_level?: string
  diet_preference?: string
}

export interface Meal {
  name: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
  meal_type?: string
  image_url?: string
  created_at?: string
}

interface AppState {
  // === Core state ===
  isOnboarded: boolean
  isLoggedIn: boolean
  userId: string | null
  user: UserProfile | null
  targets: MacroTargets | null

  // === Runtime state ===
  meals: Meal[]
  waterCups: number
  plan: 'free' | 'gold'

  // === Actions ===
  completeOnboarding: (data: OnboardingData) => void
  setUserId: (id: string | null) => void
  setTargets: (t: MacroTargets | null) => void
  login: (email: string) => void
  skipLogin: () => void
  addMeal: (meal: Meal) => void
  removeMeal: (index: number) => void
  clearMeals: () => void
  setWaterCups: (cups: number) => void
  upgradeToGold: () => void
  signOut: () => void
  resetAll: () => void
}

/* ============ Initial State ============ */

const INITIAL_STATE = {
  isOnboarded: false,
  isLoggedIn: false,
  userId: null as string | null,
  user: null as UserProfile | null,
  targets: null as MacroTargets | null,
  meals: [] as Meal[],
  waterCups: 0,
  plan: 'free' as const,
}

/* ============ Store ============ */

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      // --- Onboarding completed (backward compatible) ---
      completeOnboarding: (data) =>
        set({
          isOnboarded: true,
          user: {
            name: data.name,
            weight: data.weight_kg || 69,
            targetCalories: 2300, // سيُستبدل بـ targets.calories
            country: 'MA',
            goal: data.goal,
            age: data.age,
            gender: data.gender,
            height_cm: data.height_cm,
            target_weight_kg: data.target_weight_kg,
            activity_level: data.activity_level,
            diet_preference: data.diet_preference,
          },
        }),

      // --- User ID (Supabase auth) ---
      setUserId: (id) => set({ userId: id }),

      // --- Targets from calculateTargets() ---
      setTargets: (t) => set({ targets: t }),

      // --- Login / Skip ---
      login: (_email: string) => set({ isLoggedIn: true, isOnboarded: true }),

      skipLogin: () => set({ isOnboarded: true, isLoggedIn: false }),

      // --- Meals ---
      addMeal: (meal) => set((s) => ({ meals: [...s.meals, meal] })),

      removeMeal: (index) =>
        set((s) => ({ meals: s.meals.filter((_, i) => i !== index) })),

      clearMeals: () => set({ meals: [] }),

      // --- Water ---
      setWaterCups: (cups) => set({ waterCups: cups }),

      // --- Premium ---
      upgradeToGold: () => set({ plan: 'gold' }),

      // --- Sign out ---
      signOut: () =>
        set({
          isLoggedIn: false,
          userId: null,
          user: null,
          targets: null,
          meals: [],
          waterCups: 0,
        }),

      // --- Reset everything ---
      resetAll: () => set(INITIAL_STATE),
    }),
    {
      name: 'rashaqa-store',
      version: 2,
      partialize: (state) => ({
        isOnboarded: state.isOnboarded,
        isLoggedIn: state.isLoggedIn,
        userId: state.userId,
        user: state.user,
        targets: state.targets,
        meals: state.meals,
        waterCups: state.waterCups,
        plan: state.plan,
      }),
    }
  )
)
