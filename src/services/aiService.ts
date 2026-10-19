// src/services/aiService.ts
import { supabase } from '../lib/supabase';

// دالة موحدة للاتصال بالذكاء الاصطناعي
export const callAICoach = async (action: string, payload: any) => {
  try {
    // 1. الحصول على جلسة المستخدم الحالية (للأمان)
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("يجب تسجيل الدخول أولاً");

    // 2. استدعاء Edge Function
    const { data, error } = await supabase.functions.invoke('analyze-food', {
      body: { action, ...payload },
      headers: { Authorization: `Bearer ${session.access_token}` }
    });

    if (error) throw error;
    if (!data.ok) throw new Error(data.error);

    return { success: true, data: data.data };

  } catch (error: any) {
    console.error("AI Service Error:", error);
    return { success: false, error: error.message };
  }
};
