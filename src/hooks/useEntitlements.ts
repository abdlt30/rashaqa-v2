import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useEntitlements() {
  const [ent, setEnt] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setEnt(null); return }
      const { data } = await supabase.rpc('get_entitlements', { p_user_id: user.id })
      if (data) setEnt(data)
    } catch (e) { console.warn('[Entitlements]', e) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return { ent, loading, refresh }
}
