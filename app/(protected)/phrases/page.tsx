"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

interface PhraseResult {
  phrase: string;
  totalCount: number;
  runCount: number;
  bySource: Record<string, number>;
  appearances: Array<{ date: string; source: string; count: number; runId: string }>;
}

const SOURCE_COLORS: Record<string, string> = {
  truth_social: "#ff6b35",
  white_house: "#1a4a8a",
  youtube: "#e8302a",
  newsapi: "#8a5e0a",
};

const SOURCE_LABELS: Record<string, string> = {
  truth_social: "Truth Social",
  white_house: "White House",
  youtube: "YouTube",
  newsapi: "NewsAPI",
};

export default function PhrasesPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PhraseResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [topPhrases, setTopPhrases] = useState<Array<{ phrase: string; count: number }>>([]);

  // Load top phrases on mount
  useEffect(() => {
    const sb = createClient();
    sb.from("analyses")
      .select("output")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (!data) return;
        const freq: Record<string, number> = {};
        data.forEach((row) => {
          const pf = row.output?.phrase_frequencies ?? {};
          Object.entries(pf).forEach(([phrase, count]) => {
            freq[phrase] = (freq[phrase] ?? 0) + (count as number);
          });
        });
        const top = Object.entries(freq)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 12)
          .map(([phrase, count]) => ({ phrase, count }));
        setTopPhrases(top);
      });
  }, []);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearched(true);

    const sb = createClient();
    const { data } = await sb
      .from("analyses")
      .select("id, created_at, output, raw_statements")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!data) { setLoading(false); return; }

    const q = searchQuery.toLowerCase().trim();
    const found: PhraseResult = {
      phrase: q,
      totalCount: 0,
      runCount: 0,
      bySource: {},
      appearances: [],
    };

    data.forEach((row) => {
      const pf: Record<string, number> = row.output?.phrase_frequencies ?? {};
      const matchedPhrases = Object.entries(pf).filter(([p]) => p.toLowerCase().includes(q));
      if (matchedPhrases.length === 0) return;

      found.runCount++;
      matchedPhrases.forEach(([, count]) => {
        found.totalCount += count as number;
      });

      // Count by source from raw_statements
      const stmts: Array<{ source: string; text: string; date: string }> = row.raw_statements ?? [];
      const matchingStmts = stmts.filter((s) => s.text?.toLowerCase().includes(q));
      matchingStmts.forEach((s) => {
        found.bySource[s.source] = (found.bySource[s.source] ?? 0) + 1;
      });

      if (found.appearances.length < 10) {
        found.appearances.push({
          date: row.created_at.slice(0, 10),
          source: matchingStmts[0]?.source ?? "unknown",
          count: matchedPhrases.reduce((s, [, c]) => s + (c as number), 0),
          runId: row.id,
        });
      }
    });

    setResults(found.totalCount > 0 ? [found] : []);
    setLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  return (
    <div>
      <section style={{ background: "#fff", borderBottom: "1px solid #e0e0de", padding: "28px 0" }}>
        <div className="container">
          <div style={{ marginBottom: 8 }}>
            <Link href="/dashboard" style={{ fontSize: 12, color: "#888" }}>← Dashboard</Link>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Phrase tracker</h1>
          <p style={{ fontSize: 13, color: "#888" }}>Search any phrase across all collected statements</p>
        </div>
      </section>

      <section style={{ padding: "32px 0" }}>
        <div className="container">
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, marginBottom: 28 }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search phrase... e.g. historic agreement, tariff, framework"
              style={{
                flex: 1,
                padding: "10px 14px",
                border: "1px solid #d0d0ce",
                borderRadius: 6,
                fontSize: 14,
                outline: "none",
              }}
            />
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: 90 }}>
              {loading ? "…" : "Search"}
            </button>
          </form>

          {/* Top phrases */}
          {!searched && topPhrases.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                Top phrases (recent runs)
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
                {topPhrases.map((p) => (
                  <button
                    key={p.phrase}
                    onClick={() => { setQuery(p.phrase); search(p.phrase); }}
                    style={{
                      background: "#fff",
                      border: "1px solid #e0e0de",
                      borderRadius: 20,
                      padding: "5px 12px",
                      fontSize: 12,
                      color: "#555",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {p.phrase}
                    <span style={{ color: "#aaa", fontSize: 11 }}>{p.count}×</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {searched && !loading && results.length === 0 && (
            <div style={{
              background: "#fff",
              border: "1px solid #e0e0de",
              borderRadius: 8,
              padding: "40px",
              textAlign: "center" as const,
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🔍</div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>No results for &ldquo;{query}&rdquo;</div>
              <p style={{ fontSize: 13, color: "#888" }}>Try a shorter phrase or different keywords.</p>
            </div>
          )}

          {results.map((r, i) => (
            <div key={i}>
              {/* Summary card */}
              <div style={{
                background: "#fff",
                border: "1px solid #e0e0de",
                borderRadius: 8,
                padding: "24px",
                marginBottom: 16,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>&ldquo;{r.phrase}&rdquo;</h2>
                    <p style={{ fontSize: 13, color: "#888" }}>Found in {r.runCount} runs · {r.totalCount} total occurrences</p>
                  </div>
                  <div style={{ display: "flex", gap: 20 }}>
                    {[
                      { label: "Total uses", value: r.totalCount },
                      { label: "Runs present", value: r.runCount },
                    ].map((s, j) => (
                      <div key={j} style={{ textAlign: "center" as const }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: "#e8302a" }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: "#888" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Source breakdown */}
                {Object.keys(r.bySource).length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 12 }}>
                      By source
                    </div>
                    {Object.entries(r.bySource).sort((a, b) => b[1] - a[1]).map(([src, count]) => {
                      const maxSrc = Math.max(...Object.values(r.bySource));
                      return (
                        <div key={src} style={{ marginBottom: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 12, color: SOURCE_COLORS[src] ?? "#888", fontWeight: 600 }}>
                              {SOURCE_LABELS[src] ?? src}
                            </span>
                            <span style={{ fontSize: 12, color: "#888" }}>{count} statements</span>
                          </div>
                          <div style={{ background: "#f0f0ee", borderRadius: 2, height: 5 }}>
                            <div style={{ background: SOURCE_COLORS[src] ?? "#ccc", height: "100%", width: `${(count / maxSrc) * 100}%`, borderRadius: 2 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Appearances */}
              {r.appearances.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Appearances by run</h3>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                    {r.appearances.map((a, j) => (
                      <Link key={j} href={`/run/${a.runId}`} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#fff",
                        border: "1px solid #e0e0de",
                        borderRadius: 6,
                        padding: "12px 16px",
                      }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <span style={{ fontSize: 12, color: "#888" }}>{a.date}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: SOURCE_COLORS[a.source] ?? "#888" }}>
                            {SOURCE_LABELS[a.source] ?? a.source}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{a.count}×</span>
                          <span style={{ color: "#ccc" }}>→</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
