import { create } from 'zustand'

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface AppState {
  isOnboarded: boolean;
  isLoggedIn: boolean;
  user: { name: string; weight: number; targetCalories: number; country: string; goal: string } | null;
  meals: Meal[];
  waterCups: number;
  stepGoal: number;
  plan: 'free' | 'gold';
  completeOnboarding: (data: { name: string; goal: string }) => void;
  login: (email: string) => void;
  skipLogin: () => void;
  addMeal: (meal: Meal) => void;
  setWaterCups: (cups: number) => void;
  upgradeToGold: () => void;
}

export const useStore = create<AppState>((set) => ({
  isOnboarded: false,
  isLoggedIn: false,
  user: { name: 'أبو', weight: 69, targetCalories: 2300, country: 'MA', goal: 'maintain' },
  meals: [],
  waterCups: 0,
  stepGoal: 5000,
  plan: 'free',
  completeOnboarding: (data) => set({ isOnboarded: true, user: { name: data.name, weight: 69, targetCalories: 2300, country: 'MA', goal: data.goal } }),
  login: (email) => set({ isLoggedIn: true, isOnboarded: true }),
  skipLogin: () => set({ isOnboarded: true, isLoggedIn: false }),
  addMeal: (meal) => set((state) => ({ meals: [...state.meals, meal] })),
  setWaterCups: (cups) => set({ waterCups: cups }),
  upgradeToGold: () => set({ plan: 'gold' }),
}))
