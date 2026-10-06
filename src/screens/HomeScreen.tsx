import React, { useState } from 'react'
import { Flame, Droplet, Sparkles, TrendingUp } from 'lucide-react'
import { useStore } from '../store/useStore'
import { askAi } from '../services/aiService'

export default function HomeScreen() {
  const user = useStore((s: any) => s.user)
  const meals = useStore((s: any) => s.meals)
  const waterCups = useStore((s: any) => s.waterCups)
  const setWaterCups = useStore((s: any) => s.setWaterCups)
  const addMeal = useStore((s: any) => s.addMeal)
  const [loading, setLoading] = useState(false)
  const total = meals.reduce((sum: number, m: any) => sum + (m.calories || 0), 0)
  const target = user?.targetCalories || 2300
  const remaining = target - total
  const handleSuggest = async () => {
    setLoading(true)
    try {
      const res = await askAi('suggest', { body: { country: user?.country || 'SA', goal: user?.goal || 'maintain', remainingCalories: remaining } })
      if (res?.ok && res.data) addMeal(res.data)
    } finally { setLoading(false) }
  }
  return (
    <div style={{ padding: '16px 16px 100px', fontFamily: 'var(--font-arabic)', background: 'var(--color-bg-base)', minHeight: '100dvh' }}>
      <h1 style={{ color: 'var(--color-text-primary)' }}>مرحباً {user?.name || 'ضيف'}</h1>
      <div style={{ background: 'var(--color-surface-1)', padding: 24, borderRadius: 'var(--radius-xl)', textAlign: 'center', marginTop: 16 }}>
        <p style={{ color: 'var(--color-text-muted)' }}>السعرات المتبقية</p>
        <h2 style={{ fontSize: 48, color: 'var(--color-text-primary)', margin: 8 }}>{remaining}</h2>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <button onClick={handleSuggest} disabled={loading} style={{ flex: 1, padding: 14, background: 'var(--color-primary-500)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>{loading ? 'جاري...' : 'اقترح لي'}</button>
        <button onClick={() => setWaterCups(waterCups + 1)} style={{ flex: 1, padding: 14, background: 'var(--color-surface-1)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>ماء ({waterCups})</button>
      </div>
    </div>
  )
}
