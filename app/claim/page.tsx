"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { GithubIcon } from "@/components/icons";

function ClaimContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";
  const isSuccess = searchParams.get("success") === "true";

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    repoUrl?: string;
  } | null>(null);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          githubUsername: username.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResult({
          success: false,
          message: data.error || "Failed to grant access. Please check your username and try again.",
        });
      } else {
        setResult({
          success: true,
          message: data.message || "Invitation sent successfully!",
          repoUrl: data.repoUrl,
        });
      }
    } catch {
      setResult({
        success: false,
        message: "Network error. Please try again or contact support.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", padding: "60px 20px", backgroundColor: "var(--bg-canvas)", position: "relative", overflowX: "clip" }}>
      <div className="container" style={{ maxWidth: "560px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" className="brand-wrap" style={{ display: "inline-flex", marginBottom: "20px" }}>
            <span>NextFlight</span>
          </Link>

          <div className="status-pill" style={{ marginBottom: "14px" }}>
            <span className="status-dot" />
            <span>Automated GitHub Delivery</span>
          </div>

          <h1 style={{ fontSize: "2.4rem", marginBottom: "12px" }}>
            Claim Your Repository
          </h1>
          <p style={{ color: "var(--ink-secondary)", fontSize: "1rem" }}>
            Enter your GitHub username below. Our automated engine will immediately grant your account collaborator access.
          </p>
        </div>

        <div className="paper-card" style={{ padding: "36px 30px" }}>
          {isSuccess && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "var(--bg-canvas)",
                border: "1px solid var(--border-stone)",
                borderRadius: "var(--radius-md)",
                padding: "12px 16px",
                marginBottom: "24px",
                color: "var(--accent-emerald)",
                fontSize: "0.88rem",
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>Payment confirmed! Enter your GitHub username below.</span>
            </div>
          )}

          <form onSubmit={handleClaim}>
            <label
              style={{
                display: "block",
                fontSize: "0.88rem",
                fontWeight: 600,
                color: "var(--ink-primary)",
                marginBottom: "8px",
              }}
            >
              GitHub Handle
            </label>
            <div style={{ position: "relative", marginBottom: "20px" }}>
              <span
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--ink-muted)",
                }}
              >
                <GithubIcon size={18} />
              </span>
              <input
                type="text"
                placeholder="e.g. torvalds or octocat"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  backgroundColor: "var(--bg-canvas)",
                  border: "1px solid var(--border-stone)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--ink-primary)",
                  fontSize: "0.95rem",
                  outline: "none",
                  fontFamily: "var(--font-mono)",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: "100%", padding: "14px", fontSize: "1rem" }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Granting Repository Access...
                </>
              ) : (
                <>
                  Send Collaborator Invite
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {result && (
            <div
              style={{
                marginTop: "24px",
                padding: "16px",
                borderRadius: "var(--radius-md)",
                backgroundColor: result.success
                  ? "var(--bg-card-muted)"
                  : "#FEF2F2",
                border: `1px solid ${
                  result.success ? "var(--border-stone)" : "#FCA5A5"
                }`,
                fontSize: "0.9rem",
              }}
            >
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                {result.success ? (
                  <Sparkles size={18} style={{ color: "var(--accent-brass)", flexShrink: 0, marginTop: "2px" }} />
                ) : (
                  <AlertCircle size={18} style={{ color: "#EF4444", flexShrink: 0, marginTop: "2px" }} />
                )}
                <div>
                  <p style={{ color: result.success ? "var(--ink-primary)" : "#B91C1C", margin: 0, fontWeight: 500 }}>
                    {result.message}
                  </p>
                  {result.repoUrl && (
                    <a
                      href={result.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost"
                      style={{ marginTop: "12px", display: "inline-flex", padding: "8px 16px", fontSize: "0.85rem" }}
                    >
                      Open Repository on GitHub
                      <ArrowRight size={13} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              marginTop: "28px",
              paddingTop: "20px",
              borderTop: "1px solid var(--border-stone)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "var(--ink-muted)",
              fontSize: "0.82rem",
            }}
          >
            <ShieldCheck size={16} style={{ color: "var(--brand-forest)", flexShrink: 0 }} />
            <span>Direct read & clone access via GitHub API. No third-party account required.</span>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <Link href="/" style={{ color: "var(--ink-muted)", fontSize: "0.86rem", textDecoration: "none" }}>
            ← Back to NextFlight Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ClaimPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "100px 20px", color: "var(--ink-muted)" }}>Loading claim portal...</div>}>
      <ClaimContent />
    </Suspense>
  );
}
