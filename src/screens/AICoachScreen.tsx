import React, { useState } from 'react';
import { Send, Sparkles, Utensils, Dumbbell, Loader2 } from 'lucide-react';
import { callAICoach } from '../services/aiService';
import { useStore } from '../store/useStore';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  data?: any; // لتخزين الرد المنظم من الذكاء الاصطناعي
}

export default function AICoachScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useStore((s) => s.user);

  const sendMessage = async (text: string, action: string = 'chat') => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), text, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // إذا كان الطلب يتعلق بالتمرين، نرسل بيانات المستخدم
    const payload: any = { message: text };
    if (action === 'workout-plan') {
      payload.goal = user?.goal || 'maintain';
    }

    const result = await callAICoach(action, payload);

    if (result.success) {
      let aiText = '';
      // تنسيق الرد بناءً على نوع الطلب
      if (action === 'analyze' || action === 'suggest') {
        aiText = `الوجبة: ${result.data.name}\nالسعرات: ${result.data.calories}\nالبروتين: ${result.data.protein}غ\nالكارب: ${result.data.carbs}غ`;
        if (result.data.reason) aiText += `\nالسبب: ${result.data.reason}`;
      } else if (action === 'workout-plan') {
        aiText = `التمرين: ${result.data.name}\nالمكان: ${result.data.location === 'home' ? 'المنزل' : result.data.location === 'gym' ? 'الصالة' : 'الخارج'}\nالمدة: ${result.data.duration_minutes} دقيقة\nالسعرات: ${result.data.calories_burned}\nالتعليمات: ${result.data.instructions}`;
      } else {
        aiText = result.data.reply || JSON.stringify(result.data);
      }

      const aiMsg: Message = { id: Date.now().toString(), text: aiText, sender: 'ai', data: result.data };
      setMessages((prev) => [...prev, aiMsg]);
    } else {
      const errorMsg: Message = { id: Date.now().toString(), text: `عذراً، حدث خطأ: ${result.error}`, sender: 'ai' };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--color-bg-base)', fontFamily: 'var(--font-arabic)' }}>
      {/* Header */}
      <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface-1)' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: 'var(--color-text-primary)' }}>المدرب الذكي</h1>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--color-text-muted)' }}>اسأل عن التغذية أو التمارين</p>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '40px' }}>
            <Sparkles size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p>مرحباً {user?.name || 'صديقي'}! كيف يمكنني مساعدتك اليوم؟</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} style={{
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            background: msg.sender === 'user' ? 'var(--color-primary-500)' : 'var(--color-surface-1)',
            color: msg.sender === 'user' ? '#fff' : 'var(--color-text-primary)',
            padding: '12px 16px',
            borderRadius: '16px',
            borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
            borderBottomLeftRadius: msg.sender === 'ai' ? '4px' : '16px',
            border: msg.sender === 'ai' ? '1px solid var(--color-border-subtle)' : 'none',
            whiteSpace: 'pre-line', // للحفاظ على تنسيق الأسطر
            lineHeight: '1.6',
            fontSize: '14px'
          }}>
            {msg.text}
          </div>
        ))}
        
        {loading && (
          <div style={{ alignSelf: 'flex-start', background: 'var(--color-surface-1)', padding: '12px 16px', borderRadius: '16px', border: '1px solid var(--color-border-subtle)' }}>
            <Loader2 size={18} className="animate-spin" color="var(--color-primary-500)" />
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {messages.length === 0 && (
        <div style={{ padding: '0 20px 12px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          <QuickButton icon={<Utensils size={16} />} label="اقترح وجبة" onClick={() => sendMessage('اقترح لي وجبة عربية', 'suggest')} />
          <QuickButton icon={<Dumbbell size={16} />} label="تمرين منزلي" onClick={() => sendMessage('أريد تمريناً للمنزل', 'workout-plan')} />
        </div>
      )}

      {/* Input Area */}
      <div style={{ padding: '16px 20px', background: 'var(--color-surface-1)', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="اكتب هنا..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: '12px',
            border: '1px solid var(--color-border-subtle)',
            background: 'var(--color-bg-base)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-arabic)',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--color-primary-500)',
            color: '#fff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !input.trim() ? 0.5 : 1
          }}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

function QuickButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        borderRadius: '100px',
        background: 'var(--color-surface-2)',
        border: '1px solid var(--color-border-subtle)',
        color: 'var(--color-text-primary)',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }}
    >
      {icon}
      {label}
    </button>
  );
}
