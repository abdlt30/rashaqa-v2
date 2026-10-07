import React, { useEffect } from 'react'
import { useAds } from './AdContext'

export function AdSlot({ type, slotId, style }: {
  type: 'banner' | 'native'
  slotId: string
  style?: React.CSSProperties
}) {
  const { provider, config, ready } = useAds()

  useEffect(() => {
    if (!ready || !provider || !config?.show_ads) return
    if (type === 'banner' && config.banner_enabled) provider.showBanner(slotId)
    return () => { provider.hideBanner() }
  }, [ready, provider, config, type, slotId])

  if (!ready || !config?.show_ads) return null

  return (
    <div data-ad-slot={slotId} style={{
      minHeight: type === 'banner' ? 50 : 90,
      background: 'var(--color-surface-1)',
      borderRadius: 'var(--radius-md)',
      border: '1px dashed var(--color-border-subtle)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--color-text-muted)', fontSize: 11,
      fontFamily: 'var(--font-arabic)', ...style,
    }}>مساحة إعلانية</div>
  )
}
