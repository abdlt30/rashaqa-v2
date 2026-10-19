import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdProviderRoot } from './core/ads/AdContext';
import BottomNav from './components/BottomNav';
import OnboardingFlow from './features/onboarding/OnboardingFlow';
import HomeScreen from './screens/HomeScreen';
import WorkoutsScreen from './screens/WorkoutsScreen';
import ReportsScreen from './screens/ReportsScreen';
import ProfileScreen from './screens/ProfileScreen';
import VisionScreen from './screens/VisionScreen';
import PlansScreen from './screens/PlansScreen';
import LoginScreen from './screens/LoginScreen'; // تأكد من وجود هذا الملف
import { useStore } from './store/useStore';
import { supabase } from './lib/supabase';
import { Loader2 } from 'lucide-react';
import AICoachScreen from './screens/AICoachScreen';

// ✅ 1. التطبيق الرئيسي (الشاشات المحمية + BottomNav)
function MainApp() {
  return (
    <div style={{
      background: 'var(--color-bg-base)',
      minHeight: '100dvh',
      color: 'var(--color-text-primary)',
      fontFamily: 'var(--font-arabic)',
    }}>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/workouts" element={<WorkoutsScreen />} />
        <Route path="/reports" element={<ReportsScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/vision" element={<VisionScreen />} />
        <Route path="/premium" element={<PlansScreen />} />
        <Route path="/coach" element={<AICoachScreen />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

// ✅ 2. حارس المسارات (Route Guard)
function AppContent() {
  const isOnboarded = useStore((s) => s.isOnboarded);
  const session = useStore((s) => s.session);
  const isAuthLoading = useStore((s) => s.isAuthLoading);
  const setSession = useStore((s) => s.setSession);

  // الاستماع لتغيرات حالة المصادقة في Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  // 1. إذا كان التطبيق يتحقق من الجلسة، نعرض شاشة تحميل
  if (isAuthLoading) {
    return (
      <div style={{ display: 'flex', height: '100dvh', justifyContent: 'center', alignItems: 'center', background: 'var(--color-bg-base)' }}>
        <Loader2 size={40} className="animate-spin" color="var(--color-primary-500)" />
      </div>
    );
  }

  // 2. إذا لم يكن هناك جلسة (المستخدم غير مسجل)، نوجهه لشاشة تسجيل الدخول
  if (!session) {
    return <LoginScreen />;
  }

  // 3. إذا كان مسجلاً ولكن لم يكمل التعريف، نعرض شاشة التعريف
  if (!isOnboarded) {
    return <OnboardingFlow />;
  }

  // 4. إذا كان مسجلاً وأكمل التعريف، نعرض التطبيق الرئيسي
  return <MainApp />;
}

// ✅ 3. غلاف AdProvider والـ Router
function App() {
  return (
    <AdProviderRoot>
      <HashRouter>
        <Routes>
          {/* مسار منفصل لتسجيل الدخول (اختياري، ولكن مفيد إذا أردت التوجيه المباشر) */}
          <Route path="/login" element={<LoginScreen />} />
          {/* باقي التطبيق (الذي سيحتوي على الحارس) */}
          <Route path="*" element={<AppContent />} />
        </Routes>
      </HashRouter>
    </AdProviderRoot>
  );
}

export default App;
