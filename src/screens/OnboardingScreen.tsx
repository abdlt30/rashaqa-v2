import React, { useState } from 'react'
import { Sparkles, Camera, Bot, TrendingDown, Scale, TrendingUp, ChevronLeft } from 'lucide-react'

interface Props {
  onComplete: (data: { name: string; goal: string }) => void
  onSkipToLogin: () => void
}

const COLORS = {
  bg: '#0A0A14',
  card: '#15152A',
  cardActive: '#1F1F3D',
  border: '#252540',
  text: '#FFFFFF',
  muted: '#8B8BA7',
  pink: '#FF6B9D',
  orange: '#FFA726',
  blue: '#4FC3F7',
  purple: '#7C4DFF',
  green: '#4CAF50',
}

export default function OnboardingScreen({ onComplete, onSkipToLogin }: Props) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('maintain')

  const slides = [
    { Icon: Sparkles, title: 'أهلاً بك في رشاقة', desc: 'رفيقك العربي الذكي للصحة والتغذية. صُمم خصيصاً لثقافتنا ومطبخنا.', color: COLORS.pink, color2: COLORS.orange },
    { Icon: Camera, title: 'صوّر وجبتك', desc: 'الذكاء الاصطناعي يحلل الأطباق العربية (منسف، كبسة، طاجين) في ثوانٍ.', color: COLORS.blue, color2: COLORS.purple },
    { Icon: Bot, title: 'مدرب ذكي يفهمك', desc: 'اسأل عن أي شيء، وسيجيبك بلغة عربية دافئة، مع خطة تناسب حياتك.', color: COLORS.green, color2: COLORS.orange },
  ]

  const goalOptions = [
    { key: 'lose', label: 'إنقاص الوزن', sub: 'حرق دهون بشكل صحي', Icon: TrendingDown, color: COLORS.pink },
    { key: 'maintain', label: 'الحفاظ على وزني', sub: 'نمط حياة متوازن', Icon: Scale, color: COLORS.blue },
    { key: 'gain', label: 'زيادة الوزن', sub: 'بناء عضلات صحية', Icon: TrendingUp, color: COLORS.green },
  ]

  const handleNext = () => {
    if (step < slides.length - 1) setStep(step + 1)
    else setStep(slides.length)
  }

  const handleFinish = () => {
    if (name.trim().length < 2) return
    onComplete({ name: name.trim(), goal })
  }

  // ============ Slides ============
  if (step < slides.length) {
    const { Icon, title, desc, color, color2 } = slides[step]
    const progress = ((step + 1) / slides.length) * 100

    return (
      <div style={{ position: 'relative', minHeight: '100dvh', background: `radial-gradient(ellipse at top, ${color}22 0%, ${COLORS.bg} 50%)`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Progress Bar - thin line at top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#1A1A2E' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: `linear-gradient(90deg, ${color}, ${color2})`, transition: 'width 0.4s ease' }} />
        </div>

        {/* Skip Button */}
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => onComplete({ name: 'ضيف', goal: 'maintain' })}
            style={{ background: 'transparent', border: 'none', color: COLORS.muted, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            تخطى
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', gap: '32px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: `radial-gradient(circle, ${color}44, transparent 70%)`, filter: 'blur(30px)' }} />
            <div style={{ position: 'relative', width: '160px', height: '160px', borderRadius: '48px', background: `linear-gradient(135deg, ${color}, ${color2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 24px 60px ${color}55, inset 0 2px 0 rgba(255,255,255,0.3)` }}>
              <Icon size={72} color="white" strokeWidth={1.8} />
            </div>
          </div>

          <div style={{ textAlign: 'center', maxWidth: '340px' }}>
            <h1 style={{ color: COLORS.text, fontSize: '32px', fontWeight: 800, lineHeight: 1.3, margin: '0 0 16px 0', letterSpacing: '-0.5px' }}>
              {title}
            </h1>
            <p style={{ color: COLORS.muted, fontSize: '16px', lineHeight: 1.7, margin: 0 }}>
              {desc}
            </p>
          </div>
        </div>

        {/* Bottom Action */}
        <div style={{ padding: '24px 24px calc(32px + env(safe-area-inset-bottom))' }}>
          <button onClick={handleNext} style={{
            width: '100%',
            padding: '20px',
            background: `linear-gradient(90deg, ${COLORS.pink}, ${COLORS.orange})`,
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontSize: '17px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: `0 12px 40px ${COLORS.pink}66`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}>
            {step === slides.length - 1 ? 'يلا نبدأ 🚀' : 'التالي'}
          </button>
        </div>
      </div>
    )
  }

  // ============ Goal Selection ============
  return (
    <div style={{ minHeight: '100dvh', background: COLORS.bg, padding: '24px', paddingBottom: 'calc(24px + env(safe-area-inset-bottom))', fontFamily: 'inherit', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginTop: '20px', marginBottom: '32px' }}>
        <button onClick={() => setStep(slides.length - 1)} style={{ background: 'transparent', border: 'none', color: COLORS.muted, padding: 0, cursor: 'pointer', marginBottom: '16px', fontFamily: 'inherit' }}>
          <ChevronLeft size={24} color={COLORS.muted} />
        </button>
        <h1 style={{ color: COLORS.text, fontSize: '30px', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
          لنخصص تجربتك
        </h1>
        <p style={{ color: COLORS.muted, fontSize: '15px', margin: 0 }}>
          سنساعدك بخطة مخصصة لهدفك
        </p>
      </div>

      {/* Name Input */}
      <div style={{ marginBottom: '32px' }}>
        <label style={{ color: COLORS.text, fontSize: '14px', fontWeight: 600, marginBottom: '10px', display: 'block' }}>ما اسمك؟</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثلاً: أبو محمد"
          style={{
            width: '100%',
            padding: '18px 20px',
            background: COLORS.card,
            border: `1.5px solid ${name ? COLORS.pink : COLORS.border}`,
            borderRadius: '16px',
            color: COLORS.text,
            fontSize: '16px',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
        />
      </div>

      {/* Goal Selection - Cards with icons */}
      <label style={{ color: COLORS.text, fontSize: '14px', fontWeight: 600, marginBottom: '12px', display: 'block' }}>ما هو هدفك الأساسي؟</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {goalOptions.map((g) => {
          const active = goal === g.key
          return (
            <button
              key={g.key}
              onClick={() => setGoal(g.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '18px',
                background: active ? COLORS.cardActive : COLORS.card,
                border: `1.5px solid ${active ? g.color : COLORS.border}`,
                borderRadius: '18px',
                cursor: 'pointer',
                textAlign: 'right',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
                boxShadow: active ? `0 8px 24px ${g.color}33` : 'none',
              }}
            >
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: active ? g.color : COLORS.border, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <g.Icon size={26} color="white" strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: COLORS.text, fontSize: '16px', fontWeight: 700, marginBottom: '2px' }}>{g.label}</div>
                <div style={{ color: COLORS.muted, fontSize: '13px' }}>{g.sub}</div>
              </div>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${active ? g.color : COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {active && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: g.color }} />}
              </div>
            </button>
          )
        })}
      </div>

      <div style={{ flex: 1, minHeight: '24px' }} />

      <button
        onClick={handleFinish}
        disabled={name.trim().length < 2}
        style={{
          width: '100%',
          padding: '20px',
          background: name.trim().length >= 2 ? `linear-gradient(90deg, ${COLORS.pink}, ${COLORS.orange})` : COLORS.border,
          color: name.trim().length >= 2 ? 'white' : COLORS.muted,
          border: 'none',
          borderRadius: '20px',
          fontSize: '17px',
          fontWeight: 700,
          cursor: name.trim().length >= 2 ? 'pointer' : 'not-allowed',
          fontFamily: 'inherit',
          boxShadow: name.trim().length >= 2 ? `0 12px 40px ${COLORS.pink}66` : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        ابدأ رحلتي 🎉
      </button>

      <button
        onClick={onSkipToLogin}
        style={{
          width: '100%',
          padding: '16px',
          background: 'transparent',
          color: COLORS.muted,
          border: 'none',
          fontSize: '14px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          marginTop: '8px',
        }}
      >
        لديّ حساب بالفعل
      </button>
    </div>
  )
}
