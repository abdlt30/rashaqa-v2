import React from 'react';
import { useStore } from '../store/useStore';

export default function HomeScreen() {
  const user = useStore((s) => s.user);

  return (
    <div style={{ padding: 50, textAlign: 'center', fontFamily: 'var(--font-arabic)' }}>
      <h1>مرحباً {user?.name || 'صديقي'}!</h1>
      <p>التطبيق يعمل بشكل سليم.</p>
      <p>السعرات المستهدفة: {user?.targetCalories || 'غير محدد'}</p>
    </div>
  );
}
