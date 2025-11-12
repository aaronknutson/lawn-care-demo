import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // You can also log to an error reporting service here
    // Example: logErrorToService(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Optionally reload the page
    if (this.props.resetOnError) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
              <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900 text-center">
              Oops! Something went wrong
            </h1>

            <p className="mt-4 text-gray-600 text-center">
              We're sorry for the inconvenience. The application encountered an unexpected error.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
                <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="mt-2 text-red-600 font-mono text-xs overflow-auto">
                  <p className="font-bold">{this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <pre className="mt-2 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
              >
                <ArrowPathIcon className="h-5 w-5" />
                Try Again
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition-colors"
              >
                Go to Home
              </button>
            </div>

            {this.props.showSupport && (
              <p className="mt-6 text-sm text-gray-500 text-center">
                If this problem persists, please contact our support team at{' '}
                <a href="mailto:support@greenscape.com" className="text-green-600 hover:text-green-700">
                  support@greenscape.com
                </a>
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
