import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          className="flex flex-col items-center justify-center h-full p-8 text-center"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <p className="text-[#0f0a1e] text-[16px] font-semibold mb-2">
            Something went wrong
          </p>
          <p className="text-[#8b87a0] text-[13px] mb-4">
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 rounded-lg bg-[#7c3aed] text-white text-[13px] cursor-pointer border-0"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
