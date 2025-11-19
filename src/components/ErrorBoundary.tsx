import React, { Component } from "react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to external service here if needed
    console.error("Error boundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "2rem",
            backgroundColor: "var(--bg-primary)",
            color: "var(--text-primary)",
            textAlign: "center",
          }}
        >
          <h1>🚫 UPS! COŚ POSZŁO NIE TAK</h1>
          <p style={{ margin: "1rem 0", fontSize: "1.1rem" }}>
            Aplikacja napotkała nieoczekiwany błąd.
          </p>
          <div
            style={{
              background: "rgba(255,255,255,0.9)",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "2rem",
              fontFamily: "monospace",
              fontSize: "0.9rem",
              color: "#d63384",
              maxWidth: "600px",
              wordBreak: "break-word",
            }}
          >
            {this.state.error?.message || "Nieznany błąd"}
          </div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              className="btn-primary"
              onClick={this.handleRetry}
              style={{ minWidth: "120px" }}
            >
              Spróbuj ponownie
            </button>
            <button
              className="btn-secondary"
              onClick={() => (window.location.href = "/")}
              style={{ minWidth: "120px" }}
            >
              Wróć do menu
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
