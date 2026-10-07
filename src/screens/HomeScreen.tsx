import React, { useState, useMemo } from 'react'
import {
  Flame, Droplet, Sparkles, TrendingUp, Camera, Mic, Search,
  Plus, Scale, Award, Loader2, Utensils
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { askAi } from '../services/aiService'

interface Meal {
  name: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
}

/* ============ Helpers ============ */
function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'morning'
  if (h >= 12 && h < 17) return 'afternoon'
  if (h >= 17 && h < 22) return 'evening'
  return 'night'
}
function timeGreeting(t: ReturnType<typeof getTimeOfDay>): string {
  return { morning: 'صباح الخير', afternoon: 'مساء الخير', evening: 'مساء الخير', night: 'مرحباً' }[t]
}

/* ============ Sub-components ============ */
function MacroBar({ label, consumed, target, color }: {
  label: string; consumed: number; target: number; color: string;
}) {
  const pct = Math.min((consumed / Math.max(target, 1)) * 100, 100)
  return (
    <div style={{
      flex: 1, background: 'var(--color-surface-1)',
      border: '1px solid var(--color-border-subtle)',
      borderRadius: 'var(--radius-md)', padding: '12px 10px',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>{label}</span>
        <span style={{ color: 'var(--color-text-primary)', fontSize: 12, fontWeight: 700 }}>
          {Math.round(consumed)}
        </span>
      </div>
      <div style={{ height: 4, background: 'var(--color-surface-2)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 500ms ease' }} />
      </div>
    </div>
  )
}

function QuickAction({ Icon, label, onClick }: {
  Icon: any; label: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} aria-label={label} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      background: 'transparent', border: 'none', cursor: 'pointer',
      padding: 0, flex: 1, fontFamily: 'inherit',
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: 'var(--radius-md)',
        background: 'var(--color-surface-2)',
        border: '1px solid var(--color-border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} color="var(--color-primary-500)" strokeWidth={1.8} />
      </div>
      <span style={{ color: 'var(--color-text-muted)', fontSize: 10 }}>{label}</span>
    </button>
  )
}

/* ============ Main ============ */
export default function HomeScreen() {
  const navigate = useNavigate()
  const user = useStore((s) => s.user)
  const meals = useStore((s) => s.meals)
  const waterCups = useStore((s) => s.waterCups)
  const setWaterCups = useStore((s) => s.setWaterCups)
  const addMeal = useStore((s) => s.addMeal)

  const [loading, setLoading] = useState(false)

  const targetCalories = user?.targetCalories || 2300
  const targetProtein = 154
  const targetCarbs = 277
  const targetFat = 82

  const consumed = useMemo(() => ({
    calories: meals.reduce((s: number, m: Meal) => s + (m.calories || 0), 0),
    protein: meals.reduce((s: number, m: Meal) => s + (m.protein || 0), 0),
    carbs: meals.reduce((s: number, m: Meal) => s + (m.carbs || 0), 0),
    fat: meals.reduce((s: number, m: Meal) => s + (m.fat || 0), 0),
  }), [meals])

  const remaining = Math.max(targetCalories - consumed.calories, 0)

  const handleSuggest = async () => {
    setLoading(true)
    try {
      const res = await askAi('suggest', {
        body: {
          country: user?.country || 'MA',
          goal: user?.goal || 'maintain',
          remainingCalories: remaining,
        },
      })
      if (res?.ok && res.data) addMeal(res.data)
    } finally {
      setLoading(false)
    }
  }

  const tod = getTimeOfDay()
  const streak = 1
  const currentWeight = user?.weight || 69

  return (
    <div style={{
      padding: '16px 16px 120px',
      fontFamily: 'var(--font-arabic)',
      background: 'var(--color-bg-base)',
      minHeight: '100dvh',
      color: 'var(--color-text-primary)',
    }}>

      {/* HEADER */}
      <header style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 20,
      }}>
        <div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 13, margin: 0 }}>
            {timeGreeting(tod)}
          </p>
          <h1 style={{
            color: 'var(--color-text-primary)',
            fontSize: 22, fontWeight: 700, margin: '4px 0 0',
          }}>
            {user?.name || 'ضيف'}
          </h1>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'var(--color-surface-1)',
          padding: '8px 12px', borderRadius: 'var(--radius-full)',
          border: '1px solid var(--color-border-subtle)',
        }}>
          <Flame size={14} color="var(--color-warning)" fill="var(--color-warning)" />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{streak}</span>
        </div>
      </header>

      {/* PRIMARY KPI */}
      <div style={{
        background: 'var(--color-surface-1)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px 20px', textAlign: 'center', marginBottom: 16,
      }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13, margin: 0 }}>
          السعرات المتبقية
        </p>
        <h2 style={{
          fontSize: 56, color: 'var(--color-text-primary)',
          margin: '12px 0 4px', fontWeight: 700, lineHeight: 1,
        }}>
          {remaining.toLocaleString('ar-EG')}
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 12, margin: 0 }}>
          من {targetCalories.toLocaleString('ar-EG')} سعرة
        </p>
      </div>

      {/* MACROS */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <MacroBar label="بروتين" consumed={consumed.protein} target={targetProtein} color="var(--color-primary-500)" />
        <MacroBar label="كارب" consumed={consumed.carbs} target={targetCarbs} color="var(--color-bronze-500)" />
        <MacroBar label="دهون" consumed={consumed.fat} target={targetFat} color="var(--color-warning)" />
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button
          onClick={handleSuggest}
          disabled={loading}
          style={{
            flex: 1, padding: 14,
            background: 'var(--color-primary-500)',
            color: 'var(--color-text-on-primary)',
            border: 'none', borderRadius: 'var(--radius-md)',
            fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {loading
            ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> جاري...</>
            : <><Sparkles size={18} /> ماذا آكل الآن؟</>
          }
        </button>
        <button
          onClick={() => setWaterCups(waterCups + 1)}
          style={{
            flex: 1, padding: 14,
            background: 'var(--color-surface-1)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <Droplet size={18} color="var(--color-info)" />
          ماء ({waterCups})
        </button>
      </div>

      {/* QUICK ACTIONS */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 20,
        padding: '14px 8px',
        background: 'var(--color-surface-1)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-lg)',
      }}>
        <QuickAction Icon={Camera} label="تصوير" onClick={() => {}} />
        <QuickAction Icon={Mic} label="صوت" onClick={() => {}} />
        <QuickAction Icon={Search} label="بحث" onClick={() => navigate('/reports')} />
        <QuickAction Icon={Plus} label="إضافة" onClick={handleSuggest} />
        <QuickAction Icon={Droplet} label="ماء" onClick={() => setWaterCups(waterCups + 1)} />
      </div>

      {/* MEALS LIST */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 12,
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>وجبات اليوم</h3>
          <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{meals.length}</span>
        </div>

        {meals.length === 0 ? (
          <div style={{
            background: 'var(--color-surface-1)',
            border: '1px dashed var(--color-border-strong)',
            borderRadius: 'var(--radius-lg)',
            padding: 32, textAlign: 'center',
          }}>
            <Utensils size={28} color="var(--color-text-muted)" style={{ marginBottom: 10 }} />
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13, margin: 0 }}>
              لم تسجل أي وجبة بعد
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {meals.map((m: Meal, i: number) => (
              <div key={i} style={{
                background: 'var(--color-surface-1)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{m.name}</div>
                  {(m.protein || m.carbs || m.fat) && (
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                      ب {m.protein || 0}g · ك {m.carbs || 0}g · د {m.fat || 0}g
                    </div>
                  )}
                </div>
                <span style={{ color: 'var(--color-primary-500)', fontSize: 14, fontWeight: 700 }}>
                  {m.calories}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WEIGHT + STREAK */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => navigate('/reports')} style={{
          flex: 1, background: 'var(--color-surface-1)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-lg)', padding: 14,
          textAlign: 'right', cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-sm)',
            background: 'var(--color-surface-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Scale size={18} color="var(--color-bronze-500)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>الوزن</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{currentWeight} كغ</div>
          </div>
        </button>

        <button onClick={() => navigate('/profile')} style={{
          flex: 1, background: 'var(--color-surface-1)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-lg)', padding: 14,
          textAlign: 'right', cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-sm)',
            background: 'var(--color-surface-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Award size={18} color="var(--color-primary-500)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>السلسلة</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{streak} يوم</div>
          </div>
        </button>
      </div>
    </div>
  )
}
