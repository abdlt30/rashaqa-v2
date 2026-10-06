import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import OnboardingScreen from './screens/OnboardingScreen'
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import WorkoutsScreen from './screens/WorkoutsScreen'
import ReportsScreen from './screens/ReportsScreen'
import ProfileScreen from './screens/ProfileScreen'
import { colors, fonts } from './theme/theme'
import { useStore } from './store/useStore'

function App() {
  const { isOnboarded, isLoggedIn, completeOnboarding, login, skipLogin } = useStore()

  // المرحلة 1: شاشة الاستقبال (Onboarding) - تُعرض أول مرة فقط
  if (!isOnboarded) {
    return (
      <BrowserRouter>
        <OnboardingScreen onComplete={completeOnboarding} onSkipToLogin={() => login('guest@local')} />
      </BrowserRouter>
    )
  }

  // المرحلة 2: شاشة تسجيل الدخول (اختيارية - يمكن تخطيها)
  // نعرضها فقط إذا لم يسجل المستخدم دخوله ولم يتخطاها
  // ملاحظة: حالياً بعد Onboarding نذهب للرئيسية مباشرة. سنضيف التخطي لاحقاً.

  // المرحلة 3: التطبيق الرئيسي
  return (
    <BrowserRouter>
      <div style={{ background: colors.background, minHeight: '100vh', color: colors.text, fontFamily: fonts.regular }}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/workouts" element={<WorkoutsScreen />} />
          <Route path="/reports" element={<ReportsScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default App
