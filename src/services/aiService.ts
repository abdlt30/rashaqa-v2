const AI_FUNCTION_URL = 'https://axthmghawwishcjlldfj.supabase.co/functions/v1/smart-service';

export async function askAi(action: string, payload: any) {
  try {
    const response = await fetch(AI_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...payload }),
    });
    return await response.json();
  } catch (error) {
    console.error('AI Service Error:', error);
    return { ok: false, error: 'حدث خطأ في الاتصال' };
  }
}
