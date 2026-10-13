import { TrendingDown, Flame, Droplets, Dumbbell } from 'lucide-react';

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

const WEEK_DATA = [65, 80, 55, 90, 70, 85, 60];
const DAYS = ['سبت', 'أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع'];

export default function ReportsScreen() {
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
              متوسط 78%
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, height: 140 }}>
            {WEEK_DATA.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%' }}>
                <div style={{ width: '100%', flex: 1, background: '#F0EDE4', borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${val}%`, background: C.primary, borderRadius: '8px 8px 0 0' }} />
                </div>
                <span style={{ fontSize: 10, color: C.textMuted }}>{DAYS[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Macro Donut */}
      <section style={{ padding: '0 20px', marginBottom: 20 }}>
        <div style={{ background: C.card, borderRadius: 24, padding: 20, border: `1px solid ${C.border}` }}>
          <h2 style={{ fontWeight: 700, color: C.text, fontSize: 16, margin: '0 0 16px' }}>توزيع المغذيات</h2>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{ position: 'relative', width: 160, height: 160 }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#F0EDE4" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke={C.primary} strokeWidth="3" strokeDasharray="35 65" strokeLinecap="round" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke={C.amber} strokeWidth="3" strokeDasharray="45 55" strokeDashoffset="-35" strokeLinecap="round" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke={C.blue} strokeWidth="3" strokeDasharray="20 80" strokeDashoffset="-80" strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: C.text }}>1,840</span>
                <span style={{ fontSize: 11, color: C.textMuted }}>سعرة اليوم</span>
              </div>
            </div>
          </div>
          <Legend color={C.primary} label="بروتين 35%" />
          <Legend color={C.amber} label="كارب 45%" />
          <Legend color={C.blue} label="دهون 20%" />
        </div>
      </section>

      {/* Weight Progress */}
      <section style={{ padding: '0 20px', marginBottom: 20 }}>
        <div style={{ background: C.card, borderRadius: 24, padding: 20, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontWeight: 700, color: C.text, fontSize: 16, margin: 0 }}>رحلة الوزن</h2>
            <span style={{ fontSize: 11, color: C.primary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <TrendingDown size={14} /> -1.8 كجم
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.text }}>74.2</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>كجم حالياً</div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.primary }}>70.0</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>هدفك</div>
            </div>
          </div>
          <div style={{ width: '100%', background: '#F0EDE4', height: 8, borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ background: C.primary, height: '100%', width: '57%', borderRadius: 999 }} />
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section style={{ padding: '0 20px' }}>
        <h2 style={{ fontWeight: 700, color: C.text, fontSize: 16, margin: '0 0 12px' }}>الإنجازات</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <Achievement icon={<Flame size={24} color={C.primary} />} label="7 أيام" sub="متواصل" />
          <Achievement icon={<Droplets size={24} color={C.primary} />} label="2 لتر" sub="ماء" />
          <Achievement icon={<Dumbbell size={24} color={C.primary} />} label="4 تمارين" sub="الأسبوع" />
        </div>
      </section>
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
