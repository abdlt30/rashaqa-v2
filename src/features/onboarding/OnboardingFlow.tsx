import React, { useState, useEffect } from 'react'
import {
  Sparkles, Camera, Bot, TrendingDown, Scale, TrendingUp,
  ChevronRight, ChevronLeft, Flame, Droplet, Loader2,
  Mail, Lock, Eye, EyeOff, Check, User, Ruler, Activity as ActivityIcon,
  Utensils, Target
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useStore } from '../../store/useStore'
import { useOnboarding } from './store'
import { calculateTargets } from './calc'
import type { OnboardingData } from './calc'

/* ============================================================
   REUSABLE COMPONENTS
   ============================================================ */

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = (step / total) * 100
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--color-border-subtle)' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: 'var(--color-primary-500)', transition: 'width 400ms ease' }} />
    </div>
  )
}

function Header({ onBack }: { onBack?: () => void }) {
  return (
    <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '64px' }}>
      {onBack ? (
        <button onClick={onBack} aria-label="رجوع" style={{ background: 'transparent', border: 'none', padding: 8, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ChevronRight size={22} color="var(--color-text-secondary)" />
        </button>
      ) : <div style={{ width: 38 }} />}
    </div>
  )
}

function PrimaryButton({ children, onClick, disabled, loading }: {
  children: React.ReactNode; onClick: () => void; disabled?: boolean; loading?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        width: '100%', padding: '18px',
        background: disabled ? 'var(--color-surface-2)' : 'var(--color-primary-500)',
        color: disabled ? 'var(--color-text-muted)' : 'var(--color-text-on-primary)',
        border: 'none', borderRadius: 'var(--radius-lg)',
        fontSize: 'var(--fs-body-lg)', fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        transition: 'all 200ms ease',
      }}
    >
      {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : children}
    </button>
  )
}

function GhostButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '14px', background: 'transparent',
      color: 'var(--color-text-muted)', border: 'none',
      fontSize: 'var(--fs-body-sm)', cursor: 'pointer', fontFamily: 'inherit',
    }}>{children}</button>
  )
}

function TextInput({ label, value, onChange, placeholder, type = 'text', error }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; error?: string
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-body-sm)', fontWeight: 500, marginBottom: '8px', display: 'block' }}>{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '16px 18px',
          background: 'var(--color-surface-1)',
          border: `1.5px solid ${error ? 'var(--color-error)' : value ? 'var(--color-primary-500)' : 'var(--color-border-subtle)'}`,
          borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)',
          fontSize: 'var(--fs-body)', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none',
        }}
      />
      {error && <p style={{ color: 'var(--color-error)', fontSize: 'var(--fs-caption)', marginTop: 6 }}>{error}</p>}
    </div>
  )
}

function NumberInput({ label, value, onChange, unit, min, max }: {
  label: string; value: number; onChange: (v: number) => void;
  unit?: string; min?: number; max?: number
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-body-sm)', fontWeight: 500, marginBottom: '8px', display: 'block' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type="number" value={value || ''} onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          min={min} max={max}
          style={{
            width: '100%', padding: '16px 18px',
            background: 'var(--color-surface-1)',
            border: `1.5px solid ${value ? 'var(--color-primary-500)' : 'var(--color-border-subtle)'}`,
            borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)',
            fontSize: 'var(--fs-body)', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none',
            appearance: 'textfield',
          }}
        />
        {unit && <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: 'var(--fs-body-sm)' }}>{unit}</span>}
      </div>
    </div>
  )
}

