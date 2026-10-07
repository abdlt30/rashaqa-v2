import { supabase } from '../lib/supabase'

const AI_FUNCTION_URL = 'https://axthmghawwishcjlldfj.supabase.co/functions/v1/smart-service'

export async function askAi(action: string, payload: any) {
  try {
    // احصل على الجلسة الحالية
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.access_token) {
      return { ok: false, error: 'يجب تسجيل الدخول أولاً' }
    }

    const response = await fetch(AI_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ action, ...payload }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { ok: false, error: data?.error || `HTTP ${response.status}` }
    }

    return data
  } catch (error) {
    console.error('AI Service Error:', error)
    return { ok: false, error: 'حدث خطأ في الاتصال بالمدرب الذكي' }
  }
}
