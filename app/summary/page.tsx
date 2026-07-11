import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const RISING = [
  { phrase: "historic agreement", change: "+340%", uses: 47, firstInWeeks: 11, note: "First time in top-10 since Week 16. Appeared across all 4 sources simultaneously — coordinated rollout pattern." },
  { phrase: "framework", change: "+280%", uses: 38, firstInWeeks: null, note: "Broad term used in trade, foreign policy, and domestic contexts. Rising as a softer substitute for 'deal'." },
  { phrase: "united states", change: "+140%", uses: 29, firstInWeeks: null, note: "Shift from first-person framing ('I', 'we') to formal national framing. Often precedes policy announcements." },
];

const FADING = [
  { phrase: "tariff", change: "−62%", uses: 8, peak: "Week 22 (187 uses)" },
  { phrase: "reciprocal", change: "−48%", uses: 11, peak: "Week 23 (89 uses)" },
];

const SOURCE_BREAKDOWN = [
  { name: "Truth Social", abbr: "TS", color: "#ff6b35", pct: 44 },
  { name: "White House", abbr: "WH", color: "#1a4a8a", pct: 28 },
  { name: "YouTube", abbr: "YT", color: "#e8302a", pct: 20 },
  { name: "NewsAPI", abbr: "NW", color: "#8a5e0a", pct: 8 },
];

async function getLatestAnalysis() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data } = await supabase
      .from("analyses")
      .select("id, created_at, output")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    return data;
  } catch {
    return null;
  }
}

