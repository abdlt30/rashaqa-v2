import React from 'react';

export interface Meal {
  id?: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

interface MealListProps {
  meals: Meal[];
}

export default function MealList({ meals }: MealListProps) {
  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: 'var(--color-text-primary)' }}>
        وجبات اليوم ({meals.length})
      </h3>
      
      {meals.length === 0 ? (
        <div style={{ 
          padding: 32, 
          textAlign: 'center', 
          background: 'var(--color-surface-1)', 
          borderRadius: 12,
          border: '1px dashed var(--color-border-subtle)'
        }}>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>لم تسجل أي وجبة بعد</p>
        </div>
      ) : (
        meals.map((m, i) => (
          <div key={m.id || i} style={{ 
            background: 'var(--color-surface-1)', 
            border: '1px solid var(--color-border-subtle)', 
            borderRadius: 12, 
            padding: 16, 
            marginBottom: 8,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div>
            <div style={{ fontSize: 13, color: 'var(--color-primary-500)', fontWeight: 700 }}>
              {m.calories} سعرة
            </div>
          </div>
        ))
      )}
    </div>
  );
}
