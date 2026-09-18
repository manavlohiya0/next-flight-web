"use client";

import { useState, useEffect } from "react";
import { Bot, CheckCircle2, Terminal } from "lucide-react";

export function AgentPlayground() {
  const prompts = [
    {
      id: "auth",
      label: "Biometric 2FA Passkeys",
      tag: "Better-Auth",
      prompt: "Configure Better-Auth with WebAuthn biometric passkeys and TOTP verification.",
      file: "lib/auth/passkeys.ts",
      code: `// Generated via AGENTS.md blueprint
export const passkeyAuth = betterAuth({
  plugins: [twoFactor({ issuer: "NextFlight" }), passkey()],
  session: { cookie: { secure: true, sameSite: "lax" } }
});
// ✅ 0 Hallucinations | 100% Type-Safe`,
    },
    {
      id: "billing",
      label: "Lemon Squeezy Webhook",
      tag: "Merchant of Record",
      prompt: "Handle subscription_created event, verify HMAC SHA-256 signature, and grant GitHub access.",
      file: "app/api/webhooks/route.ts",
      code: `// Generated via AGENTS.md blueprint
export async function POST(req: NextRequest) {
  const isValid = verifyLemonSignature(rawBody, signature);
  if (!isValid) return new Response("Forbidden", { status: 403 });
  await inviteGithubCollaborator(event.custom.github_username);
  return Response.json({ received: true });
}
// ✅ HMAC Verified | Automated GitHub Invitation`,
    },
    {
      id: "tenant",
      label: "Tenant Role Guard",
      tag: "PostgreSQL & Prisma",
      prompt: "Enforce that only organization ADMIN or OWNER can delete resources.",
      file: "actions/projects.ts",
      code: `// Generated via AGENTS.md blueprint
export async function deleteProject(projectId: string) {
  const session = await auth.getSession();
  await auth.requireMembership(session.user.id, session.orgId, "ADMIN");
  return db.project.delete({ 
    where: { id: projectId, organizationId: session.orgId } 
  });
}
// ✅ Data-Leak Proof | Strict Tenant Scoping`,
    },
  ];

  const [activePrompt, setActivePrompt] = useState(0);
  const [typedCode, setTypedCode] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setIsTyping(true);
    setTypedCode("");
    const target = prompts[activePrompt].code;
    let i = 0;
    const interval = setInterval(() => {
      i += 3;
      if (i >= target.length) {
        setTypedCode(target);
        clearInterval(interval);
        setIsTyping(false);
      } else {
        setTypedCode(target.slice(0, i));
      }
    }, 14);
    return () => clearInterval(interval);
  }, [activePrompt]);

  return (
    <div
      style={{
        maxWidth: "100%",
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-stone)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        boxShadow: "var(--shadow-card)",
        boxSizing: "border-box",
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          backgroundColor: "var(--bg-card-muted)",
          borderBottom: "1px solid var(--border-stone)",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#D1D5DB" }} />
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#D1D5DB" }} />
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#D1D5DB" }} />
          <span style={{ marginLeft: "8px", fontFamily: "var(--font-mono)", fontSize: "0.84rem", color: "var(--ink-secondary)", fontWeight: 500 }}>
            Antigravity / Cursor Interactive Agent Simulator
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "var(--ink-muted)" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--accent-emerald)" }} />
          <span>AGENTS.md active</span>
        </div>
      </div>

      {/* Main Split Body */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          minHeight: "420px",
        }}
      >
        {/* Left: Interactive Prompts Selector */}
        <div
          style={{
            padding: "28px",
            borderRight: "1px solid var(--border-stone)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            backgroundColor: "var(--bg-canvas)",
          }}
        >
          <p style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-muted)", fontWeight: 600, margin: "0 0 6px 0" }}>
            Select Real Prompts Against Rules:
          </p>
          {prompts.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActivePrompt(idx)}
              style={{
                textAlign: "left",
                padding: "16px 18px",
                borderRadius: "var(--radius-md)",
                border: activePrompt === idx ? "1.5px solid var(--brand-forest)" : "1px solid var(--border-stone)",
                backgroundColor: activePrompt === idx ? "var(--bg-card)" : "transparent",
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: activePrompt === idx ? "var(--shadow-sm)" : "none",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontWeight: 600, fontSize: "0.94rem", color: "var(--ink-primary)" }}>
                  {p.label}
                </span>
                <span
                  style={{
                    fontSize: "0.72rem",
                    padding: "2px 8px",
                    borderRadius: "var(--radius-full)",
                    backgroundColor: activePrompt === idx ? "var(--brand-forest)" : "var(--border-stone)",
                    color: activePrompt === idx ? "var(--bg-canvas)" : "var(--ink-secondary)",
                    fontWeight: 500,
                  }}
                >
                  {p.tag}
                </span>
              </div>
              <p style={{ fontSize: "0.84rem", color: "var(--ink-secondary)", margin: 0, lineHeight: 1.45 }}>
                &ldquo;{p.prompt}&rdquo;
              </p>
            </button>
          ))}
        </div>

        {/* Right: Simulated Real-Time Response */}
        <div
          style={{
            padding: "28px 28px 36px 28px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#1A1C19",
            color: "#FFFFFF",
            minWidth: 0,
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.84rem", color: "#A3A79E" }}>
                {prompts[activePrompt].file}
              </span>
              <span
                style={{
                  fontSize: "0.74rem",
                  color: isTyping ? "#C8933A" : "#34D399",
                  fontFamily: "var(--font-mono)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <CheckCircle2 size={13} />
                {isTyping ? "Synthesizing safe code..." : "Schema & Security Verified"}
              </span>
            </div>

            <pre
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.88rem",
                lineHeight: 1.65,
                color: "#E5E7EB",
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowX: "auto",
                minHeight: "180px",
              }}
            >
              <code>{typedCode}</code>
              {isTyping && <span style={{ borderLeft: "2px solid #C8933A", marginLeft: "2px", animation: "blink 1s infinite" }}>&nbsp;</span>}
            </pre>
          </div>

          <div
            style={{
              marginTop: "24px",
              paddingTop: "14px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.75rem",
              color: "#8E9388",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span>AGENTS.md Blueprint Execution</span>
            <span style={{ color: "#34D399", display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#34D399" }} />
              100% Type-Safe Compilation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
