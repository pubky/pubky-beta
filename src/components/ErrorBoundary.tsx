'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col text-center items-center justify-center min-h-screen p-8">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="mb-4">An unexpected error occurred. Please try reloading the page.</p>
          <button
            onClick={this.handleReload}
            className="px-6 py-2 bg-[#c8ff00] text-black rounded font-semibold hover:bg-[#b0e600] transition"
          >
            Reload
          </button>
          {this.state.error && (
            <>
              <details className="cursor-pointer mt-4 text-sm opacity-60 whitespace-pre-wrap">
                {this.state.error.message}
              </details>
              {this.state.error.message === 'WebAssembly is not defined' && (
                <div className="mt-4 text-sm text-red-500">
                  WebAssembly is not available in your browser.
                  <br /> Please check your browser settings and ensure that Just-In-Time (JIT) compilation is enabled.
                </div>
              )}
            </>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
