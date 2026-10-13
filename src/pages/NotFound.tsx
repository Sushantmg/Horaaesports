import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

export default function NotFound() {
  return (
    <>
      <PageHeader
        kicker="// 404 — OUT OF ZONE"
        title="Lost in Erangel."
        sub="This drop zone doesn't exist. Regroup and push back to base."
        accent="NOT FOUND"
      />
      <div className="container" style={{ padding: "3rem 1.5rem 5rem", textAlign: "center" }}>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="btn btn-primary" to="/">
            Back to home
          </Link>
          <Link className="btn btn-ghost" to="/roster">
            Meet the roster
          </Link>
          <Link className="btn btn-ghost" to="/contact">
            Contact camp
          </Link>
        </div>
      </div>
    </>
  );
}
