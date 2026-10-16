import { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { askAi } from '../services/aiService';

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
  const [saving, setSaving] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const addMeal = useStore((s) => s.addMeal);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImage(dataUrl);
      analyzeImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // ✅ 1. دالة تحليل الصورة (باستخدام aiService)
  const analyzeImage = async (base64: string) => {
    setAnalyzing(true);
    setResult(null);
    try {
      const base64Data = base64.split(',')[1];
      const mimeMatch = base64.match(/data:(.*?);/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

      const res = await askAi<FoodAnalysis>('analyze', {
        imageBase64: base64Data,
        mimeType: mimeType,
      });

      if (res.ok && res.data) {
        setResult(res.data);
      } else {
        alert('فشل التحليل: ' + (res.error || 'خطأ غير معروف'));
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء التحليل');
    } finally {
      setAnalyzing(false);
    }
  };

  // ✅ 2. دالة حفظ الوجبة (باستخدام الـ Store) - دالة واحدة فقط!
  const saveMeal = async () => {
    if (!result) return;
    setSaving(true);
    try {
      const hour = new Date().getHours();
      let mealType = 'snack';
      if (hour >= 5 && hour < 11) mealType = 'breakfast';
      else if (hour >= 11 && hour < 15) mealType = 'lunch';
      else if (hour >= 15 && hour < 21) mealType = 'dinner';

      await addMeal({
        name: result.name,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat,
        meal_type: mealType,
      });

      alert('✅ تم حفظ الوجبة بنجاح');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg-base)', direction: 'rtl', paddingBottom: 100, fontFamily: 'var(--font-arabic)' }}>
      <header style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', padding: 8, cursor: 'pointer', display: 'flex' }}>
          <X size={24} color="var(--color-text-primary)" />
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>حلّل وجبتك</h1>
      </header>

      {!image && !result && (
        <section style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>📸</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)' }}>وجّه الكاميرا نحو طبقك</h2>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>سنحلل المكونات والسعرات بالذكاء الاصطناعي</p>
          <input ref={fileInput} type="file" accept="image/*" capture="environment" onChange={handleImageSelect} style={{ display: 'none' }} />
          <button onClick={() => fileInput.current?.click()} style={{ width: '100%', background: 'var(--color-primary-500)', color: 'var(--color-text-on-primary)', padding: '16px 0', borderRadius: 'var(--radius-lg)', border: 'none', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', marginBottom: 12, fontFamily: 'inherit' }}>
            <Camera size={20} /> التقاط صورة
          </button>
          <button onClick={() => fileInput.current?.click()} style={{ width: '100%', background: 'transparent', color: 'var(--color-text-primary)', padding: '16px 0', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', fontFamily: 'inherit' }}>
            <Upload size={18} /> اختيار من الألبوم
          </button>
        </section>
      )}

      {image && (
        <section style={{ padding: '0 20px' }}>
          <img src={image} alt="وجبة" style={{ width: '100%', borderRadius: 20, marginBottom: 16 }} />
        </section>
      )}

      {analyzing && (
        <section style={{ padding: '20px', textAlign: 'center' }}>
          <Loader size={48} style={{ margin: '0 auto', color: 'var(--color-primary-500)', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: 12, color: 'var(--color-text-secondary)' }}>جاري تحليل الطبق...</p>
        </section>
      )}

      {result && (
        <section style={{ padding: '0 20px' }}>
          <div style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-xl)', padding: 20 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, color: 'var(--color-text-primary)' }}>{result.name}</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-primary-500)' }}>{result.calories}</span>
              <span style={{ color: 'var(--color-text-muted)' }}>سعرة حرارية</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ background: 'var(--color-surface-2)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>بروتين</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{result.protein}g</div>
              </div>
              <div style={{ background: 'var(--color-surface-2)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>كارب</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{result.carbs}g</div>
              </div>
              <div style={{ background: 'var(--color-surface-2)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>دهون</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{result.fat}g</div>
              </div>
            </div>
            {result.healthTip && (
              <div style={{ background: 'rgba(31,111,95,0.1)', padding: 12, borderRadius: 12, marginBottom: 16, fontSize: 13 }}>
                💡 {result.healthTip}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={saveMeal} disabled={saving} style={{ flex: 1, background: 'var(--color-primary-500)', color: 'var(--color-text-on-primary)', padding: 14, borderRadius: 12, border: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'inherit' }}>
                <Check size={18} /> {saving ? 'جاري الحفظ...' : 'حفظ في اليوميات'}
              </button>
              <button onClick={() => { setImage(null); setResult(null) }} style={{ padding: '14px 20px', borderRadius: 12, border: '1px solid var(--color-border-subtle)', background: 'transparent', color: 'var(--color-text-primary)', cursor: 'pointer', fontFamily: 'inherit' }}>
                صورة جديدة
              </button>
            </div>
          </div>
        </section>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
