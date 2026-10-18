// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("مفاتيح Supabase مفقودة. يرجى التأكد من ملف .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getFoodImageUrl(fileName: string): string {
  const { data } = supabase.storage.from('meals').getPublicUrl(fileName);
  return data.publicUrl;
}
