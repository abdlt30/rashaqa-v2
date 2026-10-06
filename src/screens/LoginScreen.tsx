import React, { useState } from 'react'
import { colors, fonts, spacing, radius } from '../theme/theme'

interface Props {
  onLogin: (email: string) => void
  onSkip: () => void
}

export default function LoginScreen({ onLogin, onSkip }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const handleSubmit = () => {
    if (email.trim() && password.length >= 6) {
      onLogin(email.trim())
    }
  }

  return (
    <div style={{ minHeight: '100vh', padding: spacing.xl, background: 'linear-gradient(160deg, #0F0F1A, #1A1A2E)', fontFamily: fonts.regular, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
        <div style={{ width: 90, height: 90, borderRadius: radius.lg, background: 'linear-gradient(135deg, #FF6B9D, #FFA726)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, margin: '0 auto 16px' }}>🍽️</div>
        <h1 style={{ color: colors.text, fontSize: fonts.sizes.xxl, margin: 0 }}>رشاقة</h1>
        <p style={{ color: colors.textMuted, marginTop: spacing.sm }}>احفظ تقدمك وبياناتك في السحابة</p>
      </div>

      <p style={{ color: colors.textMuted, marginBottom: spacing.sm }}>البريد الإلكتروني</p>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" style={{ width: '100%', padding: spacing.md, background: colors.surface, border: '1px solid #2A2A3E', borderRadius: radius.md, color: colors.text, fontFamily: fonts.regular, fontSize: fonts.sizes.md, marginBottom: spacing.md, boxSizing: 'border-box' }} />

      <p style={{ color: colors.textMuted, marginBottom: spacing.sm }}>كلمة المرور</p>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: spacing.md, background: colors.surface, border: '1px solid #2A2A3E', borderRadius: radius.md, color: colors.text, fontFamily: fonts.regular, fontSize: fonts.sizes.md, marginBottom: spacing.lg, boxSizing: 'border-box' }} />

      <button onClick={handleSubmit} style={{ width: '100%', padding: spacing.md, background: 'linear-gradient(90deg, #FF6B9D, #FFA726)', color: 'white', border: 'none', borderRadius: radius.md, fontFamily: fonts.regular, fontSize: fonts.sizes.lg, cursor: 'pointer', fontWeight: 'bold' }}>
        {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
      </button>

      <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} style={{ width: '100%', padding: spacing.md, background: 'transparent', color: colors.primary, border: 'none', fontFamily: fonts.regular, cursor: 'pointer', marginTop: spacing.sm }}>
        {mode === 'login' ? 'ليس لديك حساب؟ أنشئ واحداً' : 'لديك حساب؟ سجل الدخول'}
      </button>

      <button onClick={onSkip} style={{ width: '100%', padding: spacing.md, background: 'transparent', color: colors.textMuted, border: `1px solid #2A2A3E`, borderRadius: radius.md, fontFamily: fonts.regular, cursor: 'pointer', marginTop: spacing.lg }}>
        متابعة كضيف (بدون حساب)
      </button>
    </div>
  )
}
