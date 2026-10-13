import { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface FoodAnalysis {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  healthTip: string;
  confidence: number;
}

export default function VisionScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodAnalysis | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      analyzeImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64: string) => {
    setAnalyzing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('يجب تسجيل الدخول أولاً');
        return;
      }

      // إزالة prefix الـ data:image
      const base64Data = base64.split(',')[1];

      const response = await fetch(
        'https://axthmghawwishcjlldfj.supabase.co/functions/v1/smart-service',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            action: 'analyze',
            imageBase64: base64Data,
            mimeType: 'image/jpeg',
          }),
        }
      );

      const data = await response.json();
      if (data.ok) {
        setResult(data.data);
      } else {
        alert('فشل التحليل: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء التحليل');
    } finally {
      setAnalyzing(false);
    }
  };

  const saveMeal = async () => {
    if (!result) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('meals').insert({
      user_id: user.id,
      name: result.name,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
      meal_type: 'lunch',
    });

    if (!error) {
      alert('✅ تم حفظ الوجبة في يومياتك');
      navigate('/');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)', direction: 'rtl', paddingBottom: 100 }}>
      <header style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', padding: 8 }}>
          <X size={24} />
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>حلّل وجبتك</h1>
      </header>

      {!image && !result && (
        <section style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>📸</div>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>وجّه الكاميرا نحو طبقك</h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>
              سنحلل المكونات والسعرات بالذكاء الاصطناعي
            </p>
          </div>

          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />

          <button
            onClick={() => fileInput.current?.click()}
            style={{
              width: '100%',
              background: 'var(--color-primary)',
              color: '#fff',
              padding: '16px 0',
              borderRadius: 16,
              border: 'none',
              fontSize: 16,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 12,
            }}
          >
            <Camera size={20} />
            التقاط صورة
          </button>
        </section>
      )}

      {image && (
        <section style={{ padding: '0 20px' }}>
          <img
            src={image}
            alt="وجبة"
            style={{ width: '100%', borderRadius: 20, marginBottom: 16 }}
          />
        </section>
      )}

      {analyzing && (
        <section style={{ padding: '20px', textAlign: 'center' }}>
          <Loader size={48} className="animate-spin" style={{ margin: '0 auto', color: 'var(--color-primary)' }} />
          <p style={{ marginTop: 12 }}>جاري تحليل الطبق...</p>
        </section>
      )}

      {result && (
        <section style={{ padding: '0 20px' }}>
          <div style={{ background: 'var(--color-bg-card)', borderRadius: 20, padding: 20 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginTop: 0 }}>{result.name}</h3>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-primary)' }}>
                {result.calories}
              </span>
              <span style={{ color: 'var(--color-text-muted)' }}>سعرة حرارية</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              <MacroStat label="بروتين" value={result.protein} unit="جم" />
              <MacroStat label="كارب" value={result.carbs} unit="جم" />
              <MacroStat label="دهون" value={result.fat} unit="جم" />
            </div>

            {result.ingredients?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600 }}>المكونات:</h4>
                <ul style={{ paddingRight: 20, color: 'var(--color-text-muted)', fontSize: 13 }}>
                  {result.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                </ul>
              </div>
            )}

            {result.healthTip && (
              <div style={{ background: 'var(--color-primary-soft)', padding: 12, borderRadius: 12, marginBottom: 16 }}>
                💡 {result.healthTip}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={saveMeal}
                style={{ flex: 1, background: 'var(--color-primary)', color: '#fff', padding: 14, borderRadius: 12, border: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <Check size={18} /> حفظ في اليوميات
              </button>
              <button
                onClick={() => { setImage(null); setResult(null); }}
                style={{ padding: '14px 20px', borderRadius: 12, border: '1px solid var(--color-border)', background: 'transparent' }}
              >
                صورة جديدة
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function MacroStat({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div style={{ background: 'var(--color-bg-base)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{value}<span style={{ fontSize: 12 }}>{unit}</span></div>
    </div>
  );
}
