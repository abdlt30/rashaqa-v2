import React, { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp, Flame, Droplets, Dumbbell, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';

const C = {
  bg: 'var(--color-bg-base, #FAF7F0)',
  card: 'var(--color-bg-card, #FFFFFF)',
  primary: 'var(--color-primary, #1F5B4A)',
  primarySoft: 'var(--color-primary-soft, #E8F3EE)',
  text: 'var(--color-text-primary, #1A1A1A)',
  textMuted: 'var(--color-text-muted, #6B6B6B)',
  border: 'var(--color-border, #E5DFD0)',
  amber: '#E8A33D',
  blue: '#4A90E2',
};

const getLast7Days = () => {
  const days = [];
  const dayNames = ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({ date: d.toISOString().split('T')[0], label: dayNames[d.getDay()] });
  }
  return days;
};

export default function ReportsScreen() {
  const userId = useStore((s) => s.userId);
  const user = useStore((s) => s.user);
  const targets = useStore((s) => s.targets);

  const [loading, setLoading] = useState(true);
  const [weeklyCalories, setWeeklyCalories] = useState<number[]>(Array(7).fill(0));
  const [macros, setMacros] = useState({ protein: 35, carbs: 45, fat: 20 });
  const [totalTodayCalories, setTotalTodayCalories] = useState(0);
  const [weightData, setWeightData] = useState({ current: 0, target: 0, start: 0 });
  
  // ✅ 1. حالات جديدة للإنجازات
  const [achievements, setAchievements] = useState({
    streak: 0,
    waterLiters: 0,
    weeklyWorkouts: 0,
  });

  useEffect(() => {
    const fetchReportData = async () => {
      if (!userId) return;
      setLoading(true);

      try {
        const days = getLast7Days();
        const today = days[6].date;

        // 1. جلب الوجبات لآخر 7 أيام
        const { data: foodLogs } = await supabase
          .from('food_logs')
          .select('calories, protein, carbs, fat, created_at')
          .eq('user_id', userId)
          .gte('created_at', days[0].date);

        const calMap: Record<string, number> = {};
        days.forEach(d => calMap[d.date] = 0);
        
        let todayProtein = 0, todayCarbs = 0, todayFat = 0, todayCals = 0;

        foodLogs?.forEach(log => {
          const logDate = log.created_at.split('T')[0];
          if (calMap[logDate] !== undefined) calMap[logDate] += log.calories;
          if (logDate === today) {
            todayProtein += log.protein || 0;
            todayCarbs += log.carbs || 0;
            todayFat += log.fat || 0;
            todayCals += log.calories || 0;
          }
        });

        setWeeklyCalories(days.map(d => calMap[d.date]));
        setTotalTodayCalories(todayCals);

        const totalMacros = todayProtein + todayCarbs + todayFat;
        if (totalMacros > 0) {
          setMacros({
            protein: Math.round((todayProtein / totalMacros) * 100),
            carbs: Math.round((todayCarbs / totalMacros) * 100),
            fat: Math.round((todayFat / totalMacros) * 100),
          });
        }

        // 2. جلب بيانات الوزن
        const { data: weightLogs } = await supabase
          .from('weight_logs')
          .select('weight_kg, logged_at')
          .eq('user_id', userId)
          .order('logged_at', { ascending: true });

        if (weightLogs && weightLogs.length > 0) {
          setWeightData({
            start: weightLogs[0].weight_kg,
            current: weightLogs[weightLogs.length - 1].weight_kg,
            target: user?.target_weight_kg || weightLogs[weightLogs.length - 1].weight_kg,
          });
        } else {
          setWeightData({
            start: user?.weight_kg || 70,
            current: user?.weight_kg || 70,
            target: user?.target_weight_kg || 70,
          });
        }

        // ✅ 3. جلب الإنجازات (السلسلة، الماء، التمارين)
        const { data: streakData } = await supabase
          .from('streaks')
          .select('current_streak')
          .eq('user_id', userId)
          .single();

        const { data: waterData } = await supabase
          .from('water_logs')
          .select('amount_ml')
          .eq('user_id', userId)
          .gte('logged_at', today);

        const { data: workoutData } = await supabase
          .from('daily_progress')
          .select('id')
          .eq('user_id', userId)
          .gte('created_at', days[0].date);

        const totalWater = waterData?.reduce((sum, w) => sum + w.amount_ml, 0) || 0;

        setAchievements({
          streak: streakData?.current_streak || 1,
          waterLiters: totalWater / 1000,
          weeklyWorkouts: workoutData?.length || 0,
        });

      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [userId, user]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg }}>
        <Loader2 size={40} color={C.primary} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const maxCalories = Math.max(...weeklyCalories, targets?.calories || 2000);
  const weeklyPercentages = weeklyCalories.map(cal => Math.round((cal / maxCalories) * 100));
  const totalWeightChange = weightData.start - weightData.current;
  const weightProgressPct = weightData.start === weightData.target ? 100 : 
    Math.min(100, Math.max(0, Math.round(((weightData.start - weightData.current) / (weightData.start - weightData.target)) * 100)));

  return (
    <div style={{ minHeight: '100vh', background: C.bg, paddingBottom: 100, direction: 'rtl', fontFamily: 'var(--font-arabic, system-ui)' }}>
      <header style={{ padding: '28px 20px 16px' }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: C.text, margin: 0 }}>التقارير</h1>
        <p style={{ fontSize: 14, color: C.textMuted, margin: '4px 0 0' }}>تقدمك خلال آخر 7 أيام</p>
      </header>

      {/* Calories Bar Chart */}
      <section style={{ padding: '0 20px', marginBottom: 20 }}>
        <div style={{ background: C.card, borderRadius: 24, padding: 20, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontWeight: 700, color: C.text, fontSize: 16, margin: 0 }}>السعرات اليومية</h2>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.primary, background: C.primarySoft, padding: '4px 10px', borderRadius: 999 }}>
              الهدف {targets?.calories || 2000} سعرة
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, height: 140 }}>
            {weeklyPercentages.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%' }}>
                <div style={{ width: '100%', flex: 1, background: '#F0EDE4', borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${val}%`, background: C.primary, borderRadius: '8px 8px 0 0', transition: 'height 0.5s ease' }} />
                </div>
                <span style={{ fontSize: 10, color: C.textMuted }}>{getLast7Days()[i].label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Macro Donut */}
      <section style={{ padding: '0 20px', marginBottom: 20 }}>
        <div style={{ background: C.card, borderRadius: 24, padding: 20, border: `1px solid ${C.border}` }}>
          <h2 style={{ fontWeight: 700, color: C.text, fontSize: 16, margin: '0 0 16px' }}>توزيع المغذيات (اليوم)</h2>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{ position: 'relative', width: 160, height: 160 }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#F0EDE4" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke={C.primary} strokeWidth="3" strokeDasharray={`${macros.protein} ${100 - macros.protein}`} strokeDashoffset="0" strokeLinecap="round" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke={C.amber} strokeWidth="3" strokeDasharray={`${macros.carbs} ${100 - macros.carbs}`} strokeDashoffset={-macros.protein} strokeLinecap="round" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke={C.blue} strokeWidth="3" strokeDasharray={`${macros.fat} ${100 - macros.fat}`} strokeDashoffset={-(macros.protein + macros.carbs)} strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: C.text }}>{totalTodayCalories.toLocaleString('ar-EG')}</span>
                <span style={{ fontSize: 11, color: C.textMuted }}>سعرة اليوم</span>
              </div>
            </div>
          </div>
          <Legend color={C.primary} label={`بروتين ${macros.protein}%`} />
          <Legend color={C.amber} label={`كارب ${macros.carbs}%`} />
          <Legend color={C.blue} label={`دهون ${macros.fat}%`} />
        </div>
      </section>

      {/* Weight Progress */}
      <section style={{ padding: '0 20px', marginBottom: 20 }}>
        <div style={{ background: C.card, borderRadius: 24, padding: 20, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontWeight: 700, color: C.text, fontSize: 16, margin: 0 }}>رحلة الوزن</h2>
            <span style={{ fontSize: 11, color: C.primary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              {totalWeightChange > 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />} 
              {Math.abs(totalWeightChange).toFixed(1)} كجم
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.text }}>{weightData.current.toFixed(1)}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>كجم حالياً</div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.primary }}>{weightData.target.toFixed(1)}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>هدفك</div>
            </div>
          </div>
          <div style={{ width: '100%', background: '#F0EDE4', height: 8, borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ background: C.primary, height: '100%', width: `${weightProgressPct}%`, borderRadius: 999, transition: 'width 0.5s ease' }} />
          </div>
        </div>
      </section>

      {/* ✅ 4. Achievements (بيانات حية) */}
      <section style={{ padding: '0 20px' }}>
        <h2 style={{ fontWeight: 700, color: C.text, fontSize: 16, margin: '0 0 12px' }}>الإنجازات</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <Achievement icon={<Flame size={24} color={C.primary} />} label={`${achievements.streak} أيام`} sub="متواصل" />
          <Achievement icon={<Droplets size={24} color={C.primary} />} label={`${achievements.waterLiters.toFixed(1)} لتر`} sub="ماء اليوم" />
          <Achievement icon={<Dumbbell size={24} color={C.primary} />} label={`${achievements.weeklyWorkouts} تمارين`} sub="هذا الأسبوع" />
        </div>
      </section>
      
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: color }} />
      <span style={{ fontSize: 13, color: '#4A4A4A' }}>{label}</span>
    </div>
  );
}

function Achievement({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <div style={{ background: C.card, borderRadius: 20, padding: 12, textAlign: 'center', border: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>{icon}</div>
      <div style={{ fontWeight: 700, color: C.text, fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 10, color: C.textMuted }}>{sub}</div>
    </div>
  );
}
