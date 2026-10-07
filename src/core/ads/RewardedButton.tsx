import React, { useState } from 'react'
import { Play, Loader2, Check } from 'lucide-react'
import { useAds } from './AdContext'

export function RewardedButton({ onReward }: { onReward?: (n: number) => void }) {
  const { config, claimReward } = useAds()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  if (!config?.show_ads || !config.rewarded_available) return null

  const handleClaim = async () => {
    setLoading(true)
    try {
      const res = await claimReward()
      if (res.ok) { setDone(true); onReward?.(res.credits_added || 0) }
    } finally { setLoading(false) }
  }

  return (
    <button onClick={handleClaim} disabled={loading || done} style={{
      width: '100%', padding: '14px 16px',
      background: 'var(--color-surface-1)',
      border: '1px solid var(--color-border-subtle)',
      borderRadius: 'var(--radius-md)',
      display: 'flex', alignItems: 'center', gap: 12,
      cursor: done ? 'default' : 'pointer', fontFamily: 'var(--font-arabic)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 'var(--radius-sm)',
        background: 'var(--color-primary-500)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {loading ? <Loader2 size={18} color="white" style={{ animation: 'spin 1s linear infinite' }} /> :
         done ? <Check size={18} color="white" /> : <Play size={18} color="white" />}
      </div>
      <div style={{ flex: 1, textAlign: 'right' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {done ? 'تم الحصول على الرصيد' : 'شاهد إعلاناً واحصل على رصيد AI'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
          متبقي اليوم: {config.rewarded_remaining}
        </div>
      </div>
    </button>
  )
}
