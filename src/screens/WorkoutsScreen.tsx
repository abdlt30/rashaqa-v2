import React from 'react'
import { colors, fonts, spacing } from '../theme/theme'

export default function WorkoutsScreen() {
  return (
    <div style={{ padding: spacing.lg, color: colors.text, fontFamily: fonts.regular, paddingBottom: 80 }}>
      <h1 style={{ fontSize: fonts.sizes.xl, marginBottom: spacing.md }}>شاشة Workouts</h1>
      <p style={{ color: colors.textMuted }}>هنا سيتم بناء المحتوى لاحقاً.</p>
    </div>
  )
}
