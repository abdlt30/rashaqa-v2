import './App.css'

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
      color: 'white',
      fontFamily: 'Tahoma, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>💎 رشاقة</h1>
      <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>رفيقك العربي الذكي</p>
      <p style={{ marginTop: '2rem', opacity: 0.7 }}>V15.1.4 — React Edition</p>
    </div>
  )
}

export default App