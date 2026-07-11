"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Nav() {
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sb = createClient();
    sb.auth.getSession().then(({ data: { session } }) => {
      setEmail(session?.user?.email ?? null);
      setLoaded(true);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const isActive = (href: string) =>
    pathname === href ? "1" : "0";

  const isDashboard = pathname?.startsWith("/(protected)") ||
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/phrases") ||
    pathname?.startsWith("/run") ||
    pathname?.startsWith("/sources-browser");

  const handleSignOut = async () => {
    const sb = createClient();
    await sb.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav style={{
      background: "#fff",
      borderBottom: "3px solid #e8302a",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        height: 52,
        gap: 32,
      }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em" }}>
          <span style={{ color: "#1a1a1a" }}>FrequencyTracking</span>
          <span style={{ color: "#e8302a" }}>IO</span>
        </Link>

        <div style={{ display: "flex", gap: 20, flex: 1 }}>
          {[
            { href: "/how-it-works", label: "How it works" },
            { href: "/sources", label: "Our data" },
            { href: "/summary", label: "Latest brief" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: pathname === href ? "#e8302a" : "#444",
                borderBottom: pathname === href ? "2px solid #e8302a" : "2px solid transparent",
                paddingBottom: 2,
                transition: "color 0.15s",
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {loaded && email ? (
            <>
              {!isDashboard && (
                <Link href="/dashboard" style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#444",
                }}>
                  Dashboard
                </Link>
              )}
              <span style={{
                fontSize: 11,
                color: "#888",
                maxWidth: 140,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {email}
              </span>
              <button
                onClick={handleSignOut}
                className="btn btn-secondary"
                style={{ fontSize: 12, padding: "5px 12px" }}
              >
                Sign out
              </button>
            </>
          ) : loaded ? (
            <>
              <Link href="/login" style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>
                Sign in
              </Link>
              <Link href="/login" className="btn btn-primary" style={{ fontSize: 12, padding: "6px 14px" }}>
                Get access
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
