import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

interface RawStatement {
  date: string;
  source: string;
  text: string;
  url?: string;
}

interface PhraseEntry {
  phrase: string;
  count: number;
  change?: number;
}

interface Analysis {
  id: string;
  created_at: string;
  raw_statements: RawStatement[];
  output: {
    phrase_frequencies?: Record<string, number>;
    top_phrases?: PhraseEntry[];
    summary?: string;
  } | null;
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default async function RunDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("analyses")
    .select("id, created_at, raw_statements, output")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const run: Analysis = data;
  const topPhrases: PhraseEntry[] = run.output?.top_phrases ?? [];
  const phraseFreqs = run.output?.phrase_frequencies ?? {};

  const displayPhrases: PhraseEntry[] = topPhrases.length > 0
    ? topPhrases
    : Object.entries(phraseFreqs)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([phrase, count]) => ({ phrase, count }));

  const maxCount = displayPhrases[0]?.count ?? 1;
  const statements = run.raw_statements ?? [];

  const bySource = statements.reduce((acc: Record<string, RawStatement[]>, s) => {
    const key = s.source ?? "unknown";
    acc[key] = acc[key] ?? [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <div>
      <section style={{ background: "#fff", borderBottom: "1px solid #e0e0de", padding: "28px 0" }}>
        <div className="container">
          <div style={{ marginBottom: 8 }}>
            <Link href="/dashboard" style={{ fontSize: 12, color: "#888" }}>← Dashboard</Link>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
                Run #{run.id.slice(0, 8)}
              </h1>
              <div style={{ fontSize: 12, color: "#888" }}>{formatDate(run.created_at)}</div>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { label: "Statements", value: statements.length },
                { label: "Phrases", value: displayPhrases.length },
                { label: "Sources", value: Object.keys(bySource).length },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" as const }}>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "32px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 28 }}>
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Top phrases by frequency</h2>
              {displayPhrases.length === 0 ? (
                <div style={{ background: "#fff", border: "1px solid #e0e0de", borderRadius: 8, padding: "32px", textAlign: "center" as const, color: "#888", fontSize: 13 }}>
                  No phrase frequency data available
                </div>
              ) : (
                <div style={{ background: "#fff", border: "1px solid #e0e0de", borderRadius: 8, padding: "20px" }}>
                  {displayPhrases.map((p, i) => (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, color: "#333", fontWeight: i < 3 ? 600 : 400 }}>{p.phrase}</span>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          {p.change !== undefined && (
                            <span style={{ fontSize: 11, fontWeight: 700, color: (p.change ?? 0) >= 0 ? "#2a9d2a" : "#999" }}>
                              {(p.change ?? 0) >= 0 ? "+" : ""}{p.change}%
                            </span>
                          )}
                          <span style={{ fontSize: 12, color: "#888" }}>{p.count}×</span>
                        </div>
                      </div>
                      <div style={{ background: "#f0f0ee", borderRadius: 2, height: 5 }}>
                        <div style={{
                          background: i < 3 ? "#e8302a" : "#ccc",
                          height: "100%",
                          width: `${(p.count / maxCount) * 100}%`,
                          borderRadius: 2,
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {statements.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Statements sample</h2>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                    {statements.slice(0, 10).map((s, i) => (
                      <div key={i} style={{ background: "#fff", border: "1px solid #e0e0de", borderRadius: 6, padding: "14px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: SOURCE_COLORS[s.source] ?? "#888" }}>
                            {SOURCE_LABELS[s.source] ?? s.source}
                          </span>
                          <span style={{ fontSize: 11, color: "#aaa" }}>{s.date?.slice(0, 10)}</span>
                        </div>
                        <p style={{ fontSize: 13, color: "#444", lineHeight: 1.5 }}>
                          {s.text?.slice(0, 200)}{(s.text?.length ?? 0) > 200 ? "…" : ""}
                        </p>
                        {s.url && (
                          <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#e8302a", marginTop: 6, display: "inline-block" }}>
                            Source →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Source breakdown</h2>
              <div style={{ background: "#fff", border: "1px solid #e0e0de", borderRadius: 8, padding: "16px" }}>
                {Object.entries(bySource).map(([src, stmts]) => (
                  <div key={src} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 13, color: SOURCE_COLORS[src] ?? "#888", fontWeight: 600 }}>
                        {SOURCE_LABELS[src] ?? src}
                      </span>
                      <span style={{ fontSize: 12, color: "#888" }}>{stmts.length}</span>
                    </div>
                    <div style={{ background: "#f0f0ee", borderRadius: 2, height: 5 }}>
                      <div style={{
                        background: SOURCE_COLORS[src] ?? "#ccc",
                        height: "100%",
                        width: `${(stmts.length / statements.length) * 100}%`,
                        borderRadius: 2,
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {run.output?.summary && (
                <div style={{ marginTop: 16, background: "#1a1a1a", borderRadius: 8, padding: "16px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#e8302a", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 10 }}>
                    AI Summary
                  </div>
                  <p style={{ fontSize: 12, color: "#ccc", lineHeight: 1.6 }}>{run.output.summary}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
