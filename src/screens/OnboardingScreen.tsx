import React, { useState } from 'react'
import { colors, fonts, spacing, radius } from '../theme/theme'

interface Props {
  onComplete: (data: { name: string; goal: string }) => void
  onSkipToLogin: () => void
}

export default function OnboardingScreen({ onComplete, onSkipToLogin }: Props) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('maintain')

  const slides = [
    { emoji: '🍽️', title: 'مرحباً بك في رشاقة', desc: 'رفيقك العربي الذكي للصحة والتغذية، مصمم خصيصاً لثقافتنا ومطبخنا.' },
    { emoji: '📸', title: 'صوّر وجبتك، اعرف سعراتها', desc: 'الذكاء الاصطناعي يحلل الأطباق العربية (منسف، كبسة، طاجين) في ثوانٍ.' },
    { emoji: '🤖', title: 'مدرب ذكي يفهمك', desc: 'اسأل عن أي شيء، وسيجيبك بلغة عربية دافئة، مع خطة تناسب حياتك.' },
  ]

  const handleNext = () => {
    if (step < slides.length - 1) setStep(step + 1)
    else setStep(slides.length) // Move to profile questions
  }

  const handleFinish = () => {
    if (name.trim().length < 2) return
    onComplete({ name: name.trim(), goal })
  }

  // Slides
  if (step < slides.length) {
    const slide = slides[step]
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: spacing.xl, background: 'linear-gradient(160deg, #0F0F1A, #1A1A2E, #0F0F1A)', fontFamily: fonts.regular }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15vh' }}>
          <div style={{ width: 140, height: 140, borderRadius: radius.full, background: 'linear-gradient(135deg, #FF6B9D, #FFA726)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72 }}>
            {slide.emoji}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
          <h1 style={{ color: colors.text, fontSize: fonts.sizes.xxl, marginBottom: spacing.md }}>{slide.title}</h1>
          <p style={{ color: colors.textMuted, fontSize: fonts.sizes.md, lineHeight: 1.7 }}>{slide.desc}</p>
        </div>
        <div>
          <button onClick={handleNext} style={{ width: '100%', padding: spacing.md, background: 'linear-gradient(90deg, #FF6B9D, #FFA726)', color: 'white', border: 'none', borderRadius: radius.md, fontFamily: fonts.regular, fontSize: fonts.sizes.lg, cursor: 'pointer', fontWeight: 'bold' }}>
            {step === slides.length - 1 ? 'يلا نبدأ 🚀' : 'التالي'}
          </button>
        </div>
      </div>
    )
  }

  // Profile questions
  return (
    <div style={{ minHeight: '100vh', padding: spacing.xl, background: colors.background, fontFamily: fonts.regular }}>
      <h1 style={{ color: colors.text, fontSize: fonts.sizes.xxl, marginBottom: spacing.sm, marginTop: '10vh' }}>عرفنا عنك أكثر</h1>
      <p style={{ color: colors.textMuted, marginBottom: spacing.xl }}>سنساعدك بخطة مخصصة لهدفك</p>

      <p style={{ color: colors.text, marginBottom: spacing.sm }}>ما اسمك؟</p>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً: أبو" style={{ width: '100%', padding: spacing.md, background: colors.surface, border: '1px solid #2A2A3E', borderRadius: radius.md, color: colors.text, fontFamily: fonts.regular, fontSize: fonts.sizes.md, marginBottom: spacing.xl, boxSizing: 'border-box' }} />

      <p style={{ color: colors.text, marginBottom: spacing.sm }}>ما هو هدفك الأساسي؟</p>
      {[
        { key: 'lose', label: 'إنقاص الوزن', emoji: '📉' },
        { key: 'maintain', label: 'الحفاظ على وزني', emoji: '⚖️' },
        { key: 'gain', label: 'زيادة الوزن', emoji: '📈' },
      ].map((g) => (
        <div key={g.key} onClick={() => setGoal(g.key)} style={{ padding: spacing.md, marginBottom: spacing.sm, background: goal === g.key ? '#FF6B9D22' : colors.surface, border: `2px solid ${goal === g.key ? colors.primary : '#2A2A3E'}`, borderRadius: radius.md, cursor: 'pointer', display: 'flex', alignItems: 'center', color: colors.text }}>
          <span style={{ fontSize: 24, marginLeft: spacing.sm }}>{g.emoji}</span>
          <span>{g.label}</span>
        </div>
      ))}

      <button onClick={handleFinish} style={{ width: '100%', padding: spacing.md, background: 'linear-gradient(90deg, #FF6B9D, #FFA726)', color: 'white', border: 'none', borderRadius: radius.md, fontFamily: fonts.regular, fontSize: fonts.sizes.lg, cursor: 'pointer', marginTop: spacing.xl, fontWeight: 'bold' }}>
        ابدأ رحلتي 🎉
      </button>

      <button onClick={onSkipToLogin} style={{ width: '100%', padding: spacing.md, background: 'transparent', color: colors.textMuted, border: 'none', fontFamily: fonts.regular, fontSize: fonts.sizes.sm, cursor: 'pointer', marginTop: spacing.md }}>
        لديّ حساب بالفعل
      </button>
    </div>
  )
}
