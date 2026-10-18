// src/services/workoutService.ts
import { supabase } from '../lib/supabase';
import { Workout } from '../types/workout';

// 1. دالة جلب التمارين (الموجودة حالياً)
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

// 2. دالة البحث عن الطعام في قاعدة البيانات (الكود الجديد الذي يجب إضافته)
export const searchFoodInDB = async (query: string) => {
  try {
    // نستخدم ilike للبحث الذكي (لا يفرق بين الحروف الكبيرة والصغيرة)
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .ilike('name_ar', `%${query}%`) 
      .limit(1)
      .single();

    // PGRST116 هو كود الخطأ في Supabase الذي يعني "لم يتم العثور على نتائج"
    if (error && error.code !== 'PGRST116') { 
      throw error;
    }
    return data;
  } catch (err) {
    console.error("خطأ في البحث بقاعدة البيانات:", err);
    return null;
  }
};
