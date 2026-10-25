// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mneayhrosncrvrutteomb.supabase.co';
const supabaseAnonKey = 'sb_publishable_8HuVSaHiYjipR5mMm3-vgA_GAcjJf_v';

// ✅ عميل نظيف للقراءة فقط (Read-only client)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getFoodImageUrl(fileName: string | null | undefined): string {
  if (!fileName) return '';
  const { data } = supabase.storage.from('meals').getPublicUrl(fileName);
  return data.publicUrl;
}
