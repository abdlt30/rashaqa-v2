import React from 'react'

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0F0F1A, #1A1A2E)', 
      color: 'white', 
      fontFamily: 'Tahoma, sans-serif' 
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(90deg, #FF6B9D, #FFA726)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        رشاقة
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#A0A0B0' }}>رفيقك العربي الذكي للصحة والتغذية</p>
    </div>
  )
}

export default App
