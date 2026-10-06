import React, { useState } from 'react'
import { Sparkles, Camera, Bot } from 'lucide-react'
import { colors, fonts } from '../theme/theme'

interface Props {
  onComplete: (data: { name: string; goal: string }) => void
  onSkipToLogin: () => void
}

export default function OnboardingScreen({ onComplete, onSkipToLogin }: Props) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('maintain')

  const slides = [
    { Icon: Sparkles, title: 'أهلاً بك في رشاقة', desc: 'رفيقك العربي الذكي للصحة والتغذية، صُمم خصيصاً لثقافتنا ومطبخنا.', gradient: ['#FF6B9D', '#FFA726'] },
    { Icon: Camera, title: 'صوّر وجبتك', desc: 'الذكاء الاصطناعي يحلل الأطباق العربية (منسف، كبسة، طاجين) في ثوانٍ.', gradient: ['#4FC3F7', '#7C4DFF'] },
    { Icon: Bot, title: 'مدرب ذكي يفهمك', desc: 'اسأل عن أي شيء، وسيجيبك بلغة عربية دافئة، مع خطة تناسب حياتك.', gradient: ['#66BB6A', '#FFA726'] },
  ]

  const handleNext = () => {
    if (step < slides.length - 1) setStep(step + 1)
    else setStep(slides.length)
  }

  const handleFinish = () => {
    if (name.trim().length < 2) return
    onComplete({ name: name.trim(), goal })
  }

  // مرحلة العرض (Slides)
  if (step < slides.length) {
    const { Icon, title, desc, gradient } = slides[step]
    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 24px calc(32px + env(safe-area-inset-bottom))',
        background: 'linear-gradient(160deg, #0F0F1A 0%, #1A1A2E 50%, #0F0F1A 100%)',
        fontFamily: fonts.regular,
        boxSizing: 'border-box',
      }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
          {slides.map((_, i) => (
            <div key={i} style={{ width: i === step ? '24px' : '8px', height: '8px', borderRadius: '4px', background: i === step ? colors.primary : '#2A2A3E', transition: 'all 0.3s' }} />
          ))}
        </div>

        {/* Icon area - flex:1 for centering */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 20px 60px ${gradient[0]}44`,
            marginBottom: '40px',
          }}>
            <Icon size={64} color="white" strokeWidth={2.5} />
          </div>

          <h1 style={{ color: colors.text, fontSize: 'clamp(22px, 6vw, 28px)', marginBottom: '16px', fontWeight: 'bold', textAlign: 'center', margin: '0 0 16px 0' }}>
            {title}
          </h1>
          <p style={{ color: colors.textMuted, fontSize: 'clamp(14px, 4vw, 16px)', lineHeight: 1.7, textAlign: 'center', margin: 0, maxWidth: '340px' }}>
            {desc}
          </p>
        </div>

        {/* Bottom button */}
        <button onClick={handleNext} style={{
          width: '100%',
          padding: '18px',
          background: 'linear-gradient(90deg, #FF6B9D, #FFA726)',
          color: 'white',
          border: 'none',
          borderRadius: '16px',
          fontFamily: fonts.regular,
          fontSize: '17px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 10px 30px #FF6B9D44',
        }}>
          {step === slides.length - 1 ? 'يلا نبدأ 🚀' : 'التالي'}
        </button>
      </div>
    )
  }

  // مرحلة البيانات (Profile)
  return (
    <div style={{
      minHeight: '100dvh',
      padding: '32px 24px calc(32px + env(safe-area-inset-bottom))',
      background: colors.background,
      fontFamily: fonts.regular,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <h1 style={{ color: colors.text, fontSize: 'clamp(22px, 6vw, 26px)', fontWeight: 'bold', marginBottom: '8px', marginTop: 0 }}>
        لنخصص تجربتك
      </h1>
      <p style={{ color: colors.textMuted, marginBottom: '32px', fontSize: '15px', margin: '0 0 32px 0' }}>
        سنساعدك بخطة مخصصة لهدفك
      </p>

      <label style={{ color: colors.text, marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>ما اسمك؟</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="مثلاً: أبو"
        style={{
          width: '100%',
          padding: '16px',
          background: colors.surface,
          border: '1px solid #2A2A3E',
          borderRadius: '14px',
          color: colors.text,
          fontFamily: fonts.regular,
          fontSize: '16px',
          marginBottom: '28px',
          boxSizing: 'border-box',
          outline: 'none',
        }}
      />

      <label style={{ color: colors.text, marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>ما هو هدفك الأساسي؟</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { key: 'lose', label: 'إنقاص الوزن', emoji: '📉' },
          { key: 'maintain', label: 'الحفاظ على وزني', emoji: '⚖️' },
          { key: 'gain', label: 'زيادة الوزن', emoji: '📈' },
        ].map((g) => (
          <div
            key={g.key}
            onClick={() => setGoal(g.key)}
            style={{
              padding: '16px',
              background: goal === g.key ? '#FF6B9D22' : colors.surface,
              border: `2px solid ${goal === g.key ? colors.primary : '#2A2A3E'}`,
              borderRadius: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: colors.text,
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: '20px', marginLeft: '12px' }}>{g.emoji}</span>
            <span style={{ fontSize: '15px' }}>{g.label}</span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <button
        onClick={handleFinish}
        style={{
          width: '100%',
          padding: '18px',
          background: 'linear-gradient(90deg, #FF6B9D, #FFA726)',
          color: 'white',
          border: 'none',
          borderRadius: '16px',
          fontFamily: fonts.regular,
          fontSize: '17px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '24px',
          boxShadow: '0 10px 30px #FF6B9D44',
        }}
      >
        ابدأ رحلتي 🎉
      </button>

      <button
        onClick={onSkipToLogin}
        style={{
          width: '100%',
          padding: '14px',
          background: 'transparent',
          color: colors.textMuted,
          border: 'none',
          fontFamily: fonts.regular,
          fontSize: '14px',
          cursor: 'pointer',
          marginTop: '8px',
        }}
      >
        لديّ حساب بالفعل
      </button>
    </div>
  )
}
