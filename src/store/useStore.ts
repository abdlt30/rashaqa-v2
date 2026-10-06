import { create } from 'zustand'

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface AppState {
  user: { name: string; weight: number; targetCalories: number; country: string } | null;
  meals: Meal[];
  waterCups: number;
  stepGoal: number;
  addMeal: (meal: Meal) => void;
  setWaterCups: (cups: number) => void;
  setUser: (user: any) => void;
}

export const useStore = create<AppState>((set) => ({
  user: { name: 'أبو', weight: 69, targetCalories: 2300, country: 'MA' },
  meals: [],
  waterCups: 0,
  stepGoal: 5000,
  addMeal: (meal) => set((state) => ({ meals: [...state.meals, meal] })),
  setWaterCups: (cups) => set({ waterCups: cups }),
  setUser: (user) => set({ user }),
}))
