import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={{
          padding: '2rem',
          maxWidth: '600px',
          margin: '2rem auto',
          fontFamily: 'sans-serif',
          background: '#fff5f5',
          border: '1px solid #fc8181',
          borderRadius: '8px',
        }}>
          <h2 style={{ color: '#c53030', marginTop: 0 }}>Algo salió mal</h2>
          <p style={{ color: '#742a2a' }}>
            Si ves esta pantalla en la página de login, revisa la consola del navegador (F12) para más detalles.
          </p>
          <pre style={{
            background: '#fff',
            padding: '1rem',
            overflow: 'auto',
            fontSize: '12px',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
          }}>
            {this.state.error.toString()}
          </pre>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#3182ce',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
