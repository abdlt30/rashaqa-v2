// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// ✅ استخدام القيم المباشرة كاحتياط (Fallback) لضمان عمل تطبيق الأندرويد
// ملاحظة أمنية: المفتاح المستخدم هو "publishable/anon" وهو آمن للاستخدام في الواجهة الأمامية.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mneayhrosncrvrutteomb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_8HuVSaHiYjipR5mMm3-vgA_GAcjJf_v';

// حذفنا شرط throw new Error لأنه كان يسبب انهيار التطبيق (الشاشة البيضاء)
// إذا كانت المفاتيح مفقودة، ستكون القيم الافتراضية هي المستخدمة.

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getFoodImageUrl(fileName: string | null | undefined): string {
  if (!fileName) return '';
  const { data } = supabase.storage.from('meals').getPublicUrl(fileName);
  return data.publicUrl;
}
