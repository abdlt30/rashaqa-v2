import { supabase } from '../lib/supabase';

const AI_FUNCTION_URL = 'https://axthmghawwishcjlldfj.supabase.co/functions/v1/smart-service';
const TIMEOUT_MS = 30000; // 30 ثانية

// ✅ 1. تعريف أنواع البيانات (Types)
export type AiAction = 'analyze' | 'suggest' | 'chat' | 'meal-plan' | 'voice';

export interface AiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
  meta?: {
    action: string;
    model: string;
    credits_used: number;
    latency_ms: number;
  };
}

interface AiPayload {
  action: AiAction;
  body?: Record<string, any>;
  imageBase64?: string;
  mimeType?: string;
  message?: string;
}

// ✅ 2. دالة موحدة لاستدعاء الذكاء الاصطناعي
export async function askAi<T = any>(
  action: AiAction,
  payload: Omit<AiPayload, 'action'>
): Promise<AiResponse<T>> {
  try {
    // 1. الحصول على الجلسة الحالية
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return { ok: false, error: 'يجب تسجيل الدخول أولاً' };
    }

    // 2. إعداد الطلب مع Timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(AI_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ action, ...payload }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 3. تحليل الاستجابة
    const data = await response.json();

    if (!response.ok) {
      // ✅ 3. معالجة خاصة لأخطاء الرصيد والحدود
      if (response.status === 402) {
        return { ok: false, error: 'رصيدك من الذكاء الاصطناعي انتهى. يرجى الترقية للمتابعة.' };
      }
      if (response.status === 429) {
        return { ok: false, error: 'لقد تجاوزت الحد المسموح. حاول بعد قليل.' };
      }
      return { ok: false, error: data?.error || `HTTP ${response.status}` };
    }

    return data;
  } catch (error: any) {
    console.error('AI Service Error:', error);
    
    // ✅ 4. معالجة أخطاء الـ Timeout
    if (error.name === 'AbortError') {
      return { ok: false, error: 'استغرق التحليل وقتاً طويلاً. حاول مرة أخرى.' };
    }
    
    return { ok: false, error: 'حدث خطأ في الاتصال بالمدرب الذكي' };
  }
}
