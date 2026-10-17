import React from 'react';
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
import { useStore } from './store/useStore';

// ✅ 1. مكون رئيسي: يقرر ماذا يعرض بناءً على isOnboarded
function Root() {
  const isOnboarded = useStore((s) => s.isOnboarded);

  // إذا لم يكمل التسجيل، اعرض Onboarding فقط
  if (!isOnboarded) {
    return <OnboardingFlow />;
  }

  // إذا أكمل التسجيل، اعرض التطبيق الرئيسي مع التوجيه
  return (
    <HashRouter>
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
        </Routes>
        <BottomNav />
      </div>
    </HashRouter>
  );
}

// ✅ 2. المكون الرئيسي: يغلف كل شيء بـ AdProviderRoot
function App() {
  return (
    <AdProviderRoot>
      <Root />
    </AdProviderRoot>
  );
}

export default App;
