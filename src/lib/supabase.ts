// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// ✅ استخدام القيم المباشرة كاحتياط (Fallback) لضمان عمل تطبيق الأندرويد
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mneayhrosncrvrutteomb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_8HuVSaHiYjipR5mMm3-vgA_GAcjJf_v';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getFoodImageUrl(fileName: string | null | undefined): string {
  if (!fileName) return '';
  const { data } = supabase.storage.from('meals').getPublicUrl(fileName);
  return data.publicUrl;
}
