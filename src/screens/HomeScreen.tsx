import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { askAi } from '../services/aiService';
import MacroCard from '../components/home/MacroCard';
import MealList from '../components/home/MealList';
import { Droplet, Sparkles, Loader2 } from 'lucide-react'; // استخدام الأيقونات

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

  // Business Logic: يجب أن ينتقل هذا لاحقاً إلى المتجر أو Helper
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
    <div style={{ 
      padding: '20px', 
      fontFamily: 'var(--font-arabic)', 
      background: 'var(--color-bg-base)', 
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* HEADER */}
      <header>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, margin: 0 }}>مرحباً بك مجدداً</p>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '4px 0' }}>
          {user?.name || 'صديقي'}
        </h1>
      </header>

      {/* KPI CARD (مكون مستقل) */}
      <MacroCard remaining={remaining} targetCalories={targetCalories} />

      {/* CTA (أزرار الإجراءات) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <button 
          onClick={handleSuggest} 
          disabled={loading} 
          style={{ 
            padding: '16px', 
            background: 'var(--color-primary-500)', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 12, 
            fontWeight: 600,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {loading ? 'جاري التفكير...' : 'ماذا آكل؟'}
        </button>
        
        <button 
          onClick={() => setWaterCups(waterCups + 1)} 
          style={{ 
            padding: '16px', 
            background: 'var(--color-surface-1)', 
            border: '1px solid var(--color-border-subtle)', 
            borderRadius: 12, 
            fontWeight: 600,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            color: 'var(--color-primary-500)'
          }}
        >
          <Droplet size={18} />
          ماء ({waterCups})
        </button>
      </div>

      {/* MEALS LIST (مكون مستقل) */}
      <MealList meals={meals} />

    </div>
  );
}
