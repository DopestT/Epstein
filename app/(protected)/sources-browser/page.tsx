"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

interface Statement {
  date: string;
  source: string;
  text: string;
  url?: string;
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

export default function SourcesBrowserPage() {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [filtered, setFiltered] = useState<Statement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSource, setActiveSource] = useState<string>("all");
  const [searchText, setSearchText] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const sb = createClient();
    sb.from("analyses")
      .select("raw_statements")
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (!data) { setLoading(false); return; }
        const all: Statement[] = data.flatMap((row) => row.raw_statements ?? []);
        setStatements(all);
        setFiltered(all);
        setTotalCount(all.length);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = statements;
    if (activeSource !== "all") {
      result = result.filter((s) => s.source === activeSource);
    }
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      result = result.filter((s) => s.text?.toLowerCase().includes(q));
    }
    setFiltered(result);
  }, [activeSource, searchText, statements]);

  const sources = ["all", ...Array.from(new Set(statements.map((s) => s.source).filter(Boolean)))];

  const sourceCount = (src: string) =>
    src === "all" ? statements.length : statements.filter((s) => s.source === src).length;

  return (
    <div>
      <section style={{ background: "#fff", borderBottom: "1px solid #e0e0de", padding: "28px 0" }}>
        <div className="container">
          <div style={{ marginBottom: 8 }}>
            <Link href="/dashboard" style={{ fontSize: 12, color: "#888" }}>← Dashboard</Link>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Source browser</h1>
              <p style={{ fontSize: 13, color: "#888" }}>
                Browse all collected statements · {totalCount.toLocaleString()} total
              </p>
            </div>
            <div style={{ fontSize: 13, color: "#888" }}>
              Showing {filtered.length.toLocaleString()} statements
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e0de", position: "sticky" as const, top: 52, zIndex: 10 }}>
        <div className="container" style={{ padding: "12px 24px", display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {sources.map((src) => (
              <button
                key={src}
                onClick={() => setActiveSource(src)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  border: "1px solid",
                  borderColor: activeSource === src
                    ? (SOURCE_COLORS[src] ?? "#e8302a")
                    : "#e0e0de",
                  background: activeSource === src
                    ? (src === "all" ? "#e8302a" : (SOURCE_COLORS[src] ?? "#e8302a") + "15")
                    : "#fff",
                  color: activeSource === src
                    ? (src === "all" ? "#fff" : (SOURCE_COLORS[src] ?? "#e8302a"))
                    : "#888",
                  fontSize: 12,
                  fontWeight: activeSource === src ? 700 : 400,
                  cursor: "pointer",
                }}
              >
                {src === "all" ? "All" : SOURCE_LABELS[src] ?? src}
                <span style={{ marginLeft: 5, fontSize: 10, opacity: 0.7 }}>
                  {sourceCount(src)}
                </span>
              </button>
            ))}
          </div>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Filter by keyword…"
            style={{
              flex: 1,
              padding: "6px 12px",
              border: "1px solid #d0d0ce",
              borderRadius: 20,
              fontSize: 12,
              outline: "none",
            }}
          />
        </div>
      </div>

      <section style={{ padding: "24px 0" }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: "center" as const, padding: "48px", color: "#888", fontSize: 13 }}>
              Loading statements…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              background: "#fff",
              border: "1px solid #e0e0de",
              borderRadius: 8,
              padding: "40px",
              textAlign: "center" as const,
            }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>No statements match</div>
              <p style={{ fontSize: 13, color: "#888" }}>Try adjusting your filters.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {filtered.slice(0, 200).map((s, i) => (
                <div key={i} style={{
                  background: "#fff",
                  border: "1px solid #e0e0de",
                  borderRadius: 6,
                  padding: "14px 16px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: SOURCE_COLORS[s.source] ?? "#888",
                    }}>
                      {SOURCE_LABELS[s.source] ?? s.source}
                    </span>
                    <span style={{ fontSize: 11, color: "#aaa" }}>{s.date?.slice(0, 10)}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#333", lineHeight: 1.55 }}>
                    {s.text?.slice(0, 300)}{(s.text?.length ?? 0) > 300 ? "…" : ""}
                  </p>
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#e8302a", marginTop: 6, display: "inline-block" }}>
                      Source →
                    </a>
                  )}
                </div>
              ))}
              {filtered.length > 200 && (
                <div style={{ textAlign: "center" as const, fontSize: 13, color: "#888", padding: "16px" }}>
                  Showing 200 of {filtered.length.toLocaleString()} results. Narrow your filter to see more.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
