import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

interface Analysis {
  id: string;
  created_at: string;
  output: {
    phrase_frequencies?: Record<string, number>;
    top_phrases?: Array<{ phrase: string; count: number; change?: number }>;
    summary?: string;
  } | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { session } } = await supabase.auth.getSession();

  const { data: runs, error } = await supabase
    .from("analyses")
    .select("id, created_at, output")
    .order("created_at", { ascending: false })
    .limit(20);

  const analyses: Analysis[] = runs ?? [];

  return (
    <div>
      {/* Page header */}
      <section style={{ background: "#fff", borderBottom: "1px solid #e0e0de", padding: "32px 0 28px" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Dashboard</h1>
              <p style={{ fontSize: 13, color: "#888" }}>Signed in as {session?.user?.email}</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Link href="/phrases" className="btn btn-secondary" style={{ fontSize: 13 }}>
                Phrase tracker
              </Link>
              <Link href="/sources-browser" className="btn btn-secondary" style={{ fontSize: 13 }}>
                Source browser
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Runs list */}
      <section style={{ padding: "32px 0" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700 }}>Analysis runs</h2>
            <span style={{ fontSize: 12, color: "#888" }}>{analyses.length} runs</span>
          </div>

          {error && (
            <div style={{ background: "#fff8f8", border: "1px solid #fce4e4", borderRadius: 6, padding: "12px 16px", fontSize: 13, color: "#c42520", marginBottom: 16 }}>
              Error loading runs: {error.message}
            </div>
          )}

          {analyses.length === 0 ? (
            <div style={{
              background: "#fff",
              border: "1px solid #e0e0de",
              borderRadius: 8,
              padding: "48px",
              textAlign: "center" as const,
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>No analysis runs yet</div>
              <p style={{ fontSize: 13, color: "#888" }}>Analysis runs will appear here once the collection pipeline generates data.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
              {analyses.map((run) => {
                const topPhrases = run.output?.top_phrases?.slice(0, 3) ?? [];
                const phraseCount = run.output?.phrase_frequencies
                  ? Object.keys(run.output.phrase_frequencies).length
                  : topPhrases.length;

                return (
                  <Link
                    key={run.id}
                    href={`/run/${run.id}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "200px 1fr auto",
                      alignItems: "center",
                      gap: 24,
                      background: "#fff",
                      border: "1px solid #e0e0de",
                      borderRadius: 8,
                      padding: "18px 22px",
                      textDecoration: "none",
                      transition: "border-color 0.15s, box-shadow 0.15s",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 3 }}>
                        Run #{run.id.slice(0, 8)}
                      </div>
                      <div style={{ fontSize: 11, color: "#888" }}>{formatDate(run.created_at)}</div>
                    </div>
                    <div>
                      {topPhrases.length > 0 ? (
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                          {topPhrases.map((p) => (
                            <span key={p.phrase} style={{
                              background: "#f4f4f2",
                              border: "1px solid #e0e0de",
                              borderRadius: 4,
                              padding: "2px 8px",
                              fontSize: 11,
                              color: "#555",
                            }}>
                              {p.phrase}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: "#aaa" }}>
                          {phraseCount > 0 ? `${phraseCount} phrases indexed` : "No phrase data"}
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {phraseCount > 0 && (
                        <span style={{
                          background: "#e8f5e9",
                          color: "#2a9d2a",
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 10,
                        }}>
                          {phraseCount} phrases
                        </span>
                      )}
                      <span style={{ color: "#ccc", fontSize: 16 }}>→</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
