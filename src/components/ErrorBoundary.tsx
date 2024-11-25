import { Component, ErrorInfo } from "react";

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({ error, errorInfo });
        console.error("Error occurred:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Oops! Something went wrong.
                    </h1>
                    <p className="text-gray-600 mb-4">
                        We're sorry for the inconvenience. Please try again later.
                    </p>
                    <button
                        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => window.location.reload()}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
