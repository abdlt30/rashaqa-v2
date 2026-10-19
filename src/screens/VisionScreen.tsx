import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Sparkles } from 'lucide-react';
// ✅ 1. استيراد الدالة الجديدة
import { callAICoach } from '../services/aiService';
import { useStore } from '../store/useStore';

export default function VisionScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMeal = useStore((s) => s.addMeal);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);

    try {
      // استخراج Base64 من الصورة
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];

      // ✅ 2. استخدام الدالة الجديدة
      const res = await callAICoach('analyze', {
        message: 'حلل هذا الطعام',
        imageBase64: base64Data,
        mimeType: mimeType
      });

      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setError(res.error || 'فشل في تحليل الصورة');
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const saveMeal = async () => {
    if (!result) return;
    try {
      await addMeal({
        name: result.name,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat,
        meal_type: 'lunch',
      });
      alert('✅ تمت إضافة الوجبة بنجاح!');
      setImage(null);
      setResult(null);
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'var(--font-arabic)', minHeight: '100dvh', background: 'var(--color-bg-base)' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--color-text-primary)' }}>
          تحليل الوجبات
        </h1>
        <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '14px' }}>
          صور طعامك وسيقوم الذكاء الاصطناعي بحساب السعرات
        </p>
      </header>

      {/* Image Preview */}
      <div style={{ 
        background: 'var(--color-surface-1)', 
        border: '2px dashed var(--color-border-subtle)', 
        borderRadius: '20px', 
        height: '300px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden',
        marginBottom: '20px',
        position: 'relative'
      }}>
        {image ? (
          <img src={image} alt="Food" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <Camera size={48} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p>لم يتم اختيار صورة</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
        <button 
          onClick={() => fileInputRef.current?.click()}
          style={{ flex: 1, padding: '14px', background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)', borderRadius: '12px', fontWeight: '600', color: 'var(--color-text-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          <Upload size={18} /> اختيار صورة
        </button>
        
        <button 
          onClick={analyzeImage}
          disabled={!image || loading}
          style={{ flex: 1, padding: '14px', background: 'var(--color-primary-500)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: (!image || loading) ? 0.5 : 1 }}
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {loading ? 'جاري التحليل...' : 'تحليل'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '16px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)', borderRadius: '20px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
            {result.name}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <StatBox label="السعرات" value={`${result.calories} سعرة`} highlight />
            <StatBox label="البروتين" value={`${result.protein} غ`} />
            <StatBox label="الكارب" value={`${result.carbs} غ`} />
            <StatBox label="الدهون" value={`${result.fat} غ`} />
          </div>

          {result.healthTip && (
             <p style={{ fontSize: '13px', color: 'var(--color-primary-500)', background: 'var(--color-primary-soft)', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
               💡 {result.healthTip}
             </p>
          )}

          <button 
            onClick={saveMeal}
            style={{ width: '100%', padding: '16px', background: 'var(--color-text-primary)', color: 'var(--color-bg-base)', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}
          >
            إضافة إلى سجل اليوم
          </button>
        </div>
      )}
      
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function StatBox({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div style={{ background: highlight ? 'var(--color-primary-soft)' : 'var(--color-bg-base)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '16px', fontWeight: '700', color: highlight ? 'var(--color-primary-500)' : 'var(--color-text-primary)' }}>{value}</div>
    </div>
  );
}
