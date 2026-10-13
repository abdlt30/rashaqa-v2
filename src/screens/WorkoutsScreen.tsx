import { useState } from 'react';
import { Dumbbell, Play, Zap, Timer, Flame, ChevronLeft } from 'lucide-react';

type MuscleGroup = 'all' | 'upper' | 'lower' | 'core' | 'cardio' | 'stretch';

const GROUPS: { id: MuscleGroup; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'upper', label: 'الجزء العلوي' },
  { id: 'lower', label: 'الجزء السفلي' },
  { id: 'core', label: 'الجذع' },
  { id: 'cardio', label: 'كارديو' },
  { id: 'stretch', label: 'تمدد' },
];

const EXERCISES = [
  { id: 1, name: 'قرفصاء', group: 'lower' as MuscleGroup, sets: '3×12', duration: '5 د', level: 'مبتدئ', emoji: '🦵' },
  { id: 2, name: 'بلانك', group: 'core' as MuscleGroup, sets: '3×45 ث', duration: '4 د', level: 'متوسط', emoji: '🧘' },
  { id: 3, name: 'تمرين الضغط', group: 'upper' as MuscleGroup, sets: '3×10', duration: '5 د', level: 'متوسط', emoji: '💪' },
  { id: 4, name: 'الجري بالمكان', group: 'cardio' as MuscleGroup, sets: '3×60 ث', duration: '6 د', level: 'مبتدئ', emoji: '🏃' },
  { id: 5, name: 'الطعنات', group: 'lower' as MuscleGroup, sets: '3×10', duration: '5 د', level: 'متوسط', emoji: '🦿' },
  { id: 6, name: 'تمدّد الظهر', group: 'stretch' as MuscleGroup, sets: '2×30 ث', duration: '3 د', level: 'مبتدئ', emoji: '🤸' },
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
  const filtered = active === 'all' ? EXERCISES : EXERCISES.filter(e => e.group === active);

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
          <button style={{ width: '100%', background: '#fff', color: C.primary, fontWeight: 700, padding: '14px 0', borderRadius: 16, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 15, cursor: 'pointer' }}>
            <Play size={18} fill={C.primary} />
            ابدأ التمرين الآن
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
                padding: '8px 16px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: 'nowrap',
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
              <p style={{ fontSize: 11, color: C.textMuted, margin: '0 0 8px' }}>{ex.sets} • {ex.duration}</p>
              <span style={{ fontSize: 10, fontWeight: 600, color: C.primary, background: C.primarySoft, padding: '3px 10px', borderRadius: 999, alignSelf: 'flex-start' }}>
                {ex.level}
              </span>
            </button>
          ))}
        </div>
      </section>
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
