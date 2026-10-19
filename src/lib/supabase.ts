// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mneayhrosncrvrutteomb.supabase.co';
const supabaseAnonKey = 'sb_publishable_8HuVSaHiYjipR5mMm3-vgA_GAcjJf_v';

// ✅ إضافة مهلة زمنية (Timeout) لمنع تعليق التطبيق
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    fetch: (url, options) => {
      // إضافة مهلة 10 ثوانٍ لأي طلب
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      return fetch(url, { ...options, signal: controller.signal })
        .finally(() => clearTimeout(timeoutId));
    },
  },
});

export function getFoodImageUrl(fileName: string | null | undefined): string {
  if (!fileName) return '';
  const { data } = supabase.storage.from('meals').getPublicUrl(fileName);
  return data.publicUrl;
}