function OptionCard({ icon: Icon, title, subtitle, selected, onClick }: {
  icon?: any; title: string; subtitle?: string; selected: boolean; onClick: () => void
}) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 16, padding: 16,
      background: 'var(--color-surface-1)',
      border: `1.5px solid ${selected ? 'var(--color-primary-500)' : 'var(--color-border-subtle)'}`,
      borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'right',
      fontFamily: 'inherit', transition: 'all 200ms ease', width: '100%',
    }}>
      {Icon && (
        <div style={{
          width: 48, height: 48, borderRadius: 'var(--radius-md)',
          background: selected ? 'var(--color-primary-500)' : 'var(--color-surface-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={24} color={selected ? 'var(--color-text-on-primary)' : 'var(--color-text-muted)'} strokeWidth={2} />
        </div>
      )}
      <div style={{ flex: 1 }}>
        <div style={{ color: 'var(--color-text-primary)', fontSize: 'var(--fs-body)', fontWeight: 600, marginBottom: subtitle ? 4 : 0 }}>{title}</div>
        {subtitle && <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-body-sm)' }}>{subtitle}</div>}
      </div>
      <div style={{
        width: 20, height: 20, borderRadius: 'var(--radius-full)',
        border: `2px solid ${selected ? 'var(--color-primary-500)' : 'var(--color-border-strong)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: 'var(--radius-full)', background: 'var(--color-primary-500)' }} />}
      </div>
    </button>
  )
}

/* ============================================================
   STEPS
   ============================================================ */

function WelcomeStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg-base)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-arabic)' }}>
      <Header />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', gap: 40 }}>
        <div style={{
          width: 128, height: 128, borderRadius: 'var(--radius-2xl)',
          background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles size={56} color="var(--color-primary-500)" strokeWidth={1.8} />
        </div>
        <div style={{ textAlign: 'center', maxWidth: 340 }}>
          <h1 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--fs-h1)', fontWeight: 700, margin: '0 0 16px', lineHeight: 1.3 }}>
            أهلاً بك في رشاقة
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-body)', lineHeight: 1.7, margin: 0 }}>
            رفيقك العربي الذكي. سنبني خطتك في أقل من دقيقتين.
          </p>
        </div>
      </div>
      <div style={{ padding: '24px 24px calc(32px + env(safe-area-inset-bottom))' }}>
        <PrimaryButton onClick={onNext}>ابدأ رحلتي</PrimaryButton>
        <GhostButton onClick={onSkip}>تصفح كضيف</GhostButton>
      </div>
    </div>
  )
}

function GoalStep({ value, onSelect, onNext, onBack }: { value: string; onSelect: (v: string) => void; onNext: () => void; onBack: () => void }) {
  const options = [
    { key: 'lose', Icon: TrendingDown, title: 'إنقاص الوزن', sub: 'حرق دهون بشكل صحي' },
    { key: 'maintain', Icon: Scale, title: 'الحفاظ على وزني', sub: 'نمط حياة متوازن' },
    { key: 'gain', Icon: TrendingUp, title: 'زيادة الوزن', sub: 'بناء عضلات صحية' },
  ]
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg-base)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-arabic)', position: 'relative' }}>
      <ProgressBar step={2} total={8} />
      <Header onBack={onBack} />
      <div style={{ flex: 1, padding: '24px' }}>
        <h1 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--fs-h1)', fontWeight: 700, margin: '0 0 8px' }}>ما هو هدفك؟</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-body)', margin: '0 0 32px' }}>سنخصص خطتك بناءً عليه</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {options.map((o) => (
            <OptionCard key={o.key} icon={o.Icon} title={o.title} subtitle={o.sub} selected={value === o.key} onClick={() => onSelect(o.key)} />
          ))}
        </div>
      </div>
      <div style={{ padding: '24px 24px calc(32px + env(safe-area-inset-bottom))' }}>
        <PrimaryButton onClick={onNext} disabled={!value}>التالي</PrimaryButton>
      </div>
    </div>
  )
}

function ProfileStep({ data, update, onNext, onBack }: { data: any; update: (p: any) => void; onNext: () => void; onBack: () => void }) {
  const valid = data.name?.trim()?.length >= 2 && data.age >= 14 && data.age <= 90 && data.gender
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg-base)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-arabic)', position: 'relative' }}>
      <ProgressBar step={3} total={8} />
      <Header onBack={onBack} />
      <div style={{ flex: 1, padding: '24px' }}>
        <h1 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--fs-h1)', fontWeight: 700, margin: '0 0 8px' }}>من أنت؟</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-body)', margin: '0 0 32px' }}>لنحسب احتياجك بدقة</p>
        <TextInput label="الاسم" value={data.name || ''} onChange={(v) => update({ name: v })} placeholder="مثلاً: أبو محمد" />
        <NumberInput label="العمر" value={data.age} onChange={(v) => update({ age: v })} unit="سنة" min={14} max={90} />
        <label style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-body-sm)', fontWeight: 500, marginBottom: 12, display: 'block' }}>الجنس</label>
        <div style={{ display: 'flex', gap: 12 }}>
          {[{ k: 'male', t: 'ذكر' }, { k: 'female', t: 'أنثى' }].map((g) => (
            <button key={g.k} onClick={() => update({ gender: g.k })} style={{
              flex: 1, padding: 16, background: 'var(--color-surface-1)',
              border: `1.5px solid ${data.gender === g.k ? 'var(--color-primary-500)' : 'var(--color-border-subtle)'}`,
              borderRadius: 'var(--radius-lg)', cursor: 'pointer', color: 'var(--color-text-primary)',
              fontSize: 'var(--fs-body)', fontWeight: 600, fontFamily: 'inherit',
            }}>{g.t}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: '24px 24px calc(32px + env(safe-area-inset-bottom))' }}>
        <PrimaryButton onClick={onNext} disabled={!valid}>التالي</PrimaryButton>
      </div>
    </div>
  )
}

function BodyStep({ data, update, onNext, onBack }: { data: any; update: (p: any) => void; onNext: () => void; onBack: () => void }) {
  const valid = data.height_cm >= 100 && data.height_cm <= 220 && data.weight_kg >= 30 && data.weight_kg <= 250
  const showTarget = data.goal === 'lose' || data.goal === 'gain'
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg-base)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-arabic)', position: 'relative' }}>
      <ProgressBar step={4} total={8} />
      <Header onBack={onBack} />
      <div style={{ flex: 1, padding: '24px' }}>
        <h1 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--fs-h1)', fontWeight: 700, margin: '0 0 8px' }}>بياناتك الحالية</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-body)', margin: '0 0 32px' }}>لحساب احتياجك اليومي</p>
        <NumberInput label="الطول" value={data.height_cm} onChange={(v) => update({ height_cm: v })} unit="سم" min={100} max={220} />
        <NumberInput label="الوزن الحالي" value={data.weight_kg} onChange={(v) => update({ weight_kg: v })} unit="كغ" min={30} max={250} />
        {showTarget && (
          <NumberInput label="الوزن المستهدف" value={data.target_weight_kg} onChange={(v) => update({ target_weight_kg: v })} unit="كغ" min={30} max={250} />
        )}
      </div>
      <div style={{ padding: '24px 24px calc(32px + env(safe-area-inset-bottom))' }}>
        <PrimaryButton onClick={onNext} disabled={!valid}>التالي</PrimaryButton>
      </div>
    </div>
  )
}

function ActivityStep({ value, onSelect, onNext, onBack }: { value: string; onSelect: (v: string) => void; onNext: () => void; onBack: () => void }) {
  const options = [
    { key: 'sedentary', Icon: User, title: 'خامل', sub: 'عمل مكتبي بدون رياضة' },
    { key: 'light', Icon: User, title: 'نشاط خفيف', sub: '1-3 أيام رياضة أسبوعياً' },
    { key: 'moderate', Icon: ActivityIcon, title: 'متوسط', sub: '3-5 أيام رياضة أسبوعياً' },
    { key: 'active', Icon: ActivityIcon, title: 'عالي', sub: '6-7 أيام رياضة أسبوعياً' },
    { key: 'very_active', Icon: Flame, title: 'مكثف', sub: 'رياضي محترف أو عمل بدني' },
  ]
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg-base)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-arabic)', position: 'relative' }}>
      <ProgressBar step={5} total={8} />
      <Header onBack={onBack} />
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        <h1 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--fs-h1)', fontWeight: 700, margin: '0 0 8px' }}>مستوى نشاطك؟</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-body)', margin: '0 0 32px' }}>بناءً على أسبوعك المعتاد</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {options.map((o) => (
            <OptionCard key={o.key} icon={o.Icon} title={o.title} subtitle={o.sub} selected={value === o.key} onClick={() => onSelect(o.key)} />
          ))}
        </div>
      </div>
      <div style={{ padding: '24px 24px calc(32px + env(safe-area-inset-bottom))' }}>
        <PrimaryButton onClick={onNext} disabled={!value}>التالي</PrimaryButton>
      </div>
    </div>
  )
}

function DietStep({ value, onSelect, onNext, onSkip, onBack }: { value?: string; onSelect: (v: string) => void; onNext: () => void; onSkip: () => void; onBack: () => void }) {
  const options = [
    { key: 'balanced', Icon: Utensils, title: 'متوازن', sub: 'لا قيود غذائية' },
    { key: 'vegetarian', Icon: Utensils, title: 'نباتي', sub: 'بدون لحوم' },
    { key: 'low_carb', Icon: Utensils, title: 'قليل الكارب', sub: 'تقليل النشويات' },
    { key: 'high_protein', Icon: Utensils, title: 'عالي البروتين', sub: 'لبناء العضلات' },
    { key: 'keto', Icon: Utensils, title: 'كيتو', sub: 'دهون عالية، كارب منخفض' },
  ]
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg-base)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-arabic)', position: 'relative' }}>
      <ProgressBar step={6} total={8} />
      <Header onBack={onBack} />
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        <h1 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--fs-h1)', fontWeight: 700, margin: '0 0 8px' }}>تفضيلك الغذائي؟</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-body)', margin: '0 0 32px' }}>اختياري — يمكنك تخطيه</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {options.map((o) => (
            <OptionCard key={o.key} icon={o.Icon} title={o.title} subtitle={o.sub} selected={value === o.key} onClick={() => onSelect(o.key)} />
          ))}
        </div>
      </div>
      <div style={{ padding: '24px 24px calc(32px + env(safe-area-inset-bottom))' }}>
        <PrimaryButton onClick={onNext} disabled={!value}>التالي</PrimaryButton>
        <GhostButton onClick={onSkip}>تخطى</GhostButton>
      </div>
    </div>
  )
}

function RevealStep({ data, targets, onNext, onBack }: { data: any; targets: any; onNext: () => void; onBack: () => void }) {
  const [displayCalories, setDisplayCalories] = useState(0)

  useEffect(() => {
    if (!targets) return
    let current = 0
    const step = targets.calories / 40
    const interval = setInterval(() => {
      current += step
      if (current >= targets.calories) {
        setDisplayCalories(targets.calories)
        clearInterval(interval)
      } else setDisplayCalories(Math.floor(current))
    }, 20)
    return () => clearInterval(interval)
  }, [targets])

  if (!targets) return null

  const macros = [
    { label: 'بروتين', value: targets.protein_g, unit: 'g', color: 'var(--color-primary-500)', pct: 25 },
    { label: 'كارب', value: targets.carbs_g, unit: 'g', color: 'var(--color-bronze-500)', pct: 45 },
    { label: 'دهون', value: targets.fat_g, unit: 'g', color: 'var(--color-warning)', pct: 30 },
  ]

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg-base)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-arabic)', position: 'relative' }}>
      <ProgressBar step={7} total={8} />
      <Header onBack={onBack} />
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--fs-h1)', fontWeight: 700, margin: '0 0 8px' }}>خطتك جاهزة</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-body)', margin: 0 }}>هذه نقطة البداية — يمكنك تعديلها لاحقاً</p>
        </div>

        {/* Big Calories */}
        <div style={{
          background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-xl)', padding: 32, textAlign: 'center', marginBottom: 20,
        }}>
          <Flame size={28} color="var(--color-primary-500)" style={{ marginBottom: 12 }} />
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-body-sm)', marginBottom: 8 }}>السعرات اليومية</div>
          <div style={{ color: 'var(--color-text-primary)', fontSize: 56, fontWeight: 700, lineHeight: 1 }}>
            {displayCalories.toLocaleString('ar-EG')}
          </div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-body-sm)', marginTop: 8 }}>سعرة / يوم</div>
        </div>

        {/* Macros */}
        <div style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 20 }}>
          <div style={{ color: 'var(--color-text-primary)', fontSize: 'var(--fs-h3)', fontWeight: 600, marginBottom: 16 }}>توزيع الماكروز</div>
          {macros.map((m) => (
            <div key={m.label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-body-sm)' }}>{m.label}</span>
                <span style={{ color: 'var(--color-text-primary)', fontSize: 'var(--fs-body-sm)', fontWeight: 600 }}>{m.value}{m.unit}</span>
              </div>
              <div style={{ height: 6, background: 'var(--color-surface-2)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${m.pct}%`, height: '100%', background: m.color, transition: 'width 800ms ease 400ms' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Water */}
        <div style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Droplet size={24} color="var(--color-info)" />
          <div style={{ flex: 1 }}>
            <div style={{ color: 'var(--color-text-primary)', fontSize: 'var(--fs-body)', fontWeight: 600 }}>هدف الماء اليومي</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-body-sm)' }}>{(targets.water_ml / 1000).toFixed(1)} لتر</div>
          </div>
        </div>

        {/* Arabic Badge */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(31,111,95,0.12), rgba(201,169,97,0.08))',
          border: '1px solid rgba(31,111,95,0.25)',
          borderRadius: 'var(--radius-lg)', padding: 16, textAlign: 'center',
        }}>
          <div style={{ color: 'var(--color-primary-500)', fontSize: 'var(--fs-body)', fontWeight: 600 }}>
            107 طبقاً عربياً مناسباً لهدفك
          </div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-caption)', marginTop: 4 }}>
            من 17 دولة عربية
          </div>
        </div>
      </div>
      <div style={{ padding: '24px 24px calc(32px + env(safe-area-inset-bottom))' }}>
        <PrimaryButton onClick={onNext}>احفظ خطتي</PrimaryButton>
      </div>
    </div>
  )
}

