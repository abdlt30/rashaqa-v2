import React from 'react';
import { AdProviderRoot } from './core/ads/AdContext';
import OnboardingFlow from './features/onboarding/OnboardingFlow';
import HomeScreen from './screens/HomeScreen';
import { useStore } from './store/useStore';

function AppContent() {
  const isOnboarded = useStore((s) => s.isOnboarded);

  if (!isOnboarded) {
    return <OnboardingFlow />;
  }

  // ✅ اختبار: عرض HomeScreen فقط، بدون Router أو BottomNav
  return <HomeScreen />;
}

function App() {
  return (
    <AdProviderRoot>
      <AppContent />
    </AdProviderRoot>
  );
}

export default App;
