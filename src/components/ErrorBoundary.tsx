import React from 'react'

interface Props { children: React.ReactNode }
interface State { hasError: boolean; error: Error | null }

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App crashed:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, background: '#0A0C10', minHeight: '100dvh', color: '#F5F5F0', fontFamily: 'Tahoma' }}>
          <h1 style={{ color: '#C5382E', fontSize: 22 }}>⚠️ حدث خطأ</h1>
          <pre style={{ background: '#1A1E28', padding: 16, borderRadius: 8, fontSize: 12, overflow: 'auto', whiteSpace: 'pre-wrap' }}>
            {this.state.error?.message}
          </pre>
          <pre style={{ background: '#1A1E28', padding: 16, borderRadius: 8, fontSize: 10, overflow: 'auto', whiteSpace: 'pre-wrap' }}>
            {this.state.error?.stack?.slice(0, 500)}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
