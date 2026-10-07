import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useEntitlements } from '../../hooks/useEntitlements'
import { NoopProvider } from './providers/NoopProvider'
import { MockProvider } from './providers/MockProvider'
import type { AdProvider, AdConfig } from './types'

interface AdContextValue {
  provider: AdProvider | null
  config: AdConfig | null
  ready: boolean
  claimReward: () => Promise<{ ok: boolean; credits_added?: number; error?: string }>
}

const AdContext = createContext<AdContextValue>({
  provider: null, config: null, ready: false,
  claimReward: async () => ({ ok: false, error: 'not_ready' }),
})

export function AdProviderRoot({ children }: { children: React.ReactNode }) {
  const { ent } = useEntitlements()
  const [provider, setProvider] = useState<AdProvider | null>(null)
  const [config, setConfig] = useState<AdConfig | null>(null)
  const [ready, setReady] = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    async function bootstrap() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setReady(true); return }
        const { data: cfg } = await supabase.rpc('get_ad_config', { p_user_id: user.id })
        setConfig(cfg as AdConfig)
        const isPremium = ent?.is_premium ?? false
        const p: AdProvider = isPremium ? new NoopProvider() : new MockProvider()
        await p.initialize()
        setProvider(p)
      } catch (e) { console.warn('[Ads]', e) }
      finally { setReady(true) }
    }
    bootstrap()
  }, [ent?.is_premium])

  const claimReward = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { ok: false, error: 'not_authenticated' }
    if (!provider) return { ok: false, error: 'no_provider' }
    const shown = await provider.showRewarded()
    if (!shown.success) return { ok: false, error: shown.error }
    const { data, error } = await supabase.rpc('claim_rewarded_ad', {
      p_user_id: user.id,
      p_ad_provider: config?.provider || 'mock',
      p_reward_type: 'ai_credit',
    })
    if (error) return { ok: false, error: error.message }
    return data as any
  }

  return (
    <AdContext.Provider value={{ provider, config, ready, claimReward }}>
      {children}
    </AdContext.Provider>
  )
}

export function useAds() { return useContext(AdContext) }
