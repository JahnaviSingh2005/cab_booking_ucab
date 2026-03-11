import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, info: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        this.setState({ info });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '40px', backgroundColor: '#fff3f3', minHeight: '100vh' }}>
                    <h2 style={{ color: 'red' }}>⚠️ Application Error</h2>
                    <p><strong>Error:</strong> {this.state.error?.message}</p>
                    <pre style={{ background: '#f8d7da', padding: '10px', borderRadius: '6px', whiteSpace: 'pre-wrap', fontSize: '13px' }}>
                        {this.state.error?.stack}
                    </pre>
                    <p style={{ color: '#666', marginTop: '10px' }}>
                        <strong>Component Stack:</strong>
                        <pre style={{ fontSize: '12px' }}>{this.state.info?.componentStack}</pre>
                    </p>
                    <button onClick={() => window.location.href = '/'} style={{ padding: '8px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Reload App
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
