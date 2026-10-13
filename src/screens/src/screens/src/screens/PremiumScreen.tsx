import { useState } from 'react';
import { X, Check, Crown, Zap, Camera, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PremiumScreen() {
  const [plan, setPlan] = useState<'annual' | 'monthly'>('annual');
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)', direction: 'rtl', paddingBottom: 40 }}>
      <header style={{ padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none' }}>
          <X size={24} />
        </button>
        <button style={{ color: 'var(--color-primary)', background: 'transparent', border: 'none' }}>
          استعادة
        </button>
      </header>

      <section style={{ padding: '0 20px', textAlign: 'center', marginBottom: 32 }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Crown size={40} color="#fff" />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '8px 0' }}>ارتقِ برحلتك الصحية</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>⭐⭐⭐⭐⭐ 4.9 من 35,000 مشترك</p>
      </section>

      <section style={{ padding: '0 20px', marginBottom: 24 }}>
        {[
          { icon: Camera, title: 'تحليل صور غير محدود', sub: 'اكتشف مكونات أي طبق' },
          { icon: Zap, title: 'خطط تتكيف أسبوعياً', sub: 'ذكاء اصطناعي مخصص' },
          { icon: BarChart3, title: 'تقارير متقدمة', sub: 'تحليل عميق لبياناتك' },
        ].map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <b.icon size={20} color="var(--color-primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{b.title}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{b.sub}</div>
            </div>
          </div>
        ))}
      </section>

      <section style={{ padding: '0 20px', marginBottom: 24 }}>
        {/* البطاقة السنوية */}
        <div
          onClick={() => setPlan('annual')}
          style={{
            background: plan === 'annual' ? 'var(--color-primary)' : 'var(--color-bg-card)',
            color: plan === 'annual' ? '#fff' : 'var(--color-text-primary)',
            borderRadius: 20, padding: 20, marginBottom: 12, cursor: 'pointer',
            border: plan === 'annual' ? 'none' : '1px solid var(--color-border)',
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', top: -8, right: 16, background: '#FFB95F', color: '#000', fontSize: 11, padding: '4px 10px', borderRadius: 999, fontWeight: 700 }}>
            وفّر 58%
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>الاشتراك السنوي</div>
              <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>تجربة 7 أيام مجاناً</div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 24, fontWeight: 800 }}>20.8</div>
              <div style={{ fontSize: 12 }}>ر.س / شهر</div>
            </div>
          </div>
        </div>

        {/* البطاقة الشهرية */}
        <div
          onClick={() => setPlan('monthly')}
          style={{
            background: plan === 'monthly' ? 'var(--color-primary-soft)' : 'var(--color-bg-card)',
            borderRadius: 20, padding: 20, cursor: 'pointer',
            border: plan === 'monthly' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700 }}>الاشتراك الشهري</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>مرن بدون التزام</div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 24, fontWeight: 800 }}>49.99</div>
              <div style={{ fontSize: 12 }}>ر.س / شهر</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 20px', position: 'fixed', bottom: 20, left: 20, right: 20 }}>
        <button
          style={{
            width: '100%', background: 'var(--color-primary)', color: '#fff',
            padding: '16px 0', borderRadius: 16, border: 'none', fontSize: 16, fontWeight: 700,
            boxShadow: '0 8px 24px rgba(31,91,74,0.3)',
          }}
        >
          {plan === 'annual' ? 'ابدأ 7 أيام مجاناً' : 'اشترك شهرياً'}
        </button>
      </section>
    </div>
  );
}
