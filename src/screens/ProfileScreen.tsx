import { User, Ruler, Flag, Bell, Globe, Moon, Crown, HelpCircle, Shield, Info, ChevronLeft, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
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

// دالة لترجمة الهدف
const GOAL_LABELS: Record<string, string> = {
  lose: 'إنقاص الوزن',
  maintain: 'الحفاظ على الوزن',
  gain: 'زيادة الوزن',
};

export default function ProfileScreen() {
  const user = useStore((s) => s.user);
  const targets = useStore((s) => s.targets);
  const navigate = useNavigate();

  const userName = user?.name || 'ضيف';
  const userAge = user?.age ? `${user.age} سنة` : '—';
  const userMeasurements = user?.height_cm && user?.weight_kg
    ? `${user.height_cm} سم • ${user.weight_kg} كجم`
    : '—';
  const userGoal = GOAL_LABELS[user?.goal || ''] || 'غير محدد';

  const sections = [
    {
      title: 'الحساب',
      items: [
        { icon: User, label: 'البيانات الشخصية', sub: `${userName} • ${userAge}`, onPress: () => {} },
        { icon: Ruler, label: 'القياسات', sub: userMeasurements, onPress: () => {} },
        { icon: Flag, label: 'الهدف', sub: userGoal, onPress: () => {} },
      ],
    },
    {
      title: 'التفضيلات',
      items: [
        { icon: Bell, label: 'الإشعارات', sub: 'مفعّلة', onPress: () => {} },
        { icon: Globe, label: 'اللغة', sub: 'العربية', onPress: () => {} },
        { icon: Moon, label: 'الوضع الليلي', sub: 'معطّل', onPress: () => {} },
      ],
    },
    {
      title: 'الدعم',
      items: [
        { icon: HelpCircle, label: 'المساعدة', sub: '', onPress: () => {} },
        { icon: Shield, label: 'سياسة الخصوصية', sub: '', onPress: () => {} },
        { icon: Info, label: 'عن التطبيق', sub: 'v1.0.0', onPress: () => {} },
      ],
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, paddingBottom: 100, direction: 'rtl', fontFamily: 'var(--font-arabic)' }}>

      {/* User Card */}
      <section style={{ padding: '0 20px', marginBottom: 20 }}>
        <div style={{ background: C.primary, borderRadius: 24, padding: 20, display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 8px 24px rgba(31,91,74,0.15)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={32} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 18, margin: 0 }}>{userName}</h2>
            <p style={{ color: '#C9E6D8', fontSize: 12, margin: '4px 0 0' }}>
          {targets?.calories ? `هدفك اليومي: ${targets.calories} سعرة` : 'ابدأ رحلتك الصحية اليوم'}
      </p>
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
       {sections.map((section, idx) => (
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
