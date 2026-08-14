import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false
        };
    }

    static getDerivedStateFromError() {
        return {
            hasError: true
        };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-page">
                    <h2>Uh oh! Looks like we lost the keys. 🔑</h2>
                    <p>Something went wrong. We're having trouble loading this page. Please try again.</p>
                    <button onClick={() => window.location.reload()}>
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;