export default async function SummaryPage() {
  const latest = await getLatestAnalysis();

  return (
    <div>
      {/* Brief header */}
      <section style={{ background: "#1a1a1a", padding: "48px 0 40px" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#e8302a", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
                  FrequencyTrackingIO
                </span>
                <span style={{ fontSize: 11, color: "#444" }}>·</span>
                <span style={{ fontSize: 11, color: "#555" }}>Issue #27</span>
                <span style={{ fontSize: 11, color: "#444" }}>·</span>
                <span style={{ fontSize: 11, color: "#555" }}>Week of Jul 7 – Jul 13, 2025</span>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1.25, letterSpacing: "-0.01em", maxWidth: 620 }}>
                Trade narrative pivots hard — &ldquo;agreement&rdquo; up 340%, &ldquo;tariff&rdquo; drops 62%
              </h1>
            </div>
          </div>
          <div style={{
            display: "flex",
            gap: 32,
            marginTop: 28,
            paddingTop: 24,
            borderTop: "1px solid #2a2a2a",
          }}>
            {[
              { value: "3,240", label: "Statements analyzed" },
              { value: "47", label: "Significant phrases" },
              { value: "12", label: "Rising phrases" },
              { value: "8", label: "Fading phrases" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section style={{ padding: "40px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32 }}>
            {/* Left — signal cards */}
            <div>
              {/* Rising */}
              <div style={{ marginBottom: 36 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Rising phrases</span>
                  <span style={{
                    background: "#e8f5e9",
                    color: "#2a9d2a",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: 10,
                  }}>12 this week</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                  {RISING.map((r, i) => (
                    <div key={i} style={{
                      background: "#fff",
                      border: "1px solid #e0e0de",
                      borderRadius: 8,
                      padding: "20px 22px",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div>
                          <span style={{ fontSize: 16, fontWeight: 700 }}>&ldquo;{r.phrase}&rdquo;</span>
                          {r.firstInWeeks && (
                            <span style={{
                              marginLeft: 10,
                              fontSize: 11,
                              color: "#888",
                              fontStyle: "italic",
                            }}>
                              first in top-10 since {r.firstInWeeks} weeks ago
                            </span>
                          )}
                        </div>
                        <div style={{ textAlign: "right" as const }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: "#2a9d2a" }}>{r.change}</div>
                          <div style={{ fontSize: 11, color: "#888" }}>{r.uses} uses this week</div>
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{r.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fading */}
              <div style={{ marginBottom: 36 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Fading phrases</span>
                  <span style={{
                    background: "#f5f5f5",
                    color: "#888",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: 10,
                  }}>8 this week</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                  {FADING.map((f, i) => (
                    <div key={i} style={{
                      background: "#fff",
                      border: "1px solid #e0e0de",
                      borderRadius: 8,
                      padding: "20px 22px",
                      opacity: 0.85,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 15, fontWeight: 600 }}>&ldquo;{f.phrase}&rdquo;</span>
                        <div style={{ textAlign: "right" as const }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: "#999" }}>{f.change}</div>
                          <div style={{ fontSize: 11, color: "#aaa" }}>Peak: {f.peak}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Archive gate */}
              <div style={{
                position: "relative" as const,
                borderRadius: 8,
                overflow: "hidden",
              }}>
                <div style={{
                  filter: "blur(4px)",
                  pointerEvents: "none" as const,
                  padding: "20px",
                  background: "#fff",
                  border: "1px solid #e0e0de",
                  borderRadius: 8,
                }}>
                  <div style={{ marginBottom: 16, fontSize: 13, fontWeight: 700, color: "#888" }}>Prior briefs (archive)</div>
                  {["Week 26 · Jun 30 – Jul 6", "Week 25 · Jun 23 – Jun 29", "Week 24 · Jun 16 – Jun 22"].map((w, i) => (
                    <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid #f0f0ee", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13 }}>{w}</span>
                      <span style={{ fontSize: 11, color: "#e8302a" }}>→</span>
                    </div>
                  ))}
                </div>
                <div style={{
                  position: "absolute" as const,
                  inset: 0,
                  background: "rgba(244,244,242,0.9)",
                  display: "flex",
                  flexDirection: "column" as const,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>🔒</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Archive access for subscribers</div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>Get all 26 prior briefs</div>
                  <Link href="/login" className="btn btn-primary" style={{ fontSize: 13 }}>
                    Create free account →
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* Source breakdown */}
              <div style={{
                background: "#fff",
                border: "1px solid #e0e0de",
                borderRadius: 8,
                padding: "20px",
                marginBottom: 16,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 14 }}>
                  Source breakdown
                </div>
                {SOURCE_BREAKDOWN.map((s) => (
                  <div key={s.abbr} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: s.color }}>{s.abbr}</span>
                        <span style={{ fontSize: 12, color: "#555" }}>{s.name}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{s.pct}%</span>
                    </div>
                    <div style={{ background: "#f0f0ee", borderRadius: 2, height: 5 }}>
                      <div style={{ background: s.color, height: "100%", width: `${s.pct}%`, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pattern read */}
              <div style={{
                background: "#1a1a1a",
                borderRadius: 8,
                padding: "20px",
                marginBottom: 16,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#e8302a", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 10 }}>
                  Pattern read
                </div>
                <p style={{ fontSize: 13, color: "#ccc", lineHeight: 1.65 }}>
                  The simultaneous drop in &ldquo;tariff&rdquo; and rise of &ldquo;historic agreement&rdquo; across all sources suggests a coordinated narrative shift — not organic language evolution. When policy language changes this sharply across platforms in one week, policy announcements typically follow within 10 days.
                </p>
              </div>

              {/* Subscribe prompt */}
              <div style={{
                background: "#fff8f8",
                border: "1px solid #fce4e4",
                borderRadius: 8,
                padding: "20px",
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
                  Get this every week
                </div>
                <p style={{ fontSize: 12, color: "#666", marginBottom: 16, lineHeight: 1.6 }}>
                  Free account. Weekly brief on Monday. Dashboard access. Full phrase archive.
                </p>
                <Link href="/login" className="btn btn-primary" style={{ fontSize: 13, width: "100%", justifyContent: "center" }}>
                  Create free account →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
