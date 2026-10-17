import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './theme/tokens.css'
// ✅ مسح البيانات القديمة عند كل تحديث (للتطوير فقط)
if (import.meta.env.DEV) {
  localStorage.removeItem('rasha-qa-store');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
