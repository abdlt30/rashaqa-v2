// src/services/workoutService.ts
import { supabase } from '../lib/supabase';
import { Workout } from '../types/workout';

export const fetchExercises = async (): Promise<Workout[]> => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('خطأ في جلب التمارين من Supabase:', error.message);
      throw error;
    }
    
    return (data || []) as Workout[];
  } catch (err) {
    console.error('خطأ غير متوقع:', err);
    return [];
  }
};
