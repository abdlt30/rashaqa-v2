import React, { useState } from 'react';
import { colors, fonts, spacing, radius } from '../theme/theme';
import { useStore } from '../store/useStore'; // استيراد المتجر
import { useNavigate } from 'react-router-dom'; // للتوجيه

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  // جلب الدوال من المتجر
  const signIn = useStore((s) => s.signIn);
  const signUp = useStore((s) => s.signUp);
  const skipLogin = useStore((s) => s.skipLogin);

  const validate = (): string | null => {
    const trimmed = email.trim();
    if (!trimmed) return 'الرجاء إدخال البريد الإلكتروني';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'صيغة البريد الإلكتروني غير صحيحة';
    if (password.length < 6) return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    return null;
  };

  const handleSubmit = async () => {
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const result = mode === 'login' 
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password);

      if (!result.success) {
        const errMsg = (result.error || '').toLowerCase();
        if (errMsg.includes('already registered') || errMsg.includes('user already')) {
          setError('هذا البريد مسجل مسبقاً — جرب تسجيل الدخول');
          setTimeout(() => { setMode('login'); setError(''); }, 1500);
        } else if (errMsg.includes('invalid login') || errMsg.includes('invalid credentials')) {
          setError('البريد أو كلمة المرور غير صحيحة');
        } else if (errMsg.includes('rate limit')) {
          setError('تجاوزت الحد المسموح، انتظر دقيقة ثم حاول مجدداً');
        } else if (errMsg.includes('email not confirmed')) {
          setError('يجب تأكيد بريدك الإلكتروني أولاً');
        } else if (errMsg.includes('network')) {
          setError('تعذر الاتصال بالإنترنت');
        } else {
          setError(result.error || 'حدث خطأ غير متوقع، حاول مجدداً');
        }
      } else if (mode === 'signup') {
        // إذا نجح التسجيل، نطلب منه تسجيل الدخول (حسب إعدادات Supabase)
        setMode('login');
        setError('تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول.');
      }
    } catch (err: any) {
      setError('تعذر الاتصال بالخدمة، تحقق من الإنترنت');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    skipLogin();
    navigate('/'); // التوجيه للرئيسية
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
  };

  const isLogin = mode === 'login';

  // ... (نفس كود الـ JSX السابق الخاص بك تماماً، لا تغيير فيه) ...
  return (
    <div style={{ minHeight: '100vh', padding: spacing.xl, background: 'linear-gradient(160deg, #0F0F1A, #1A1A2E)', fontFamily: fonts.regular, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* ... أبقِ كل أكواد التصميم (JSX) كما هي ... */}
        
        {/* ملاحظة: تأكد من تغيير زر "متابعة كضيف" لاستدعاء handleSkip بدلاً من onSkip */}
        <button onClick={handleSkip} disabled={loading} style={{ width: '100%', padding: spacing.md, background: 'transparent', color: colors.textMuted, border: `1px solid #2A2A3E`, borderRadius: radius.md, fontFamily: fonts.regular, cursor: loading ? 'not-allowed' : 'pointer', marginTop: spacing.lg, opacity: loading ? 0.5 : 1 }}>
          متابعة كضيف (بدون حساب)
        </button>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
