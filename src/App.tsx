import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdProviderRoot } from './core/ads/AdContext'
import BottomNav from './components/BottomNav'
import OnboardingFlow from './features/onboarding/OnboardingFlow'
import HomeScreen from './screens/HomeScreen'
import WorkoutsScreen from './screens/WorkoutsScreen'
import ReportsScreen from './screens/ReportsScreen'
import ProfileScreen from './screens/ProfileScreen'
import VisionScreen from './screens/VisionScreen'
import PlansScreen from './screens/PlansScreen'
import { useStore } from './store/useStore'

// ✅ مكون منفصل لعرض الـ Onboarding
function OnboardingRoute() {
  const isOnboarded = useStore((s) => s.isOnboarded)
  
  // إذا كان المستخدم قد أكمل التسجيل، انتقل إلى الصفحة الرئيسية
  if (isOnboarded) {
    return <Navigate to="/" replace />
  }
  
  return <OnboardingFlow />
}

// ✅ مكون منفصل للتطبيق الرئيسي
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
      </Routes>
      <BottomNav />
    </div>
  )
}

// ✅ المكون الرئيسي: Router دائماً في الجذر
function App() {
  return (
    <AdProviderRoot>
      <HashRouter>
        <Routes>
          {/* مسار الـ Onboarding */}
          <Route path="/onboarding" element={<OnboardingRoute />} />
          
          {/* المسار الرئيسي (إذا لم يكن مسجلاً، يتم توجيهه للـ Onboarding) */}
          <Route 
            path="*" 
            element={
              <RequireOnboarding>
                <MainApp />
              </RequireOnboarding>
            } 
          />
        </Routes>
      </HashRouter>
    </AdProviderRoot>
  )
}

// ✅ مكون حماية: يتحقق من التسجيل قبل عرض التطبيق الرئيسي
function RequireOnboarding({ children }: { children: React.ReactNode }) {
  const isOnboarded = useStore((s) => s.isOnboarded)
  
  if (!isOnboarded) {
    return <Navigate to="/onboarding" replace />
  }
  
  return <>{children}</>
}

export default App
