import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://axthmghawwishcjlldfj.supabase.co'
// استبدل YOUR_ANON_KEY أدناه بالمفتاح العام من إعدادات مشروعك في Supabase (Project Settings -> API)
const supabaseAnonKey = 'YOUR_ANON_KEY_HERE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// دالة لجلب رابط صورة الوجبة من Storage
export function getFoodImageUrl(fileName: string): string {
  const { data } = supabase.storage.from('meals').getPublicUrl(fileName);
  return data.publicUrl;
}
