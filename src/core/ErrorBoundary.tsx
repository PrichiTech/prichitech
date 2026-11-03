import { Component, type ErrorInfo, type ReactNode } from 'react'
import { IconButton, Mascot } from '@/ui'

interface Props {
  onHome: () => void
  children: ReactNode
}

/** Dacă un joc are o eroare, restul aplicației merge în continuare. */
export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[PrichiTech] Eroare în modul:', error, info.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="error-screen">
        <Mascot mood="oops" size={160} />
        <p className="error-text">Ups! Ceva nu a mers.</p>
        <IconButton icon="🏠" label="Acasă" size="lg" onClick={this.props.onHome} />
      </div>
    )
  }
}
