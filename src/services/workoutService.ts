import React, { useEffect, useState, useMemo } from 'react';
import { Workout, WorkoutFilter } from '../types/workout';
import WorkoutCard from '../components/workout/WorkoutCard';
import { Loader2, Dumbbell } from 'lucide-react';
import { fetchExercises } from '../services/workoutService'; 

export default function WorkoutsScreen() {
  const [activeFilter, setActiveFilter] = useState<WorkoutFilter>('all');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. جلب البيانات الحقيقية من Supabase عند فتح الشاشة
  useEffect(() => {
    const loadWorkouts = async () => {
      setIsLoading(true);
      try {
        const data = await fetchExercises();
        setWorkouts(data);
      } catch (error) {
        console.error("فشل في تحميل التمارين:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWorkouts();
  }, []);

  // 2. فلترة التمارين بناءً على الزر المختار
  const filteredWorkouts = useMemo(() => {
    if (activeFilter === 'all') return workouts;
    return workouts.filter(w => w.target_area === activeFilter);
  }, [workouts, activeFilter]);

  const handleStartWorkout = (id: string) => {
    // هنا لاحقاً سنقوم بتوجيه المستخدم لشاشة تفاصيل التمرين
    console.log(`بدء التمرين رقم: ${id}`);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'var(--font-arabic)', minHeight: '100dvh', background: 'var(--color-bg-base)', paddingBottom: '80px' }}>
      
      {/* Header */}
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--color-text-primary)' }}>
          التمارين
        </h1>
        <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '14px' }}>
          اختر تمرينك وابدأ الآن لتحقيق أهدافك
        </p>
      </header>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'all', label: 'الكل' },
          { id: 'upper', label: 'الجزء العلوي' },
          { id: 'lower', label: 'الجزء السفلي' },
          { id: 'core', label: 'البطن والجذع' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as WorkoutFilter)}
            style={{
              padding: '10px 20px',
              borderRadius: '100px',
              border: '1px solid',
              borderColor: activeFilter === tab.id ? 'var(--color-primary-500)' : 'var(--color-border-subtle)',
              background: activeFilter === tab.id ? 'var(--color-primary-500)' : 'var(--color-surface-1)',
              color: activeFilter === tab.id ? '#fff' : 'var(--color-text-muted)',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Workouts List */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: '16px', color: 'var(--color-text-muted)' }}>
          <Loader2 size={32} className="animate-spin" color="var(--color-primary-500)" />
          <p>جاري تحميل التمارين...</p>
        </div>
      ) : filteredWorkouts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)', background: 'var(--color-surface-1)', borderRadius: '16px', border: '1px dashed var(--color-border-subtle)' }}>
          <Dumbbell size={48} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
          <p>لا توجد تمارين في هذا القسم حالياً.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredWorkouts.map((workout) => (
            <WorkoutCard 
              key={workout.id} 
              workout={workout} 
              onStart={handleStartWorkout} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
