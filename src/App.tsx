import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import HomeScreen from './screens/HomeScreen'
import WorkoutsScreen from './screens/WorkoutsScreen'
import ReportsScreen from './screens/ReportsScreen'
import ProfileScreen from './screens/ProfileScreen'
import { colors, fonts } from './theme/theme'

function App() {
  return (
    <BrowserRouter>
      <div style={{ background: colors.background, minHeight: '100vh', color: colors.text, fontFamily: fonts.regular }}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/workouts" element={<WorkoutsScreen />} />
          <Route path="/reports" element={<ReportsScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default App
