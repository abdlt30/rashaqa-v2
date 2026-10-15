import { useState } from 'react';
import {
  User, Ruler, Flag, Bell, Globe, Moon, Crown,
  HelpCircle, Shield, Info, ChevronLeft, Pencil, X, Check,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';

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

const GOAL_LABELS: Record<string, string> = {
  lose: 'إنقاص الوزن',
  maintain: 'الحفاظ على الوزن',
  gain: 'زيادة الوزن',
};

type ModalType = 'personal' | 'measurements' | 'goal' | null;

export default function ProfileScreen() {
  const user = useStore((s) => s.user);
  const userId = useStore((s) => s.userId);
  const targets = useStore((s) => s.targets);
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const setStoreTargets = useStore((s) => s.setTargets);
  const navigate = useNavigate();

  const [modal, setModal] = useState<ModalType>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formAge, setFormAge] = useState('');
  const [formHeight, setFormHeight] = useState('');
  const [formWeight, setFormWeight] = useState('');
  const [formGoal, setFormGoal] = useState('');
  const [formTargetWeight, setFormTargetWeight] = useState('');

  const userName = user?.name || 'ضيف';
  const userAge = user?.age ? `${user.age} سنة` : '—';
  const userMeasurements =
    user?.height_cm && user?.weight_kg
      ? `${user.height_cm} سم • ${user.weight_kg} كجم`
      : '—';
  const userGoal = GOAL_LABELS[user?.goal || ''] || 'غير محدد';

  // ========== Open modal handlers ==========
  const openPersonal = () => {
    setFormName(user?.name || '');
    setFormAge(String(user?.age || ''));
    setModal('personal');
  };

  const openMeasurements = () => {
    setFormHeight(String(user?.height_cm || ''));
    setFormWeight(String(user?.weight_kg || ''));
    setModal('measurements');
  };

  const openGoal = () => {
    setFormGoal(user?.goal || 'maintain');
    setFormTargetWeight(String(user?.target_weight_kg || ''));
    setModal('goal');
  };

  // ========== Save handlers ==========
  const saveToSupabase = async (updates: Record<string, any>) => {
    if (!userId) {
      alert('يجب تسجيل الدخول أولاً');
      return false;
    }
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      alert('فشل الحفظ: ' + error.message);
      return false;
    }
    return true;
  };

  const handleSavePersonal = async () => {
    const name = formName.trim();
    const age = parseInt(formAge, 10);

    if (name.length < 2) return alert('الاسم قصير جداً');
    if (!age || age < 14 || age > 90) return alert('العمر يجب أن يكون بين 14 و 90');

    setSaving(true);
    const ok = await saveToSupabase({ name, age });
    if (ok) {
      // Update local store
      completeOnboarding({
        name,
        goal: user?.goal || 'maintain',
        age,
        gender: user?.gender,
        height_cm: user?.height_cm,
        weight_kg: user?.weight,
        target_weight_kg: user?.target_weight_kg,
        activity_level: user?.activity_level,
        diet_preference: user?.diet_preference,
      });
      setModal(null);
    }
    setSaving(false);
  };

  const handleSaveMeasurements = async () => {
    const height = parseInt(formHeight, 10);
    const weight = parseInt(formWeight, 10);

    if (!height || height < 100 || height > 220) return alert('الطول غير صالح');
    if (!weight || weight < 30 || weight > 250) return alert('الوزن غير صالح');

    setSaving(true);
    const ok = await saveToSupabase({ height_cm: height, weight_kg: weight });
    if (ok) {
      completeOnboarding({
        name: user?.name || 'صديق',
        goal: user?.goal || 'maintain',
        age: user?.age,
        gender: user?.gender,
        height_cm: height,
        weight_kg: weight,
        target_weight_kg: user?.target_weight_kg,
        activity_level: user?.activity_level,
        diet_preference: user?.diet_preference,
      });
      setModal(null);
    }
    setSaving(false);
  };

  const handleSaveGoal = async () => {
    const target = parseInt(formTargetWeight, 10);
    if (!formGoal) return alert('اختر هدفاً');
    if (formGoal !== 'maintain' && (!target || target < 30 || target > 250)) {
      return alert('الوزن المستهدف غير صالح');
    }

    setSaving(true);
    const ok = await saveToSupabase({
      goal: formGoal,
      target_weight_kg: formGoal === 'maintain' ? null : target,
    });
    if (ok) {
      completeOnboarding({
        name: user?.name || 'صديق',
        goal: formGoal,
        age: user?.age,
        gender: user?.gender,
        height_cm: user?.height_cm,
        weight_kg: user?.weight,
        target_weight_kg: formGoal === 'maintain' ? undefined : target,
        activity_level: user?.activity_level,
        diet_preference: user?.diet_preference,
      });
      setModal(null);
    }
    setSaving(false);
  };

  // ========== Sections ==========
  const sections = [
    {
      title: 'الحساب',
      items: [
        { icon: User, label: 'البيانات الشخصية', sub: `${userName} • ${userAge}`, onPress: openPersonal },
        { icon: Ruler, label: 'القياسات', sub: userMeasurements, onPress: openMeasurements },
        { icon: Flag, label: 'الهدف', sub: userGoal, onPress: openGoal },
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
      <header style={{ padding: '28px 20px 16px' }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: C.text, margin: 0 }}>حسابي</h1>
      </header>

      {/* User Card */}
      <section style={{ padding: '0 20px', marginBottom: 20 }}>
        <div style={{ background: C.primary, borderRadius: 24, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={32} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 18, margin: 0 }}>{userName}</h2>
            <p style={{ color: '#C9E6D8', fontSize: 12, margin: '4px 0 0' }}>
              {targets?.calories ? `هدفك اليومي: ${targets.calories} سعرة` : 'ابدأ رحلتك الصحية اليوم'}
            </p>
          </div>
          <button
            onClick={openPersonal}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', padding: 8, cursor: 'pointer' }}
          >
            <Pencil size={18} color="#fff" />
          </button>
        </div>
      </section>

      {/* Premium Banner */}
      <section style={{ padding: '0 20px', marginBottom: 20 }}>
        <button
          onClick={() => navigate('/premium')}
          style={{ width: '100%', background: `linear-gradient(to left, ${C.amber}, #D18A1F)`, borderRadius: 24, padding: 16, border: 'none', cursor: 'pointer', textAlign: 'right' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: 0 }}>ارتقِ إلى بريميوم ✨</h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, margin: '4px 0 0' }}>تحليل غير محدود + خطط ذكية</p>
            </div>
            <Crown size={28} color="#fff" />
          </div>
        </button>
      </section>

      {/* Sections */}
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
                  onClick={item.onPress}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 16px', textAlign: 'right', background: 'transparent',
                    border: 'none', borderBottom: i !== section.items.length - 1 ? `1px solid #F0EDE4` : 'none',
                    cursor: 'pointer', fontFamily: 'inherit',
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
        <button
          onClick={() => {
            if (confirm('هل تريد تسجيل الخروج؟')) {
              useStore.getState().signOut();
            }
          }}
          style={{ width: '100%', background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: '14px 0', color: C.red, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          تسجيل الخروج
        </button>
      </section>

      {/* ============ Modals ============ */}

      {modal === 'personal' && (
        <Modal title="تعديل البيانات الشخصية" onClose={() => setModal(null)} saving={saving} onSave={handleSavePersonal}>
          <FormInput label="الاسم" value={formName} onChange={setFormName} placeholder="مثلاً: أبو محمد" />
          <FormInput label="العمر" value={formAge} onChange={setFormAge} type="number" placeholder="25" />
        </Modal>
      )}

      {modal === 'measurements' && (
        <Modal title="تعديل القياسات" onClose={() => setModal(null)} saving={saving} onSave={handleSaveMeasurements}>
          <FormInput label="الطول (سم)" value={formHeight} onChange={setFormHeight} type="number" placeholder="170" />
          <FormInput label="الوزن (كجم)" value={formWeight} onChange={setFormWeight} type="number" placeholder="70" />
        </Modal>
      )}

      {modal === 'goal' && (
        <Modal title="تعديل الهدف" onClose={() => setModal(null)} saving={saving} onSave={handleSaveGoal}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: C.textMuted, fontSize: 12, display: 'block', marginBottom: 8 }}>الهدف</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { k: 'lose', t: 'إنقاص' },
                { k: 'maintain', t: 'حفاظ' },
                { k: 'gain', t: 'زيادة' },
              ].map((g) => (
                <button
                  key={g.k}
                  onClick={() => setFormGoal(g.k)}
                  style={{
                    flex: 1, padding: 12, borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit',
                    background: formGoal === g.k ? C.primary : C.card,
                    color: formGoal === g.k ? '#fff' : C.text,
                    border: `1.5px solid ${formGoal === g.k ? C.primary : C.border}`,
                    fontSize: 13, fontWeight: 600,
                  }}
                >
                  {g.t}
                </button>
              ))}
            </div>
          </div>
          {formGoal !== 'maintain' && (
            <FormInput
              label="الوزن المستهدف (كجم)"
              value={formTargetWeight}
              onChange={setFormTargetWeight}
              type="number"
              placeholder="70"
            />
          )}
        </Modal>
      )}
    </div>
  );
}

/* ============ Modal Component ============ */

function Modal({ title, children, onClose, onSave, saving }: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        zIndex: 100, direction: 'rtl',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.card, width: '100%', maxWidth: 480,
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          padding: 24, paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
          fontFamily: 'var(--font-arabic)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: C.text }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 8 }}>
            <X size={20} color={C.textMuted} />
          </button>
        </div>

        {children}

        <button
          onClick={onSave}
          disabled={saving}
          style={{
            width: '100%', padding: 16, marginTop: 20,
            background: saving ? C.textMuted : C.primary,
            color: '#fff', border: 'none', borderRadius: 14,
            fontSize: 15, fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
            fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {saving ? 'جاري الحفظ...' : <><Check size={18} /> حفظ</>}
        </button>
      </div>
    </div>
  );
}

/* ============ Form Input Component ============ */

function FormInput({ label, value, onChange, type = 'text', placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ color: C.textMuted, fontSize: 12, display: 'block', marginBottom: 8 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: 14, background: C.bg,
          border: `1.5px solid ${C.border}`, borderRadius: 12,
          fontSize: 14, color: C.text, fontFamily: 'inherit',
          boxSizing: 'border-box', outline: 'none',
        }}
      />
    </div>
  );
}