function AccountStep({ onComplete, onSkip, onBack }: { onComplete: (email: string) => Promise<void>; onSkip: () => void; onBack: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validPass = password.length >= 8
  const valid = validEmail && validPass

  const handleSubmit = async () => {
    if (!valid) return
    setLoading(true); setError('')
    try { await onComplete(email) }
    catch (e: any) { setError(e?.message || 'حدث خطأ') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg-base)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-arabic)', position: 'relative' }}>
      <ProgressBar step={8} total={8} />
      <Header onBack={onBack} />
      <div style={{ flex: 1, padding: '24px' }}>
        <h1 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--fs-h1)', fontWeight: 700, margin: '0 0 8px' }}>احفظ خطتك</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-body)', margin: '0 0 32px' }}>
          حسابك يحفظ تقدمك ويُزامن بين الأجهزة
        </p>

        <TextInput label="البريد الإلكتروني" value={email} onChange={setEmail} placeholder="you@example.com" type="email" />
        <div style={{ position: 'relative' }}>
          <TextInput label="كلمة المرور" value={password} onChange={setPassword} placeholder="8 أحرف على الأقل" type={showPass ? 'text' : 'password'} />
          <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', left: 14, top: 44, background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}>
            {showPass ? <EyeOff size={18} color="var(--color-text-muted)" /> : <Eye size={18} color="var(--color-text-muted)" />}
          </button>
        </div>

        {error && <p style={{ color: 'var(--color-error)', fontSize: 'var(--fs-body-sm)', marginTop: -12, marginBottom: 16 }}>{error}</p>}
      </div>

      <div style={{ padding: '24px 24px calc(32px + env(safe-area-inset-bottom))' }}>
        <PrimaryButton onClick={handleSubmit} disabled={!valid} loading={loading}>إنشاء الحساب</PrimaryButton>
        <GhostButton onClick={onSkip}>متابعة كضيف</GhostButton>
      </div>
    </div>
  )
}

