import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      background: "#fff",
      borderTop: "1px solid #e0e0de",
      padding: "32px 0",
      marginTop: 80,
    }}>
      <div className="container" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
            <span style={{ color: "#1a1a1a" }}>FrequencyTracking</span>
            <span style={{ color: "#e8302a" }}>IO</span>
          </div>
          <div style={{ fontSize: 12, color: "#888" }}>
            Political language intelligence
          </div>
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          {[
            { href: "/how-it-works", label: "How it works" },
            { href: "/sources", label: "Our data" },
            { href: "/summary", label: "Latest brief" },
            { href: "/login", label: "Sign in" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} style={{ fontSize: 12, color: "#888" }}>
              {label}
            </Link>
          ))}
        </div>

        <div style={{ fontSize: 12, color: "#aaa" }}>
          © {new Date().getFullYear()} FrequencyTrackingIO
        </div>
      </div>
    </footer>
  );
}
