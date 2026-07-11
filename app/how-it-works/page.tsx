import Link from "next/link";

const STEPS = [
  {
    num: "01",
    title: "We collect every statement",
    desc: "Every day our pipeline pulls fresh content: Truth Social posts, White House briefings and press releases, YouTube video transcripts from official channels, and NewsAPI headlines. All text is timestamped, sourced, and deduplicated before storage.",
    mockup: (
      <div style={{ fontFamily: "monospace", fontSize: 12 }}>
        {[
          { source: "TS", color: "#ff6b35", text: "We are making incredible deals for the people..." },
          { source: "WH", color: "#1a4a8a", text: "The President signed the historic agreement today..." },
          { source: "YT", color: "#e8302a", text: "...what we are seeing is a framework that will..." },
          { source: "NW", color: "#8a5e0a", text: "White House announces new trade framework..." },
        ].map((s, i) => (
          <div key={i} style={{
            display: "flex",
            gap: 8,
            padding: "6px 0",
            borderBottom: "1px solid #f0f0ee",
            alignItems: "flex-start",
          }}>
            <span style={{
              flexShrink: 0,
              fontWeight: 700,
              color: s.color,
              fontSize: 10,
              width: 20,
              paddingTop: 1,
            }}>{s.source}</span>
            <span style={{ color: "#555", lineHeight: 1.4 }}>{s.text}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    num: "02",
    title: "Our engine scores phrase frequency",
    desc: "We run n-gram analysis across all statements, extracting 1–3 word phrases and counting occurrences. Each phrase gets a score for the current week and is compared to its 4-week rolling average. Phrases that cross a significance threshold surface in the brief.",
    mockup: (
      <div>
        {[
          { phrase: "historic agreement", count: 47, pct: "+340%", w: 100, color: "#e8302a" },
          { phrase: "framework", count: 38, pct: "+280%", w: 82, color: "#e8302a" },
          { phrase: "united states", count: 29, pct: "+140%", w: 62, color: "#e8302a" },
          { phrase: "tariff", count: 8, pct: "−62%", w: 22, color: "#888" },
        ].map((p) => (
          <div key={p.phrase} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: "#333", fontWeight: 500 }}>{p.phrase}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#888" }}>{p.count}×</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: p.color }}>{p.pct}</span>
              </div>
            </div>
            <div style={{ background: "#f0f0ee", borderRadius: 2, height: 5 }}>
              <div style={{ background: p.color, height: "100%", width: `${p.w}%`, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    num: "03",
    title: "You get the weekly brief",
    desc: "Every Monday, we compile the top rising phrases, notable drops, source breakdowns, and emerging narrative patterns into a clean intelligence brief. Subscribers also get access to the full phrase archive and dashboard.",
    mockup: (
      <div>
        <div style={{ background: "#1a1a1a", borderRadius: 6, padding: "14px 16px", marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: "#e8302a", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 6 }}>
            Week 27 · FrequencyTrackingIO
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
            Trade narrative pivots hard — &ldquo;agreement&rdquo; up 340%, &ldquo;tariff&rdquo; down 62%
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, background: "#f0faf0", border: "1px solid #c8e6c9", borderRadius: 6, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#2a9d2a", letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 6 }}>Rising</div>
            {["historic agreement", "framework", "united states"].map(p => (
              <div key={p} style={{ fontSize: 11, color: "#333", padding: "2px 0" }}>↑ {p}</div>
            ))}
          </div>
          <div style={{ flex: 1, background: "#fafafa", border: "1px solid #e0e0de", borderRadius: 6, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 6 }}>Fading</div>
            {["tariff", "reciprocal", "unfair"].map(p => (
              <div key={p} style={{ fontSize: 11, color: "#666", padding: "2px 0" }}>↓ {p}</div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

const WHY = [
  {
    title: "No editorial filter",
    desc: "We count words, not meaning. The data shows what was said and how often — interpretation is yours.",
  },
  {
    title: "Primary source only",
    desc: "Every statement links back to its original source. No third-party summaries or paraphrasing.",
  },
  {
    title: "Week-over-week delta",
    desc: "Absolute counts matter less than change. A phrase that appears 50 times but was 5 last week is the real signal.",
  },
  {
    title: "Cross-source view",
    desc: "When the same phrase appears simultaneously across Truth Social, White House, and news — that's coordination. We show you that.",
  },
];

export default function HowItWorksPage() {
  return (
    <div>
      {/* Hook */}
      <section style={{ background: "#1a1a1a", padding: "72px 0 64px" }}>
        <div className="container" style={{ maxWidth: 680 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#e8302a", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 16 }}>
            How it works
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 700, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 20 }}>
            Language tells you what&apos;s coming before headlines do
          </h1>
          <p style={{ fontSize: 16, color: "#aaa", lineHeight: 1.65, marginBottom: 32 }}>
            Polling asks what people think. Legislation shows what passed. But phrase
            frequency shows you what&apos;s being tested right now — the trial balloons,
            the narrative shifts, the new framing before it becomes official.
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { value: "74,800+", label: "Statements indexed" },
              { value: "Daily", label: "Collection runs" },
              { value: "4", label: "Primary sources" },
            ].map((s, i) => (
              <div key={i} style={{
                background: "#222",
                border: "1px solid #333",
                borderRadius: 8,
                padding: "16px 20px",
                flex: 1,
                textAlign: "center" as const,
              }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#e8302a" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: "72px 0" }}>
        <div className="container">
          {STEPS.map((step, i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 64,
              alignItems: "center",
              marginBottom: i < STEPS.length - 1 ? 80 : 0,
            }}>
              <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                <div style={{
                  fontSize: 48,
                  fontWeight: 800,
                  color: "#f0f0ee",
                  lineHeight: 1,
                  marginBottom: 12,
                  letterSpacing: "-0.02em",
                }}>
                  {step.num}
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, letterSpacing: "-0.01em" }}>
                  {step.title}
                </h2>
                <p style={{ color: "#666", lineHeight: 1.7, fontSize: 14 }}>{step.desc}</p>
              </div>
              <div style={{
                order: i % 2 === 0 ? 1 : 0,
                background: "#fff",
                border: "1px solid #e0e0de",
                borderRadius: 10,
                padding: "24px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}>
                {step.mockup}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why it matters */}
      <section style={{ background: "#fff", borderTop: "1px solid #e0e0de", borderBottom: "1px solid #e0e0de", padding: "64px 0" }}>
        <div className="container">
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 40, letterSpacing: "-0.01em" }}>
            Why frequency, not sentiment
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
          }}>
            {WHY.map((w, i) => (
              <div key={i} style={{
                padding: "24px",
                background: "#f9f9f7",
                border: "1px solid #e8e8e6",
                borderRadius: 8,
              }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{w.title}</h3>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "64px 0", textAlign: "center" as const }}>
        <div className="container" style={{ maxWidth: 520 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
            Ready to track the signal?
          </h2>
          <p style={{ color: "#666", marginBottom: 28, lineHeight: 1.6 }}>
            Free account. Weekly brief every Monday. Full phrase archive access.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link href="/login" className="btn btn-primary" style={{ fontSize: 14, padding: "10px 22px" }}>
              Create free account →
            </Link>
            <Link href="/summary" className="btn btn-secondary" style={{ fontSize: 14, padding: "10px 22px" }}>
              See a sample brief
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
