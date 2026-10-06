import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://axthmghawwishcjlldfj.supabase.co'
const supabaseKey = 'sb_publishable_65sfnmWes7WZbqKmJ931-g_aakVowXY'

export const supabase = createClient(supabaseUrl, supabaseKey)

export function getFoodImageUrl(fileName: string): string {
  const { data } = supabase.storage.from('meals').getPublicUrl(fileName)
  return data.publicUrl
}
