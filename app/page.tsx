import Link from "next/link";

const STATS = [
  { value: "74,800+", label: "Statements tracked" },
  { value: "4", label: "Primary sources" },
  { value: "Weekly", label: "Briefing cadence" },
  { value: "2-gram", label: "Phrase detection" },
];

const FEATURES = [
  {
    icon: "📡",
    title: "Real sources, not summaries",
    desc: "We pull directly from Truth Social, White House press releases, YouTube transcripts, and major news APIs — not filtered through pundits.",
  },
  {
    icon: "📊",
    title: "Phrase frequency scoring",
    desc: "Our n-gram engine counts how often specific phrases appear across all sources, then compares week-over-week to spot what's rising or fading.",
  },
  {
    icon: "📋",
    title: "Weekly intelligence brief",
    desc: "Every week you get a clean brief: top rising phrases, notable drops, source breakdowns, and what the pattern might mean.",
  },
  {
    icon: "🔍",
    title: "Search any phrase",
    desc: "Query the full statement archive. Find every time a specific phrase was used, when it peaked, and which source pushed it hardest.",
  },
];

const SOURCES = [
  { name: "Truth Social", color: "#ff6b35", abbr: "TS" },
  { name: "White House", color: "#1a4a8a", abbr: "WH" },
  { name: "YouTube", color: "#e8302a", abbr: "YT" },
  { name: "NewsAPI", color: "#8a5e0a", abbr: "NW" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section style={{
        background: "#fff",
        borderBottom: "1px solid #e0e0de",
        padding: "72px 0 64px",
      }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#fff8f8",
            border: "1px solid #fce4e4",
            borderRadius: 20,
            padding: "4px 12px",
            marginBottom: 24,
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#e8302a", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
              NEW
            </span>
            <span style={{ fontSize: 12, color: "#666" }}>Week 27 brief is now live</span>
          </div>

          <h1 style={{
            fontSize: 42,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            marginBottom: 20,
            color: "#1a1a1a",
          }}>
            Track what political figures<br />
            are <span style={{ color: "#e8302a" }}>actually saying</span>
          </h1>

          <p style={{
            fontSize: 17,
            color: "#555",
            lineHeight: 1.65,
            marginBottom: 32,
            maxWidth: 580,
          }}>
            We monitor Truth Social, White House press releases, YouTube transcripts,
            and news — then score every phrase for frequency and change. You get a
            weekly brief on what&apos;s rising, what&apos;s fading, and what it signals.
          </p>

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" as const }}>
            <Link href="/login" className="btn btn-primary" style={{ fontSize: 14, padding: "10px 22px" }}>
              Create free account →
            </Link>
            <Link href="/summary" className="btn btn-secondary" style={{ fontSize: 14, padding: "10px 22px" }}>
              See latest brief
            </Link>
          </div>

          <div style={{ marginTop: 32, display: "flex", gap: 8, flexWrap: "wrap" as const }}>
            {SOURCES.map((s) => (
              <span key={s.name} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#f4f4f2",
                border: "1px solid #e0e0de",
                borderRadius: 4,
                padding: "4px 10px",
                fontSize: 12,
                color: "#555",
              }}>
                <span style={{ fontWeight: 700, color: s.color, fontSize: 11 }}>{s.abbr}</span>
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: "#1a1a1a", padding: "28px 0" }}>
        <div className="container" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0,
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              textAlign: "center" as const,
              borderRight: i < 3 ? "1px solid #333" : "none",
              padding: "0 24px",
            }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#e8302a", letterSpacing: "-0.02em" }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "72px 0" }}>
        <div className="container">
          <div style={{ maxWidth: 520, marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", marginBottom: 12 }}>
              Language is the signal
            </h2>
            <p style={{ color: "#666", lineHeight: 1.65, fontSize: 15 }}>
              Politicians repeat what polls well, test phrases before policies launch,
              and abandon narratives when they stop working. Word frequency is a leading
              indicator — not commentary on it.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
          }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: "#fff",
                border: "1px solid #e0e0de",
                borderRadius: 8,
                padding: "28px 28px",
              }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample brief teaser */}
      <section style={{ padding: "0 0 72px" }}>
        <div className="container">
          <div style={{
            background: "#1a1a1a",
            borderRadius: 12,
            padding: "36px 40px",
            display: "flex",
            alignItems: "flex-start",
            gap: 48,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#e8302a", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 12 }}>
                Week 27 Highlights
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>
                &ldquo;Agreement&rdquo; spikes 340% across all sources
              </h3>
              <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.65, marginBottom: 20 }}>
                The phrase &ldquo;historic agreement&rdquo; appeared 47 times across Truth Social,
                White House briefings, and news clips this week — its highest frequency
                in 11 weeks. &ldquo;Tariff&rdquo; dropped 62% as the trade narrative shifted.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <Link href="/summary" className="btn btn-primary" style={{ fontSize: 13 }}>
                  Read the full brief
                </Link>
                <Link href="/login" className="btn" style={{
                  background: "transparent",
                  color: "#fff",
                  border: "1px solid #444",
                  fontSize: 13,
                }}>
                  Get weekly briefs →
                </Link>
              </div>
            </div>
            <div style={{
              flex: "0 0 260px",
              background: "#111",
              borderRadius: 8,
              padding: "20px",
              border: "1px solid #2a2a2a",
            }}>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                Top phrases this week
              </div>
              {[
                { phrase: "historic agreement", pct: "+340%", w: 100 },
                { phrase: "framework", pct: "+280%", w: 82 },
                { phrase: "united states", pct: "+140%", w: 58 },
                { phrase: "reciprocal deal", pct: "+95%", w: 42 },
              ].map((p) => (
                <div key={p.phrase} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "#ddd" }}>{p.phrase}</span>
                    <span style={{ fontSize: 11, color: "#e8302a", fontWeight: 600 }}>{p.pct}</span>
                  </div>
                  <div style={{ background: "#222", borderRadius: 2, height: 4 }}>
                    <div style={{ background: "#e8302a", height: "100%", width: `${p.w}%`, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: "#e8302a",
        padding: "56px 0",
        textAlign: "center" as const,
      }}>
        <div className="container">
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
            Start tracking the language of power
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", marginBottom: 28 }}>
            Free account. Weekly brief every Monday. Cancel any time.
          </p>
          <Link href="/login" className="btn" style={{
            background: "#fff",
            color: "#e8302a",
            fontWeight: 700,
            fontSize: 15,
            padding: "12px 28px",
          }}>
            Create free account →
          </Link>
        </div>
      </section>
    </div>
  );
}
