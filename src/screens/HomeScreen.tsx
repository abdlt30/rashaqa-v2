import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { askAi } from '../services/aiService';

interface Meal {
  id?: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const userId = useStore((s) => s.userId);
  const meals = useStore((s) => s.meals);
  const waterCups = useStore((s) => s.waterCups);
  const targets = useStore((s) => s.targets);

  const fetchDailyData = useStore((s) => s.fetchDailyData);
  const addMeal = useStore((s) => s.addMeal);
  const setWaterCups = useStore((s) => s.setWaterCups);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) fetchDailyData();
  }, [userId, fetchDailyData]);

  const targetCalories = targets?.calories || user?.targetCalories || 2300;
  const remaining = Math.max(targetCalories - meals.reduce((s, m) => s + m.calories, 0), 0);

  const handleSuggest = async () => {
    setLoading(true);
    try {
      const res = await askAi('suggest', {
        body: { country: user?.country || 'MA', goal: user?.goal || 'maintain', remainingCalories: remaining },
      });
      if (res?.ok && res.data) await addMeal(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '16px', fontFamily: 'var(--font-arabic)', background: 'var(--color-bg-base)', minHeight: '100dvh' }}>
      {/* HEADER */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13, margin: 0 }}>مرحباً</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0' }}>{user?.name || 'صديقي'}</h1>
      </div>

      {/* KPI */}
      <div style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)', borderRadius: 16, padding: 20, textAlign: 'center', marginBottom: 16 }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13, margin: 0 }}>السعرات المتبقية</p>
        <h2 style={{ fontSize: 48, fontWeight: 700, margin: '8px 0' }}>{remaining}</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 12, margin: 0 }}>من {targetCalories}</p>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button onClick={handleSuggest} disabled={loading} style={{ flex: 1, padding: 14, background: 'var(--color-primary-500)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 600 }}>
          {loading ? 'جاري...' : 'ماذا آكل الآن؟'}
        </button>
        <button onClick={() => setWaterCups(waterCups + 1)} style={{ flex: 1, padding: 14, background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)', borderRadius: 12, fontWeight: 600 }}>
          ماء ({waterCups})
        </button>
      </div>

      {/* MEALS */}
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>وجبات اليوم ({meals.length})</h3>
        {meals.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 20 }}>لم تسجل أي وجبة بعد</p>
        ) : (
          meals.map((m, i) => (
            <div key={m.id || i} style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)', borderRadius: 12, padding: 12, marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{m.calories} سعرة</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
