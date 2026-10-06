import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Dumbbell, BarChart3, User } from 'lucide-react'

const tabs = [
  { key: '/', label: 'الرئيسية', Icon: Home },
  { key: '/workouts', label: 'التمارين', Icon: Dumbbell },
  { key: '/reports', label: 'التقارير', Icon: BarChart3 },
  { key: '/profile', label: 'حسابي', Icon: User },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'stretch',
        height: 'calc(64px + env(safe-area-inset-bottom))',
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: 'var(--color-bg-elevated)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--color-border-subtle)',
        zIndex: 100,
      }}
    >
      {tabs.map(({ key, label, Icon }) => {
        const isActive = location.pathname === key
        const color = isActive
          ? 'var(--color-primary-500)'
          : 'var(--color-text-muted)'

        return (
          <button
            key={key}
            onClick={() => navigate(key)}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              flex: 1,
              height: '64px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color,
              fontFamily: 'var(--font-arabic)',
              position: 'relative',
              padding: 0,
              transition: 'color 200ms ease',
            }}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} color={color} />
            <span
              style={{
                fontSize: 'var(--fs-caption)',
                fontWeight: isActive ? 600 : 500,
                lineHeight: 1,
              }}
            >
              {label}
            </span>
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  width: '4px',
                  height: '4px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-primary-500)',
                }}
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}
