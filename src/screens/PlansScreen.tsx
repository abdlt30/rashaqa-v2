import { useState } from 'react'
import { X, Crown, Zap, Camera, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function PremiumPlansScreen() {
  const [plan, setPlan] = useState<'annual' | 'monthly'>('annual')
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg-base)', direction: 'rtl', paddingBottom: 120, fontFamily: 'var(--font-arabic)' }}>
      <header style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} aria-label="إغلاق" style={{ background: 'transparent', border: 'none', padding: 8, cursor: 'pointer', display: 'flex' }}>
          <X size={24} color="var(--color-text-primary)" />
        </button>
        <button style={{ color: 'var(--color-primary-500)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
          استعادة
        </button>
      </header>

      <section style={{ padding: '0 20px', textAlign: 'center', marginBottom: 32 }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--color-primary-500)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Crown size={40} color="#fff" />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '8px 0', color: 'var(--color-text-primary)' }}>
          ارتقِ برحلتك الصحية
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
          ⭐⭐⭐⭐⭐ 4.9 من 35,000 مشترك
        </p>
      </section>

      <section style={{ padding: '0 20px', marginBottom: 24 }}>
        {[
          { icon: Camera, title: 'تحليل صور غير محدود', sub: 'اكتشف مكونات أي طبق' },
          { icon: Zap, title: 'خطط تتكيف أسبوعياً', sub: 'ذكاء اصطناعي مخصص' },
          { icon: BarChart3, title: 'تقارير متقدمة', sub: 'تحليل عميق لبياناتك' },
        ].map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(31,111,95,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <b.icon size={20} color="var(--color-primary-500)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 14 }}>{b.title}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{b.sub}</div>
            </div>
          </div>
        ))}
      </section>

      <section style={{ padding: '0 20px', marginBottom: 24 }}>
        <div onClick={() => setPlan('annual')} style={{ background: plan === 'annual' ? 'var(--color-primary-500)' : 'var(--color-surface-1)', color: plan === 'annual' ? '#fff' : 'var(--color-text-primary)', borderRadius: 20, padding: 20, marginBottom: 12, cursor: 'pointer', border: plan === 'annual' ? 'none' : '1px solid var(--color-border-subtle)', position: 'relative' }}>
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

        <div onClick={() => setPlan('monthly')} style={{ background: plan === 'monthly' ? 'rgba(31,111,95,0.1)' : 'var(--color-surface-1)', borderRadius: 20, padding: 20, cursor: 'pointer', border: plan === 'monthly' ? '2px solid var(--color-primary-500)' : '1px solid var(--color-border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>الاشتراك الشهري</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>مرن بدون التزام</div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text-primary)' }}>49.99</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>ر.س / شهر</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 20px', position: 'fixed', bottom: 20, left: 20, right: 20 }}>
        <button style={{ width: '100%', background: 'var(--color-primary-500)', color: 'var(--color-text-on-primary)', padding: '16px 0', borderRadius: 16, border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 24px rgba(31,91,74,0.3)', fontFamily: 'inherit' }}>
          {plan === 'annual' ? 'ابدأ 7 أيام مجاناً' : 'اشترك شهرياً'}
        </button>
      </section>
    </div>
  )
                    }
