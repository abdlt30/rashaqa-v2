import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://mneayhrosncrvurteomb.supabase.co'

const supabaseKey = 'sb_publishable_8HuVSaHiYjipR5mMm3-vgA_GAcjJf_v'

export const supabase = createClient(supabaseUrl, supabaseKey)


export function getFoodImageUrl(fileName: string): string {

  const { data } = supabase.storage.from('meals').getPublicUrl(fileName)

  return data.publicUrl

}
