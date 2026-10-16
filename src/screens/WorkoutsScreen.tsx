import { useState, useEffect } from 'react';
import { Dumbbell, Play, Zap, Timer, Flame, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

type MuscleGroup = 'all' | 'upper' | 'lower' | 'core' | 'cardio' | 'stretch';

interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  sets: string;
  duration_minutes: number;
  level: string;
  emoji: string;
  calories_burned: number;
}

const GROUPS: { id: MuscleGroup; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'upper', label: 'الجزء العلوي' },
  { id: 'lower', label: 'الجزء السفلي' },
  { id: 'core', label: 'الجذع' },
  { id: 'cardio', label: 'كارديو' },
  { id: 'stretch', label: 'تمدد' },
];

const C = {
  bg: 'var(--color-bg-base, #FAF7F0)',
  card: 'var(--color-bg-card, #FFFFFF)',
  primary: 'var(--color-primary, #1F5B4A)',
  primarySoft: 'var(--color-primary-soft, #E8F3EE)',
  text: 'var(--color-text-primary, #1A1A1A)',
  textMuted: 'var(--color-text-muted, #6B6B6B)',
  border: 'var(--color-border, #E5DFD0)',
};

export default function WorkoutsScreen() {
  const [active, setActive] = useState<MuscleGroup>('all');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [logging, setLogging] = useState(false);

  // ✅ 1. استدعاء دالة logWorkout من الـ Store
  const logWorkout = useStore((s) => s.logWorkout);

  // ✅ 2. جلب التمارين من Supabase عند فتح الشاشة
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { data, error } = await supabase
          .from('exercises')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setExercises(data || []);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  // ✅ 3. تسجيل التمرين عند الضغط على "ابدأ التمرين الآن"
  const handleStartWorkout = async () => {
    setLogging(true);
    try {
      await logWorkout({
        name: 'تنشيط الحرق وتقوية الجذع',
        duration: 22,
        caloriesBurned: 150,
      });
      alert('✅ تم تسجيل التمرين بنجاح!');
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء تسجيل التمرين');
    } finally {
      setLogging(false);
    }
  };

  const filtered = active === 'all' ? exercises : exercises.filter(e => e.muscle_group === active);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, paddingBottom: 100, direction: 'rtl', fontFamily: 'var(--font-arabic, system-ui)' }}>
      <header style={{ padding: '28px 20px 16px' }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: C.text, margin: 0 }}>التمارين</h1>
        <p style={{ fontSize: 14, color: C.textMuted, margin: '4px 0 0' }}>اختر تمرينك وابدأ الآن</p>
      </header>

      {/* Hero Card */}
      <section style={{ padding: '0 20px', marginBottom: 24 }}>
        <div style={{ background: C.primary, borderRadius: 24, padding: 20, boxShadow: '0 8px 24px rgba(31,91,74,0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#C9E6D8', background: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: 999 }}>
              جلسة اليوم
            </span>
            <Zap size={20} color="#C9E6D8" />
          </div>
          <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>تنشيط الحرق وتقوية الجذع</h2>
          <p style={{ color: '#C9E6D8', fontSize: 13, margin: '0 0 16px' }}>22 دقيقة • بدون أدوات • متوسط</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <StatPill icon={<Timer size={14} />} text="22 د" />
            <StatPill icon={<Flame size={14} />} text="140-160 سعرة" />
            <StatPill icon={<Dumbbell size={14} />} text="بدون أدوات" />
          </div>
          <button 
            onClick={handleStartWorkout}
            disabled={logging}
            style={{ 
              width: '100%', background: '#fff', color: C.primary, fontWeight: 700, 
              padding: '14px 0', borderRadius: 16, border: 'none', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, 
              fontSize: 15, cursor: logging ? 'wait' : 'pointer', opacity: logging ? 0.7 : 1 
            }}
          >
            {logging ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={18} fill={C.primary} />}
            {logging ? 'جاري التسجيل...' : 'ابدأ التمرين الآن'}
          </button>
        </div>
      </section>

      {/* Filters */}
      <section style={{ padding: '0 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          {GROUPS.map(g => (
            <button
              key={g.id}
              onClick={() => setActive(g.id)}
              style={{
                padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
                border: active === g.id ? 'none' : `1px solid ${C.border}`,
                background: active === g.id ? C.primary : C.card,
                color: active === g.id ? '#fff' : '#4A4A4A',
                cursor: 'pointer',
              }}
            >
              {g.label}
            </button>
          ))}
        </div>
      </section>

      {/* Exercises Grid */}
      <section style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontWeight: 700, color: C.text, margin: 0, fontSize: 16 }}>مكتبة التمارين</h3>
          <span style={{ fontSize: 12, color: C.textMuted }}>{filtered.length} تمرين</span>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Loader2 size={32} color={C.primary} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {filtered.map(ex => (
              <button
                key={ex.id}
                style={{ background: C.card, borderRadius: 20, padding: 16, textAlign: 'right', border: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, background: C.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 12 }}>
                  {ex.emoji}
                </div>
                <h4 style={{ fontWeight: 700, color: C.text, fontSize: 14, margin: '0 0 4px' }}>{ex.name}</h4>
                <p style={{ fontSize: 11, color: C.textMuted, margin: '0 0 8px' }}>{ex.sets} • {ex.duration_minutes} د</p>
                <span style={{ fontSize: 10, fontWeight: 600, color: C.primary, background: C.primarySoft, padding: '3px 10px', borderRadius: 999, alignSelf: 'flex-start' }}>
                  {ex.level}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
      
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function StatPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.12)', padding: '6px 10px', borderRadius: 999 }}>
      <span style={{ color: '#C9E6D8', display: 'flex' }}>{icon}</span>
      <span style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{text}</span>
    </div>
  );
}
