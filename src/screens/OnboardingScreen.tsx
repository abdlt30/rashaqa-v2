import React, { useState } from 'react'
import { Sparkles, Camera, Bot, ChevronLeft } from 'lucide-react'
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
    { icon: <Sparkles size={48} color="white" />, title: 'أهلاً بك في رشاقة', desc: 'رفيقك العربي الذكي للصحة والتغذية، صُمم خصيصاً لثقافتنا ومطبخنا.' },
    { icon: <Camera size={48} color="white" />, title: 'صوّر وجبتك', desc: 'الذكاء الاصطناعي يحلل الأطباق العربية (منسف، كبسة، طاجين) في ثوانٍ.' },
    { icon: <Bot size={48} color="white" />, title: 'مدرب ذكي يفهمك', desc: 'اسأل عن أي شيء، وسيجيبك بلغة عربية دافئة، مع خطة تناسب حياتك.' },
  ]

  const handleNext = () => {
    if (step < slides.length - 1) setStep(step + 1)
    else setStep(slides.length)
  }

  const handleFinish = () => {
    if (name.trim().length < 2) return
    onComplete({ name: name.trim(), goal })
  }

  if (step < slides.length) {
    const slide = slides[step]
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px', background: 'linear-gradient(160deg, #0F0F1A, #1A1A2E, #0F0F1A)', fontFamily: fonts.regular }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B9D, #FFA726)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {slide.icon}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '10%' }}>
          <h1 style={{ color: colors.text, fontSize: '28px', marginBottom: '12px', fontWeight: 'bold' }}>{slide.title}</h1>
          <p style={{ color: colors.textMuted, fontSize: '16px', lineHeight: 1.8, padding: '0 16px' }}>{slide.desc}</p>
        </div>
        <div>
          <button onClick={handleNext} style={{ width: '100%', padding: '16px', background: 'linear-gradient(90deg, #FF6B9D, #FFA726)', color: 'white', border: 'none', borderRadius: '12px', fontFamily: fonts.regular, fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>
            {step === slides.length - 1 ? 'يلا نبدأ 🚀' : 'التالي'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: '24px', background: colors.background, fontFamily: fonts.regular, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 style={{ color: colors.text, fontSize: '26px', marginBottom: '8px', fontWeight: 'bold' }}>لنخصص تجربتك</h1>
      <p style={{ color: colors.textMuted, marginBottom: '32px', fontSize: '15px' }}>سنساعدك بخطة مخصصة لهدفك</p>

      <p style={{ color: colors.text, marginBottom: '12px', fontSize: '15px' }}>ما اسمك؟</p>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً: أبو" style={{ width: '100%', padding: '16px', background: colors.surface, border: '1px solid #2A2A3E', borderRadius: '12px', color: colors.text, fontFamily: fonts.regular, fontSize: '16px', marginBottom: '32px', boxSizing: 'border-box', outline: 'none' }} />

      <p style={{ color: colors.text, marginBottom: '12px', fontSize: '15px' }}>ما هو هدفك الأساسي؟</p>
      {[
        { key: 'lose', label: 'إنقاص الوزن', emoji: '📉' },
        { key: 'maintain', label: 'الحفاظ على وزني', emoji: '⚖️' },
        { key: 'gain', label: 'زيادة الوزن', emoji: '📈' },
      ].map((g) => (
        <div key={g.key} onClick={() => setGoal(g.key)} style={{ padding: '16px', marginBottom: '12px', background: goal === g.key ? '#FF6B9D22' : colors.surface, border: `2px solid ${goal === g.key ? colors.primary : '#2A2A3E'}`, borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: colors.text }}>
          <span style={{ fontSize: '20px', marginLeft: '12px' }}>{g.emoji}</span>
          <span style={{ fontSize: '15px' }}>{g.label}</span>
        </div>
      ))}

      <button onClick={handleFinish} style={{ width: '100%', padding: '16px', background: 'linear-gradient(90deg, #FF6B9D, #FFA726)', color: 'white', border: 'none', borderRadius: '12px', fontFamily: fonts.regular, fontSize: '18px', cursor: 'pointer', marginTop: '24px', fontWeight: 'bold' }}>
        ابدأ رحلتي 🎉
      </button>

      <button onClick={onSkipToLogin} style={{ width: '100%', padding: '16px', background: 'transparent', color: colors.textMuted, border: 'none', fontFamily: fonts.regular, fontSize: '14px', cursor: 'pointer', marginTop: '16px' }}>
        لديّ حساب بالفعل
      </button>
    </div>
  )
}