/* ============================================================
   MAIN FLOW
   ============================================================ */

export default function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const [calculating, setCalculating] = useState(false)
  const { data, targets, update, setTargets, reset } = useOnboarding()
  const { completeOnboarding, skipLogin, login } = useStore()

  const goNext = () => setStep((s) => s + 1)
  const goBack = () => setStep((s) => Math.max(0, s - 1))

  const handleGoalNext = () => goNext()

  const handleDietNext = () => {
    // Calculate targets
    setCalculating(true)
    setTimeout(() => {
      const t = calculateTargets(data as OnboardingData)
      setTargets(t)
      setCalculating(false)
      goNext()
    }, 800)
  }

  const handleAccountCreate = async (email: string) => {
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password: 'temp-placeholder', // will be handled properly
    })
    if (error) throw error
    // Save profile to supabase
    if (authData.user) {
      await supabase.from('profiles').upsert({
        id: authData.user.id,
        name: data.name || '',
        country: 'MA',
        gender: data.gender,
        birth_date: null,
        height_cm: data.height_cm,
        activity_level: data.activity_level,
        goal: data.goal,
        target_weight_kg: data.target_weight_kg,
        daily_calorie_target: targets?.calories,
        onboarding_completed: true,
      })
    }
    // Update local store
    completeOnboarding({
      name: data.name || 'صديق',
      goal: data.goal || 'maintain',
    })
    login(email)
  }

  const handleSkip = () => {
    completeOnboarding({ name: 'ضيف', goal: 'maintain' })
    skipLogin()
  }

  // Calc loading
  if (calculating) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--color-bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, fontFamily: 'var(--font-arabic)' }}>
        <Loader2 size={40} color="var(--color-primary-500)" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-body)' }}>نحسب خطتك...</p>
      </div>
    )
  }

  switch (step) {
    case 0: return <WelcomeStep onNext={goNext} onSkip={handleSkip} />
    case 1: return <GoalStep value={data.goal || ''} onSelect={(v) => update({ goal: v as any })} onNext={handleGoalNext} onBack={goBack} />
    case 2: return <ProfileStep data={data} update={update} onNext={goNext} onBack={goBack} />
    case 3: return <BodyStep data={data} update={update} onNext={goNext} onBack={goBack} />
    case 4: return <ActivityStep value={data.activity_level || ''} onSelect={(v) => update({ activity_level: v as any })} onNext={goNext} onBack={goBack} />
    case 5: return <DietStep value={data.diet_preference} onSelect={(v) => update({ diet_preference: v as any })} onNext={handleDietNext} onSkip={handleDietNext} onBack={goBack} />
    case 6: return <RevealStep data={data} targets={targets} onNext={goNext} onBack={goBack} />
    case 7: return <AccountStep onComplete={handleAccountCreate} onSkip={handleSkip} onBack={goBack} />
    default: return null
  }
}
