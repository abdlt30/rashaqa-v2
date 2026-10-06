import React, { useState } from 'react'
import { Sparkles, Camera, Bot, TrendingDown, Scale, TrendingUp } from 'lucide-react'

interface Props {
  onComplete: (data: { name: string; goal: string }) => void
  onSkipToLogin: () => void
}

const slides = [
  {
    Icon: Sparkles,
    title: 'أهلاً بك في رشاقة',
    desc: 'رفيقك العربي الذكي للصحة والتغذية. صُمم خصيصاً لثقافتنا ومطبخنا.',
  },
  {
    Icon: Camera,
    title: 'صوّر وجبتك',
    desc: 'الذكاء الاصطناعي يحلل الأطباق العربية (منسف، كبسة، طاجين) في ثوانٍ.',
  },
  {
    Icon: Bot,
    title: 'مدرب ذكي يفهمك',
    desc: 'اسأل عن أي شيء، وسيجيبك بلغة عربية دافئة، مع خطة تناسب حياتك.',
  },
]

const goals = [
  { key: 'lose', label: 'إنقاص الوزن', sub: 'حرق دهون بشكل صحي', Icon: TrendingDown },
  { key: 'maintain', label: 'الحفاظ على وزني', sub: 'نمط حياة متوازن', Icon: Scale },
  { key: 'gain', label: 'زيادة الوزن', sub: 'بناء عضلات صحية', Icon: TrendingUp },
]

export default function OnboardingScreen({ onComplete, onSkipToLogin }: Props) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('maintain')

  const handleNext = () => {
    if (step < slides.length - 1) setStep(step + 1)
    else setStep(slides.length)
  }

  const handleFinish = () => {
    if (name.trim().length < 2) return
    onComplete({ name: name.trim(), goal })
  }

  // ============ SLIDES ============
  if (step < slides.length) {
    const { Icon, title, desc } = slides[step]
    const progress = ((step + 1) / slides.length) * 100

    return (
      <div
        style={{
          minHeight: '100dvh',
          background: 'var(--color-bg-base)',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'var(--font-arabic)',
          overflow: 'hidden',
        }}
      >
        {/* Progress Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'var(--color-border-subtle)',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'var(--color-primary-500)',
              transition: 'width 400ms ease',
            }}
          />
        </div>

        {/* Skip */}
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => onComplete({ name: 'ضيف', goal: 'maintain' })}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: 'var(--fs-body-sm)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 500,
            }}
          >
            تخطى
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 32px',
            gap: '32px',
          }}
        >
          <div
            style={{
              width: '128px',
              height: '128px',
              borderRadius: 'var(--radius-2xl)',
              background: 'var(--color-surface-1)',
              border: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={56} color="var(--color-primary-500)" strokeWidth={1.8} />
          </div>

          <div style={{ textAlign: 'center', maxWidth: '340px' }}>
            <h1
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--fs-h1)',
                fontWeight: 700,
                margin: '0 0 16px 0',
                lineHeight: 1.3,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--fs-body)',
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {desc}
            </p>
          </div>
        </div>

        {/* Bottom Button */}
        <div style={{ padding: '24px 24px calc(32px + env(safe-area-inset-bottom))' }}>
          <button
            onClick={handleNext}
            style={{
              width: '100%',
              padding: '18px',
              background: 'var(--color-primary-500)',
              color: 'var(--color-text-on-primary)',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              fontSize: 'var(--fs-body-lg)',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {step === slides.length - 1 ? 'يلا نبدأ' : 'التالي'}
          </button>
        </div>
      </div>
    )
  }

  // ============ GOAL SELECTION ============
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--color-bg-base)',
        padding: '24px',
        paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
        fontFamily: 'var(--font-arabic)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ marginTop: '20px', marginBottom: '32px' }}>
        <h1
          style={{
            color: 'var(--color-text-primary)',
            fontSize: 'var(--fs-h1)',
            fontWeight: 700,
            margin: '0 0 8px 0',
          }}
        >
          لنخصص تجربتك
        </h1>
        <p
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--fs-body)',
            margin: 0,
          }}
        >
          سنساعدك بخطة مخصصة لهدفك
        </p>
      </div>

      {/* Name Input */}
      <div style={{ marginBottom: '32px' }}>
        <label
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--fs-body-sm)',
            fontWeight: 500,
            marginBottom: '10px',
            display: 'block',
          }}
        >
          ما اسمك؟
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثلاً: أبو محمد"
          style={{
            width: '100%',
            padding: '16px 18px',
            background: 'var(--color-surface-1)',
            border: `1.5px solid ${name ? 'var(--color-primary-500)' : 'var(--color-border-subtle)'}`,
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-primary)',
            fontSize: 'var(--fs-body)',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            outline: 'none',
          }}
        />
      </div>

      {/* Goal Selection */}
      <label
        style={{
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--fs-body-sm)',
          fontWeight: 500,
          marginBottom: '12px',
          display: 'block',
        }}
      >
        ما هو هدفك الأساسي؟
      </label>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {goals.map((g) => {
          const active = goal === g.key
          return (
            <button
              key={g.key}
              onClick={() => setGoal(g.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: 'var(--color-surface-1)',
                border: `1.5px solid ${active ? 'var(--color-primary-500)' : 'var(--color-border-subtle)'}`,
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                textAlign: 'right',
                fontFamily: 'inherit',
                transition: 'all 200ms ease',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: active ? 'var(--color-primary-500)' : 'var(--color-surface-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <g.Icon
                  size={24}
                  color={active ? 'var(--color-text-on-primary)' : 'var(--color-text-muted)'}
                  strokeWidth={2}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--fs-body)',
                    fontWeight: 600,
                    marginBottom: '2px',
                  }}
                >
                  {g.label}
                </div>
                <div
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: 'var(--fs-body-sm)',
                  }}
                >
                  {g.sub}
                </div>
              </div>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: 'var(--radius-full)',
                  border: `2px solid ${active ? 'var(--color-primary-500)' : 'var(--color-border-strong)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {active && (
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-primary-500)',
                    }}
                  />
                )}
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
          padding: '18px',
          background:
            name.trim().length >= 2 ? 'var(--color-primary-500)' : 'var(--color-surface-2)',
          color:
            name.trim().length >= 2 ? 'var(--color-text-on-primary)' : 'var(--color-text-muted)',
          border: 'none',
          borderRadius: 'var(--radius-lg)',
          fontSize: 'var(--fs-body-lg)',
          fontWeight: 600,
          cursor: name.trim().length >= 2 ? 'pointer' : 'not-allowed',
          fontFamily: 'inherit',
          marginTop: '16px',
          transition: 'all 300ms ease',
        }}
      >
        ابدأ رحلتي
      </button>

      <button
        onClick={onSkipToLogin}
        style={{
          width: '100%',
          padding: '14px',
          background: 'transparent',
          color: 'var(--color-text-muted)',
          border: 'none',
          fontSize: 'var(--fs-body-sm)',
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
