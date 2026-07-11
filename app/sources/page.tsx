import Link from "next/link";

const SOURCES = [
  {
    abbr: "TS",
    name: "Truth Social",
    color: "#ff6b35",
    type: "Social media platform",
    badge: "Live",
    badgeClass: "tag-live",
    statements: "38,200+",
    updateFreq: "Every 2 hours",
    desc: "Direct posts from the official Truth Social account. Includes full post text, timestamps, and reply context. No retweets or shares — only first-party content.",
    tags: ["First-person statements", "Direct policy positions", "Narrative launches"],
  },
  {
    abbr: "WH",
    name: "White House",
    color: "#1a4a8a",
    type: "Official government source",
    badge: "Live",
    badgeClass: "tag-live",
    statements: "12,400+",
    updateFreq: "Daily",
    desc: "Press briefings, statements, executive orders, and official remarks from whitehouse.gov. Includes both prepared remarks and press Q&A transcripts.",
    tags: ["Official policy language", "Press briefings", "Executive orders"],
  },
  {
    abbr: "YT",
    name: "YouTube",
    color: "#e8302a",
    type: "Video transcript",
    badge: "Daily",
    badgeClass: "tag-daily",
    statements: "18,600+",
    updateFreq: "Daily",
    desc: "Auto-generated transcripts from official YouTube channels — press conferences, rally speeches, and media appearances. Transcripts are cleaned for filler words before indexing.",
    tags: ["Rally speeches", "Press conferences", "Media appearances"],
  },
  {
    abbr: "NW",
    name: "NewsAPI",
    color: "#8a5e0a",
    type: "News aggregator",
    badge: "Daily",
    badgeClass: "tag-daily",
    statements: "5,600+",
    updateFreq: "Daily",
    desc: "Headlines and article excerpts from major outlets via NewsAPI. Used primarily to track how political language propagates from primary sources into mainstream coverage.",
    tags: ["Headline language", "Media echo tracking", "Narrative diffusion"],
  },
];

const PIPELINE = [
  { step: "1", title: "Collection", desc: "Scripts run on schedule to fetch new content from each source API or RSS feed." },
  { step: "2", title: "Filtering", desc: "Remove duplicates, retweets, and content below a minimum token count." },
  { step: "3", title: "Deduplication", desc: "Fuzzy-match near-identical statements (same speech posted to multiple platforms) are collapsed to one entry." },
  { step: "4", title: "N-gram scoring", desc: "1–3 gram extraction with stop-word removal and frequency counting against the rolling 4-week baseline." },
  { step: "5", title: "Brief generation", desc: "Top movers (statistically significant delta from baseline) are formatted into the weekly brief." },
];

export default function SourcesPage() {
  return (
    <div>
      {/* Header */}
      <section style={{ background: "#fff", borderBottom: "1px solid #e0e0de", padding: "52px 0 40px" }}>
        <div className="container">
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#2a9d2a",
              fontWeight: 600,
            }}>
              <span style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#2a9d2a",
                display: "inline-block",
                animation: "pulse 2s infinite",
              }} />
              Live
            </span>
            <span style={{ fontSize: 12, color: "#888" }}>Last collection: today, 6:14 AM</span>
            <span style={{ fontSize: 12, color: "#ccc" }}>·</span>
            <span style={{ fontSize: 12, color: "#888" }}>74,800+ statements</span>
            <span style={{ fontSize: 12, color: "#ccc" }}>·</span>
            <span style={{ fontSize: 12, color: "#888" }}>4 active sources</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>
            Our data sources
          </h1>
          <p style={{ color: "#666", maxWidth: 560, lineHeight: 1.65, fontSize: 15 }}>
            Every statement in our index traces directly to a primary source. No
            paraphrasing, no third-party summaries. Here&apos;s exactly what we collect,
            how often, and what we do with it.
          </p>
        </div>
      </section>

      {/* Source cards */}
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 20 }}>
            {SOURCES.map((s) => (
              <div key={s.abbr} style={{
                background: "#fff",
                border: "1px solid #e0e0de",
                borderRadius: 10,
                padding: "28px 32px",
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: 32,
                alignItems: "start",
              }}>
                <div>
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 10,
                    background: `${s.color}15`,
                    border: `2px solid ${s.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 800,
                    color: s.color,
                    marginBottom: 12,
                  }}>
                    {s.abbr}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>{s.type}</div>
                  <span className={`tag ${s.badgeClass}`}>{s.badge}</span>
                </div>
                <div>
                  <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
                    {[
                      { label: "Statements", value: s.statements },
                      { label: "Update frequency", value: s.updateFreq },
                    ].map((m) => (
                      <div key={m.label}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{m.value}</div>
                        <div style={{ fontSize: 11, color: "#888" }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65, marginBottom: 14 }}>{s.desc}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                    {s.tags.map((tag) => (
                      <span key={tag} style={{
                        background: "#f4f4f2",
                        border: "1px solid #e0e0de",
                        borderRadius: 4,
                        padding: "3px 8px",
                        fontSize: 11,
                        color: "#666",
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section style={{ background: "#fff", borderTop: "1px solid #e0e0de", borderBottom: "1px solid #e0e0de", padding: "52px 0" }}>
        <div className="container">
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 32, letterSpacing: "-0.01em" }}>
            What we include and exclude
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#2a9d2a", marginBottom: 16, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
                ✓ Included
              </div>
              {[
                "First-person statements from verified official accounts",
                "Official government documents (briefings, orders, remarks)",
                "Prepared speeches and rally transcripts",
                "Official YouTube channel content (auto-transcribed)",
                "Syndicated news headlines referencing political language",
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: 10,
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0ee",
                  fontSize: 13,
                  color: "#444",
                }}>
                  <span style={{ color: "#2a9d2a", flexShrink: 0 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#e8302a", marginBottom: 16, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
                ✕ Excluded
              </div>
              {[
                "Reposts, shares, or retweets of others' content",
                "Opinion or editorial content",
                "Unverified or parody accounts",
                "Comments, replies, or user-generated responses",
                "Content below 10 tokens (too short to be meaningful)",
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: 10,
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0ee",
                  fontSize: 13,
                  color: "#666",
                }}>
                  <span style={{ color: "#ccc", flexShrink: 0 }}>✕</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section style={{ padding: "52px 0" }}>
        <div className="container">
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 32, letterSpacing: "-0.01em" }}>
            How statements become signals
          </h2>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 0 }}>
            {PIPELINE.map((p, i) => (
              <div key={i} style={{
                display: "flex",
                gap: 20,
                padding: "20px 0",
                borderBottom: i < PIPELINE.length - 1 ? "1px solid #f0f0ee" : "none",
              }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#e8302a",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {p.step}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 0 64px", textAlign: "center" as const }}>
        <div className="container">
          <div style={{
            background: "#f9f9f7",
            border: "1px solid #e0e0de",
            borderRadius: 10,
            padding: "40px",
            maxWidth: 560,
            margin: "0 auto",
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Access the full archive</h3>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 24, lineHeight: 1.6 }}>
              Subscribers get access to every statement, the full phrase database, and the ability to search any phrase across all sources.
            </p>
            <Link href="/login" className="btn btn-primary" style={{ fontSize: 14, padding: "10px 22px" }}>
              Create free account →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
