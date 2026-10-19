// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// ✅ وضع الرابط والمفتاح مباشرة لضمان عمل تطبيق الأندرويد
// هذه هي مفاتيح مشروعك (ArabHealth-DB)
const supabaseUrl = 'https://mneayhrosncrvrutteomb.supabase.co';
const supabaseAnonKey = 'sb_publishable_8HuVSaHiYjipR5mMm3-vgA_GAcjJf_v';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getFoodImageUrl(fileName: string | null | undefined): string {
  if (!fileName) return '';
  const { data } = supabase.storage.from('meals').getPublicUrl(fileName);
  return data.publicUrl;
}
