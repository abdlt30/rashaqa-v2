import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { colors, fonts } from '../theme/theme'

const tabs = [
  { key: '/', label: 'الرئيسية', icon: '🏠' },
  { key: '/workouts', label: 'التمارين', icon: '🏋️' },
  { key: '/reports', label: 'التقارير', icon: '📊' },
  { key: '/profile', label: 'حسابي', icon: '👤' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-around', background: colors.surface, padding: '12px 0', borderTop: '1px solid #2A2A3E', zIndex: 100 }}>
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.key
        return (
          <div key={tab.key} onClick={() => navigate(tab.key)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: isActive ? colors.primary : colors.textMuted, fontSize: fonts.sizes.xs }}>
            <span style={{ fontSize: 20, marginBottom: 2 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </div>
        )
      })}
    </div>
  )
}
