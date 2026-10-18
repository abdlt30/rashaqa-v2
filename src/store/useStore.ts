import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

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
  id?: string;
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
  
  // Auth State
  session: Session | null;
  authUser: User | null;
  isAuthLoading: boolean;
  
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
  fetchDailyData: () => Promise<void>;
  addMeal: (meal: Meal) => Promise<void>;
  removeMeal: (id: string) => Promise<void>;
  clearMeals: () => void;
  setWaterCups: (cups: number) => Promise<void>;
  upgradeToGold: () => void;
  signOut: () => Promise<void>;
  logWorkout: (workout: { name: string; duration: number; caloriesBurned: number }) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  resetAll: () => void;
  
  // Auth Actions
  setSession: (session: Session | null) => void;
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
  session: null as Session | null,
  authUser: null as User | null,
  isAuthLoading: true,
};

/* ============ Store ============ */
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setSession: (session) => set({ 
        session, 
        authUser: session?.user || null,
        userId: session?.user?.id || null,
        isLoggedIn: !!session,
        isAuthLoading: false 
      }),

      completeOnboarding: (data) =>
        set({
          isOnboarded: true,
          user: {
            name: data.name,
            weight_kg: data.weight_kg || 70,
            targetCalories: 2300,
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

      fetchDailyData: async () => {
        const { userId } = get();
        if (!userId) return;

        const today = new Date().toISOString().split('T')[0];

        try {
          // 1. جلب وجبات اليوم (استخدام log_date بدلاً من created_at)
          const { data: mealsData } = await supabase
            .from('food_logs')
            .select('*')
            .eq('user_id', userId)
            .eq('log_date', today);

          // 2. جلب سجل الماء لليوم (استخدام log_date)
          const { data: waterData } = await supabase
            .from('water_logs')
            .select('amount_ml')
            .eq('user_id', userId)
            .eq('log_date', today);

          const totalWater = waterData?.reduce((sum, log) => sum + log.amount_ml, 0) || 0;

          set({
            meals: mealsData || [],
            waterCups: Math.round(totalWater / 250), // التقريب لتجنب الكسور
          });
        } catch (error) {
          console.error('Error fetching daily data:', error);
        }
      },

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
          set({ meals: [...meals, data] });
        } catch (error) {
          console.error('Error adding meal:', error);
        }
      },

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

      setWaterCups: async (cups) => {
        const { userId, waterCups } = get();
        if (!userId) return;

        const diff = cups - waterCups;
        const amount_ml = diff * 250;

        try {
          await supabase.from('water_logs').insert({
            user_id: userId,
            amount_ml,
            log_date: new Date().toISOString().split('T')[0],
          });
          set({ waterCups: cups });
        } catch (error) {
          console.error('Error logging water:', error);
        }
      },
      
      // ✅ تصحيح تسجيل التمرين ليتوافق مع جدول workout_logs
      logWorkout: async (workout) => {
        const { userId } = get();
        if (!userId) return;

        try {
          // في المستقبل، سنمرر الـ exercise_id الحقيقي بدلاً من name
          // هنا نقوم بتسجيله في جدول السجلات
          const { error } = await supabase
            .from('workout_logs')
            .insert({
              user_id: userId,
              exercise_id: null, // يمكن تحديثه لاحقاً بربط التمرين
              // يمكنك إضافة تفاصيل أخرى إذا أضفت أعمدة للجدول
            });

          if (error) {
            // إذا لم يكن الجدول يحتوي على هذه الأعمدة، سنقوم بطباعة الخطأ فقط
            console.warn('Note: workout_logs schema might need adjustments:', error.message);
          }
        } catch (error) {
          console.error('Error logging workout:', error);
        }
      },

      updateProfile: async (updates) => {
        const { userId, user } = get();
        if (!userId || !user) return;

        try {
          const { error } = await supabase
            .from('profiles')
            .update({ ...updates })
            .eq('id', userId);

          if (error) throw error;
          set({ user: { ...user, ...updates } });
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      },

      upgradeToGold: () => set({ plan: 'gold' }),

      signOut: async () => {
        await supabase.auth.signOut();
        set({ ...INITIAL_STATE, isAuthLoading: false });
      },

      resetAll: () => set({ ...INITIAL_STATE, isAuthLoading: false }),
    }),
  
    {
      name: 'rasha-qa-store',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version === 1) {
          return { ...persistedState, userId: persistedState.userId || null };
        }
        return persistedState;
      },
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
