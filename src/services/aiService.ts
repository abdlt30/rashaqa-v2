// src/services/aiService.ts
import { searchFoodInDB } from './workoutService';
import { supabase } from '../lib/supabase';

export const askAi = async (action: string, payload: any) => {
  try {
    const userQuery = payload.body.message || payload.body.query;

    // 1. البحث الذكي في قاعدة البيانات (Smart Caching)
    if (action === 'analyze' || action === 'suggest') {
      const existingFood = await searchFoodInDB(userQuery);
      
      if (existingFood) {
        console.log('✅ تم جلب البيانات من قاعدة البيانات (تكلفة 0)');
        return {
          ok: true,
          data: {
            name: existingFood.name_ar,
            calories: existingFood.calories_per_100g,
            protein: existingFood.protein_per_100g,
            carbs: existingFood.carbs_per_100g,
            fat: existingFood.fat_per_100g,
            source: 'database' // علامة تدل على أنها لم تستهلك AI
          }
        };
      }
    }

    // 2. إذا لم نجده، نستدعي الذكاء الاصطناعي (Edge Function)
    console.log('⏳ لم يتم العثور عليه في الداتابيز، جاري استدعاء Gemini...');
    const { data, error } = await supabase.functions.invoke('smart-service', {
      body: { action, ...payload.body },
      headers: { Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` }
    });

    if (error) throw error;

    // 3. حفظ النتيجة الجديدة في قاعدة البيانات (للمستقبل)
    if (action === 'analyze' && data?.ok && data.data) {
      await supabase.from('foods').insert([{
        name_ar: data.data.name,
        calories_per_100g: data.data.calories,
        protein_per_100g: data.data.protein,
        carbs_per_100g: data.data.carbs,
        fat_per_100g: data.data.fat,
        is_ai_generated: true // نحتفظ بعلامة أنها من AI
      }]);
      console.log('💾 تم حفظ النتيجة الجديدة في الداتابيز للمستقبل.');
    }

    return data;

  } catch (error) {
    console.error("AI Service Error:", error);
    return { ok: false, error: "حدث خطأ في معالجة الطلب" };
  }
};
