import React from 'react';

interface MacroCardProps {
  remaining: number;
  targetCalories: number;
}

export default function MacroCard({ remaining, targetCalories }: MacroCardProps) {
  return (
    <div style={{ 
      background: 'var(--color-surface-1)', 
      border: '1px solid var(--color-border-subtle)', 
      borderRadius: 16, 
      padding: 20, 
      textAlign: 'center', 
      marginBottom: 16,
      boxShadow: 'var(--shadow-sm)' // افترض أن لدينا متغير للظل
    }}>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 13, margin: 0 }}>السعرات المتبقية</p>
      <h2 style={{ fontSize: 48, fontWeight: 700, margin: '8px 0', color: 'var(--color-text-primary)' }}>
        {remaining}
      </h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 12, margin: 0 }}>
        من أصل {targetCalories}
      </p>
    </div>
  );
}
