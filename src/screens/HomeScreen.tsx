import React, { useState } from 'react'
import { Flame, Droplet, Plus, Sparkles, Camera, Bot, TrendingUp } from 'lucide-react'
import { colors, fonts, spacing, radius } from '../theme/theme'
import { useStore } from '../store/useStore'
import { askAi } from '../services/aiService'

export default function HomeScreen() {
  const { user, meals, waterCups, setWaterCups, addMeal } = useStore()
  const [loading, setLoading] = useState(false)
  const [suggestion, setSuggestion] = useState('')

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0)
  const remainingCalories = (user?.targetCalories || 2300) - totalCalories

  const handleSuggest = async () => {
    setLoading(true)
    const res = await askAi('suggest', {
      body: { country: user?.country || 'SA', goal: 'maintain', remainingCalories }
    })
    if (res.ok) {
      setSuggestion(res.data.name || 'وجبة مقترحة')
      addMeal(res.data)
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '16px', paddingBottom: '100px', fontFamily: fonts.regular, background: colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <p style={{ color: colors.textMuted, fontSize: '13px', marginBottom: '4px' }}>مرحباً 👋</p>
          <h1 style={{ fontSize: '22px', margin: 0, color: colors.text, fontWeight: 'bold' }}>{user?.name || 'أبو'}</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', background: colors.surface, padding: '8px 14px', borderRadius: '20px', gap: '6px' }}>
          <Flame size={16} color="#FFA726" />
          <span style={{ color: colors.text, fontSize: '14px', fontWeight: 'bold' }}>{totalCalories}</span>
        </div>
      </div>

      {/* Circular Progress */}
      <div style={{ background: colors.surface, padding: '24px', borderRadius: '20px', textAlign: 'center', marginBottom: '20px', border: '1px solid #2A2A3E' }}>
        <p style={{ color: colors.textMuted, fontSize: '14px', marginBottom: '16px' }}>السعرات المتبقية</p>
        <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto' }}>
          <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="90" cy="90" r="80" stroke="#2A2A3E" strokeWidth="12" fill="none" />
            <circle cx="90" cy="90" r="80" stroke="url(#grad)" strokeWidth="12" fill="none" strokeDasharray={2 * Math.PI * 80} strokeDashoffset={2 * Math.PI * 80 * (1 - Math.min(totalCalories / (user?.targetCalories || 2300), 1))} strokeLinecap="round" />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF6B9D" />
                <stop offset="100%" stopColor="#FFA726" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <h2 style={{ fontSize: '36px', margin: 0, color: remainingCalories < 0 ? colors.danger : colors.text, fontWeight: 'bold' }}>{remainingCalories}</h2>
            <p style={{ color: colors.textMuted, fontSize: '12px', margin: 0 }}>من {user?.targetCalories} سعرة</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button onClick={handleSuggest} disabled={loading} style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #FF6B9D, #FFA726)', color: 'white', border: 'none', borderRadius: '14px', fontFamily: fonts.regular, fontSize: '14px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {loading ? 'جاري التحليل...' : <><Sparkles size={18} /> اقترح لي</>}
        </button>
        <button onClick={() => setWaterCups(waterCups + 1)} style={{ flex: 1, padding: '14px', background: colors.surface, color: colors.text, border: '1px solid #2A2A3E', borderRadius: '14px', fontFamily: fonts.regular, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Droplet size={18} color="#4FC3F7" /> ماء ({waterCups})
        </button>
      </div>

      {/* AI Suggestion Card */}
      {suggestion && (
        <div style={{ background: 'linear-gradient(135deg, #FF6B9D15, #FFA72615)', padding: '16px', borderRadius: '14px', marginBottom: '20px', border: '1px solid #FF6B9D44' }}>
          <p style={{ margin: 0, color: colors.primary, fontSize: '14px', fontWeight: 'bold' }}>✨ الاقتراح الذكي: {suggestion}</p>
        </div>
      )}

      {/* Meals List */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '16px', margin: 0, color: colors.text, fontWeight: 'bold' }}>وجبات اليوم</h3>
        <span style={{ color: colors.textMuted, fontSize: '12px' }}>{meals.length} وجبة</span>
      </div>

      {meals.length === 0 ? (
        <div style={{ background: colors.surface, padding: '32px 16px', borderRadius: '14px', textAlign: 'center', border: '1px dashed #2A2A3E' }}>
          <p style={{ color: colors.textMuted, fontSize: '14px', margin: 0 }}>لم تسجل أي وجبة بعد. جرب "اقترح لي" أو صوّر وجبتك!</p>
        </div>
      ) : (
        meals.map((meal, idx) => (
          <div key={idx} style={{ background: colors.surface, padding: '14px', borderRadius: '14px', marginBottom: '8px', border: '1px solid #2A2A3E' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: colors.text, fontSize: '14px', fontWeight: 'bold' }}>{meal.name}</span>
              <span style={{ color: colors.primary, fontSize: '14px', fontWeight: 'bold' }}>{meal.calories} سعرة</span>
            </div>
            <div style={{ display: 'flex', gap: '16px', color: colors.textMuted, fontSize: '12px' }}>
              <span>بروتين: {meal.protein}g</span>
              <span>كارب: {meal.carbs}g</span>
              <span>دهون: {meal.fat}g</span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
