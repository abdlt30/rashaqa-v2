import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase'; // تأكد من مسار عميل Supabase

/* ============ Types ============ */
export interface MacroTargets {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  water_ml: number;
}

export interface UserProfile {
  name: string;
  weight_kg: number;
  targetCalories: number;
  country: string;
  goal: string;
  age?: number;
  gender?: 'male' | 'female';
  height_cm?: number;
  target_weight_kg?: number;
  activity_level?: string;
  diet_preference?: string;
}

export interface OnboardingData {
  name: string;
  goal: string;
  age?: number;
  gender?: 'male' | 'female';
  height_cm?: number;
  weight_kg?: number;
  target_weight_kg?: number;
  activity_level?: string;
  diet_preference?: string;
}

export interface Meal {
  id?: string; // ✅ إضافة معرف فريد للوجبة للتزامن مع Supabase
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  meal_type?: string;
  image_url?: string;
  created_at?: string;
}

interface AppState {
  // === Core state ===
  isOnboarded: boolean;
  isLoggedIn: boolean;
  userId: string | null;
  user: UserProfile | null;
  targets: MacroTargets | null;

  // === Runtime state ===
  meals: Meal[];
  waterCups: number;
  plan: 'free' | 'gold';

  // === Actions ===
  completeOnboarding: (data: OnboardingData) => void;
  setUserId: (id: string | null) => void;
  setTargets: (t: MacroTargets | null) => void;
  login: (email: string) => void;
  skipLogin: () => void;
  fetchDailyData: () => Promise<void>; // ✅ دالة جديدة لجلب البيانات
  addMeal: (meal: Meal) => Promise<void>; // ✅ أصبحت غير متزامنة
  removeMeal: (id: string) => Promise<void>; // ✅ تعتمد على الـ ID
  clearMeals: () => void;
  setWaterCups: (cups: number) => Promise<void>; // ✅ أصبحت غير متزامنة
  upgradeToGold: () => void;
  signOut: () => Promise<void>;
  resetAll: () => void;
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
};

/* ============ Store ============ */
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      completeOnboarding: (data) =>
        set({
          isOnboarded: true,
          user: {
            name: data.name,
            weight_kg: data.weight_kg || 70,
            targetCalories: 2300, // يمكن تحديثها لاحقاً بناءً على الحسابات
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

      setUserId: (id) => set({ userId: id }),
      setTargets: (t) => set({ targets: t }),
      login: (_email: string) => set({ isLoggedIn: true, isOnboarded: true }),
      skipLogin: () => set({ isOnboarded: true, isLoggedIn: false }),

      // ✅ دالة لجلب بيانات اليوم من Supabase عند فتح التطبيق
      fetchDailyData: async () => {
        const { userId } = get();
        if (!userId) return;

        const today = new Date().toISOString().split('T')[0];

        try {
          // 1. جلب وجبات اليوم
          const { data: mealsData } = await supabase
            .from('food_logs')
            .select('*')
            .eq('user_id', userId)
            .gte('created_at', today);

          // 2. جلب سجل الماء لليوم
          const { data: waterData } = await supabase
            .from('water_logs')
            .select('amount_ml')
            .eq('user_id', userId)
            .gte('logged_at', today);

          const totalWater = waterData?.reduce((sum, log) => sum + log.amount_ml, 0) || 0;

          set({
            meals: mealsData || [],
            waterCups: totalWater / 250, // افترضنا أن الكوب 250 مل
          });
        } catch (error) {
          console.error('Error fetching daily data:', error);
        }
      },

      // ✅ إضافة وجبة إلى Supabase ثم تحديث الواجهة
      addMeal: async (meal) => {
        const { userId, meals } = get();
        if (!userId) return;

        try {
          const { data, error } = await supabase
            .from('food_logs')
            .insert({
              user_id: userId,
              name: meal.name,
              calories: meal.calories,
              protein: meal.protein || 0,
              carbs: meal.carbs || 0,
              fat: meal.fat || 0,
              meal_type: meal.meal_type || 'snack',
            })
            .select()
            .single();

          if (error) throw error;

          // تحديث الحالة المحلية بالبيانات القادمة من Supabase (التي تحتوي على ID)
          set({ meals: [...meals, data] });
        } catch (error) {
          console.error('Error adding meal:', error);
        }
      },

      // ✅ حذف وجبة من Supabase باستخدام الـ ID
      removeMeal: async (id) => {
        const { meals } = get();
        try {
          await supabase.from('food_logs').delete().eq('id', id);
          set({ meals: meals.filter((m) => m.id !== id) });
        } catch (error) {
          console.error('Error removing meal:', error);
        }
      },

      clearMeals: () => set({ meals: [] }),

      // ✅ تسجيل الماء في Supabase
      setWaterCups: async (cups) => {
        const { userId, waterCups } = get();
        if (!userId) return;

        const diff = cups - waterCups;
        const amount_ml = diff * 250;

        try {
          await supabase.from('water_logs').insert({
            user_id: userId,
            amount_ml,
            logged_at: new Date().toISOString(),
          });
          set({ waterCups: cups });
        } catch (error) {
          console.error('Error logging water:', error);
        }
      },

      upgradeToGold: () => set({ plan: 'gold' }),

      signOut: async () => {
        await supabase.auth.signOut();
        set({
          isLoggedIn: false,
          userId: null,
          user: null,
          targets: null,
          meals: [],
          waterCups: 0,
        });
      },

      resetAll: () => set(INITIAL_STATE),
    }),
    {
      name: 'rasha-qa-store',
      version: 2, // ⚠️ قمنا بزيادة الإصدار لأننا غيرنا هيكل البيانات
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
);
