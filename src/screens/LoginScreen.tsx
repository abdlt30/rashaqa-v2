import React, { useState } from 'react'
import { colors, fonts, spacing, radius } from '../theme/theme'

interface Props {
  onLogin: (
    email: string,
    password: string,
    mode: 'login' | 'signup'
  ) => Promise<{ success: boolean; error?: string }>
  onSkip: () => void
}

export default function LoginScreen({ onLogin, onSkip }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const validate = (): string | null => {
    const trimmed = email.trim()
    if (!trimmed) return 'الرجاء إدخال البريد الإلكتروني'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed))
      return 'صيغة البريد الإلكتروني غير صحيحة'
    if (password.length < 6) return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
    return null
  }

  const handleSubmit = async () => {
    setError('')
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      const result = await onLogin(email.trim(), password, mode)

      if (!result.success) {
        const errMsg = (result.error || '').toLowerCase()

        // ✅ معالجة ذكية للأخطاء الشائعة
        if (errMsg.includes('already registered') || errMsg.includes('user already')) {
          setError('هذا البريد مسجل مسبقاً — جرب تسجيل الدخول')
          // التحويل التلقائي لوضع تسجيل الدخول
          setTimeout(() => {
            setMode('login')
            setError('')
          }, 1500)
        } else if (errMsg.includes('invalid login') || errMsg.includes('invalid credentials')) {
          setError('البريد أو كلمة المرور غير صحيحة')
        } else if (errMsg.includes('rate limit')) {
          setError('تجاوزت الحد المسموح، انتظر دقيقة ثم حاول مجدداً')
        } else if (errMsg.includes('email not confirmed')) {
          setError('يجب تأكيد بريدك الإلكتروني أولاً')
        } else if (errMsg.includes('network')) {
          setError('تعذر الاتصال بالإنترنت')
        } else {
          setError(result.error || 'حدث خطأ غير متوقع، حاول مجدداً')
        }
      }
      // إذا نجح: onLogin سيتولى التنقل (لا حاجة لعمل شيء هنا)
    } catch (err: any) {
      setError('تعذر الاتصال بالخدمة، تحقق من الإنترنت')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
    setError('')
  }

  const isLogin = mode === 'login'

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: spacing.xl,
        background: 'linear-gradient(160deg, #0F0F1A, #1A1A2E)',
        fontFamily: fonts.regular,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: radius.lg,
            background: 'linear-gradient(135deg, #FF6B9D, #FFA726)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            margin: '0 auto 16px',
          }}
        >
          🍽️
        </div>
        <h1 style={{ color: colors.text, fontSize: fonts.sizes.xxl, margin: 0 }}>
          رشاقة
        </h1>
        <p style={{ color: colors.textMuted, marginTop: spacing.sm }}>
          {isLogin ? 'سجّل دخولك لمتابعة رحلتك' : 'احفظ تقدمك وبياناتك في السحابة'}
        </p>
      </div>

      {/* البريد الإلكتروني */}
      <p style={{ color: colors.textMuted, marginBottom: spacing.sm }}>
        البريد الإلكتروني
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          if (error) setError('')
        }}
        placeholder="example@mail.com"
        disabled={loading}
        style={{
          width: '100%',
          padding: spacing.md,
          background: colors.surface,
          border: `1px solid ${error && !email ? '#FF6B6B' : '#2A2A3E'}`,
          borderRadius: radius.md,
          color: colors.text,
          fontFamily: fonts.regular,
          fontSize: fonts.sizes.md,
          marginBottom: spacing.md,
          boxSizing: 'border-box',
          opacity: loading ? 0.6 : 1,
        }}
      />

      {/* كلمة المرور */}
      <p style={{ color: colors.textMuted, marginBottom: spacing.sm }}>
        كلمة المرور
      </p>
      <div style={{ position: 'relative', marginBottom: spacing.lg }}>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (error) setError('')
          }}
          placeholder="••••••••"
          disabled={loading}
          style={{
            width: '100%',
            padding: spacing.md,
            paddingLeft: 44,
            background: colors.surface,
            border: `1px solid ${
              error && password.length > 0 && password.length < 6 ? '#FF6B6B' : '#2A2A3E'
            }`,
            borderRadius: radius.md,
            color: colors.text,
            fontFamily: fonts.regular,
            fontSize: fonts.sizes.md,
            boxSizing: 'border-box',
            opacity: loading ? 0.6 : 1,
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            color: colors.textMuted,
            cursor: 'pointer',
            fontSize: 18,
          }}
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>

      {/* ✅ رسالة الخطأ */}
      {error && (
        <div
          style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            borderRadius: radius.md,
            padding: spacing.sm,
            marginBottom: spacing.md,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>⚠️</span>
          <span
            style={{
              color: '#FF8A8A',
              fontSize: fonts.sizes.sm,
              fontFamily: fonts.regular,
            }}
          >
            {error}
          </span>
        </div>
      )}

      {/* زر الإرسال */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%',
          padding: spacing.md,
          background: loading
            ? 'rgba(255, 107, 157, 0.5)'
            : 'linear-gradient(90deg, #FF6B9D, #FFA726)',
          color: 'white',
          border: 'none',
          borderRadius: radius.md,
          fontFamily: fonts.regular,
          fontSize: fonts.sizes.lg,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {loading ? (
          <>
            <span
              style={{
                display: 'inline-block',
                width: 16,
                height: 16,
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            جاري المعالجة...
          </>
        ) : isLogin ? (
          'تسجيل الدخول'
        ) : (
          'إنشاء حساب'
        )}
      </button>

      {/* تبديل الوضع */}
      <button
        onClick={toggleMode}
        disabled={loading}
        style={{
          width: '100%',
          padding: spacing.md,
          background: 'transparent',
          color: colors.primary,
          border: 'none',
          fontFamily: fonts.regular,
          cursor: loading ? 'not-allowed' : 'pointer',
          marginTop: spacing.sm,
          opacity: loading ? 0.5 : 1,
        }}
      >
        {isLogin ? 'ليس لديك حساب؟ أنشئ واحداً' : 'لديك حساب؟ سجل الدخول'}
      </button>

      {/* متابعة كضيف */}
      <button
        onClick={onSkip}
        disabled={loading}
        style={{
          width: '100%',
          padding: spacing.md,
          background: 'transparent',
          color: colors.textMuted,
          border: `1px solid #2A2A3E`,
          borderRadius: radius.md,
          fontFamily: fonts.regular,
          cursor: loading ? 'not-allowed' : 'pointer',
          marginTop: spacing.lg,
          opacity: loading ? 0.5 : 1,
        }}
      >
        متابعة كضيف (بدون حساب)
      </button>

      {/* CSS animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
