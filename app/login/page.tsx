"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const redirect = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    // Redirect if already logged in
    const sb = createClient();
    sb.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace(redirect);
    });
  }, [redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const sb = createClient();

    if (mode === "signup") {
      const { error: err } = await sb.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` },
      });
      if (err) {
        setError(err.message);
      } else {
        setSuccess("Check your email to confirm your account, then sign in.");
      }
    } else {
      const { error: err } = await sb.auth.signInWithPassword({ email, password });
      if (err) {
        setError(err.message);
      } else {
        router.replace(redirect);
      }
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 52px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Card */}
        <div style={{
          background: "#fff",
          border: "1px solid #e0e0de",
          borderRadius: 12,
          padding: "36px 36px",
          boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
        }}>
          <div style={{ textAlign: "center" as const, marginBottom: 28 }}>
            <Link href="/" style={{ fontWeight: 800, fontSize: 18 }}>
              <span style={{ color: "#1a1a1a" }}>FrequencyTracking</span>
              <span style={{ color: "#e8302a" }}>IO</span>
            </Link>
            <h1 style={{ fontSize: 20, fontWeight: 700, marginTop: 16, marginBottom: 6 }}>
              {mode === "signin" ? "Sign in to your account" : "Create free account"}
            </h1>
            <p style={{ fontSize: 13, color: "#888" }}>
              {mode === "signin"
                ? "Access your dashboard and weekly briefs"
                : "Free account — weekly brief every Monday"}
            </p>
          </div>

          {error && (
            <div style={{
              background: "#fff8f8",
              border: "1px solid #fce4e4",
              borderRadius: 6,
              padding: "10px 14px",
              marginBottom: 18,
              fontSize: 13,
              color: "#c42520",
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: "#f0faf0",
              border: "1px solid #c8e6c9",
              borderRadius: 6,
              padding: "10px 14px",
              marginBottom: 18,
              fontSize: 13,
              color: "#2a9d2a",
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d0d0ce",
                  borderRadius: 6,
                  fontSize: 14,
                  outline: "none",
                  background: "#fff",
                }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d0d0ce",
                  borderRadius: 6,
                  fontSize: 14,
                  outline: "none",
                  background: "#fff",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                fontSize: 14,
                padding: "11px",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Please wait…"
                : mode === "signin"
                ? "Sign in →"
                : "Create account →"}
            </button>
          </form>

          <div style={{
            borderTop: "1px solid #f0f0ee",
            marginTop: 24,
            paddingTop: 20,
            textAlign: "center" as const,
          }}>
            <span style={{ fontSize: 13, color: "#888" }}>
              {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); setSuccess(""); }}
              style={{
                background: "none",
                border: "none",
                color: "#e8302a",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
              }}
            >
              {mode === "signin" ? "Sign up free" : "Sign in"}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center" as const, fontSize: 12, color: "#aaa", marginTop: 20, lineHeight: 1.6 }}>
          By creating an account you agree to receive the FrequencyTrackingIO weekly brief.
          Unsubscribe any time.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
