// src/services/database.ts
import { supabase } from '../lib/supabase';
import { Workout } from '../types/workout'; // النوع الذي أنشأناه سابقاً

// دالة لجلب جميع التمارين
export const fetchExercises = async (): Promise<Workout[]> => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('created_at', { ascending: false }); // ترتيب الأحدث أولاً

    if (error) {
      console.error('خطأ في جلب التمارين من Supabase:', error.message);
      throw error;
    }
    
    // تحويل البيانات لتتطابق مع واجهة Workout
    return (data || []) as Workout[];
  } catch (err) {
    console.error('خطأ غير متوقع:', err);
    return [];
  }
};
