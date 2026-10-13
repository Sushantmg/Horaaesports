import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(err: unknown) {
    console.error("[horaa] render crash:", err);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container" style={{ padding: "6rem 1.5rem", textAlign: "center" }}>
          <span className="section-kicker">// SYSTEM FAILURE</span>
          <h1 className="page-title">Squad wiped.</h1>
          <p className="page-sub">Something crashed on this drop. Redeploy to get back in the zone.</p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1.5rem" }}>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Redeploy
            </button>
            <a className="btn btn-ghost" href="/">
              Back to base
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
