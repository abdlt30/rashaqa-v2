import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { AdProviderRoot } from './core/ads/AdContext'
import BottomNav from './components/BottomNav'
import OnboardingFlow from './features/onboarding/OnboardingFlow'
import HomeScreen from './screens/HomeScreen'
import WorkoutsScreen from './screens/WorkoutsScreen'
import ReportsScreen from './screens/ReportsScreen'
import ProfileScreen from './screens/ProfileScreen'
import { useStore } from './store/useStore'

function AppContent() {
  const isOnboarded = useStore((s) => s.isOnboarded)

  if (!isOnboarded) {
    return <OnboardingFlow />
  }

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
        </Routes>
        <BottomNav />
      </div>
    </HashRouter>
  )
}

function App() {
  return (
    <AdProviderRoot>
      <AppContent />
    </AdProviderRoot>
  )
}

export default App
