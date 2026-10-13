import { User, Ruler, Flag, Bell, Globe, Moon, Crown, HelpCircle, Shield, Info, ChevronLeft, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
const C = {
  bg: 'var(--color-bg-base, #FAF7F0)',
  card: 'var(--color-bg-card, #FFFFFF)',
  primary: 'var(--color-primary, #1F5B4A)',
  text: 'var(--color-text-primary, #1A1A1A)',
  textMuted: 'var(--color-text-muted, #6B6B6B)',
  border: 'var(--color-border, #E5DFD0)',
  amber: '#E8A33D',
  red: '#E44C4C',
};

const SECTIONS = [
  {
    title: 'الحساب',
    items: [
      { icon: User, label: 'البيانات الشخصية', sub: 'ضيف • 28 سنة' },
      { icon: Ruler, label: 'القياسات', sub: '172 سم • 74.2 كجم' },
      { icon: Flag, label: 'الهدف', sub: 'إنقاص الوزن' },
    ],
  },
  {
    title: 'التفضيلات',
    items: [
      { icon: Bell, label: 'الإشعارات', sub: 'مفعّلة' },
      { icon: Globe, label: 'اللغة', sub: 'العربية' },
      { icon: Moon, label: 'الوضع الليلي', sub: 'معطّل' },
    ],
  },
  {
    title: 'الدعم',
    items: [
      { icon: HelpCircle, label: 'المساعدة', sub: '' },
      { icon: Shield, label: 'سياسة الخصوصية', sub: '' },
      { icon: Info, label: 'عن التطبيق', sub: 'v1.0.0' },
    ],
  },
];

export default function ProfileScreen() {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, paddingBottom: 100, direction: 'rtl', fontFamily: 'var(--font-arabic, system-ui)' }}>
      <header style={{ padding: '28px 20px 16px' }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: C.text, margin: 0 }}>حسابي</h1>
      </header>

      {/* User Card */}
      <section style={{ padding: '0 20px', marginBottom: 20 }}>
        <div style={{ background: C.primary, borderRadius: 24, padding: 20, display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 8px 24px rgba(31,91,74,0.15)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={32} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 18, margin: 0 }}>ضيف</h2>
            <p style={{ color: '#C9E6D8', fontSize: 12, margin: '4px 0 0' }}>ابدأ رحلتك الصحية اليوم</p>
          </div>
          <button style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', padding: 8, cursor: 'pointer' }}
           onClick={() => navigate('/premium')}>
          <Pencil size={18} color="#fff" />
          </button>
        </div>
      </section>

      {/* Premium Banner */}
      <section style={{ padding: '0 20px', marginBottom: 20 }}>
        <button style={{ width: '100%', background: `linear-gradient(to left, ${C.amber}, #D18A1F)`, borderRadius: 24, padding: 16, border: 'none', cursor: 'pointer', textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: 0 }}>ارتقِ إلى بريميوم ✨</h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, margin: '4px 0 0' }}>تحليل غير محدود + خطط ذكية</p>
            </div>
            <Crown size={28} color="#fff" />
          </div>
        </button>
      </section>

      {/* Settings Sections */}
      {SECTIONS.map((section, idx) => (
        <section key={idx} style={{ padding: '0 20px', marginBottom: 20 }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, margin: '0 0 8px 4px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {section.title}
          </h3>
          <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            {section.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    textAlign: 'right',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: i !== section.items.length - 1 ? `1px solid #F0EDE4` : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={20} color={C.primary} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{item.label}</div>
                    {item.sub && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{item.sub}</div>}
                  </div>
                  <ChevronLeft size={18} color={C.textMuted} />
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {/* Logout */}
      <section style={{ padding: '0 20px' }}>
        <button style={{ width: '100%', background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: '14px 0', color: C.red, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          تسجيل الخروج
        </button>
      </section>
    </div>
  );
}
