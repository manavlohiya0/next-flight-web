"use client";

import {
  Users,
  Shield,
  CreditCard,
  Lock,
  Mail,
  Zap,
  CheckCircle2,
  KeyRound,
  Fingerprint,
  Globe,
  Sliders,
  Database,
} from "lucide-react";

export function BentoShowcase() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "24px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* 1. Multi-Tenant Workspaces */}
      <div className="paper-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--brand-forest)", fontSize: "0.82rem", fontWeight: 700, marginBottom: "4px" }}>
              <Users size={16} />
              <span>Multi-Tenancy & Workspaces</span>
            </div>
            <h3 style={{ fontSize: "1.35rem" }}>Team Workspaces & RBAC Roles</h3>
          </div>
          <span
            style={{
              backgroundColor: "var(--bg-card-muted)",
              color: "var(--brand-forest)",
              border: "1px solid var(--border-stone)",
              padding: "4px 10px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.72rem",
              fontWeight: 600,
            }}
          >
            Data-Leak Proof
          </span>
        </div>
        <p style={{ color: "var(--ink-secondary)", fontSize: "0.92rem", marginBottom: "20px" }}>
          Built-in workspace switching. Users belong to multiple organizations with scoped privileges (`OWNER`, `ADMIN`, `MEMBER`) and zero cross-tenant contamination.
        </p>

        {/* Contained Clean Mockup */}
        <div
          style={{
            backgroundColor: "var(--bg-canvas)",
            border: "1px solid var(--border-stone)",
            borderRadius: "var(--radius-md)",
            padding: "16px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-stone)", paddingBottom: "10px", marginBottom: "10px", flexWrap: "wrap", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "6px", backgroundColor: "var(--brand-forest)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--bg-canvas)", fontWeight: 700, fontSize: "0.75rem" }}>
                ⚡
              </div>
              <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--ink-primary)" }}>Acme Global Labs</span>
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>3 Active Seats</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { name: "Alex Rivera", email: "alex@acme.com", role: "OWNER" },
              { name: "Sarah Chen", email: "sarah@acme.com", role: "ADMIN" },
              { name: "Marcus Vance", email: "marcus@acme.com", role: "MEMBER" },
            ].map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-stone)",
                  borderRadius: "6px",
                  fontSize: "0.82rem",
                  flexWrap: "wrap",
                  gap: "4px",
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, color: "var(--ink-primary)", marginRight: "6px" }}>{m.name}</span>
                  <span style={{ color: "var(--ink-muted)", fontSize: "0.78rem" }}>{m.email}</span>
                </div>
                <span style={{ backgroundColor: "var(--bg-subtle)", color: "var(--brand-forest)", border: "1px solid var(--border-stone)", padding: "2px 8px", borderRadius: "var(--radius-full)", fontSize: "0.7rem", fontWeight: 600 }}>
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Biometric Passkeys & 2FA */}
      <div className="paper-card">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--brand-forest)", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px" }}>
          <Fingerprint size={16} />
          <span>Biometrics & Passkeys</span>
        </div>
        <h3 style={{ fontSize: "1.35rem", marginBottom: "8px" }}>Hardware-Backed 2FA</h3>
        <p style={{ color: "var(--ink-secondary)", fontSize: "0.92rem", marginBottom: "18px" }}>
          Better-Auth WebAuthn passkeys (Face ID / Touch ID / YubiKey) and TOTP authenticator backup pre-wired in Next.js Server Actions.
        </p>

        <div
          style={{
            backgroundColor: "var(--bg-canvas)",
            border: "1px solid var(--border-stone)",
            borderRadius: "var(--radius-md)",
            padding: "16px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-stone)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              color: "var(--brand-forest)",
            }}
          >
            <KeyRound size={22} />
          </div>
          <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--ink-primary)", margin: "0 0 4px 0" }}>
            Biometric Security Verified
          </p>
          <p style={{ fontSize: "0.78rem", color: "var(--ink-muted)", margin: "0 0 12px 0" }}>
            FIDO2 / WebAuthn standard with zero password leaks.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-stone)", padding: "4px 12px", borderRadius: "var(--radius-full)", fontSize: "0.76rem", color: "var(--accent-emerald)", fontWeight: 600 }}>
            <CheckCircle2 size={13} />
            Hardware Key Enforced
          </div>
        </div>
      </div>

      {/* 3. Lemon Squeezy Merchant of Record */}
      <div className="paper-card">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-brass)", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px" }}>
          <CreditCard size={16} />
          <span>Automated Monetization</span>
        </div>
        <h3 style={{ fontSize: "1.35rem", marginBottom: "8px" }}>Global Tax & Lemon Squeezy</h3>
        <p style={{ color: "var(--ink-secondary)", fontSize: "0.92rem", marginBottom: "18px" }}>
          Lemon Squeezy acts as your Merchant of Record. Handles EU VAT, state sales taxes, receipt generation, and currency conversions automatically.
        </p>

        <div
          style={{
            backgroundColor: "var(--bg-canvas)",
            border: "1px solid var(--border-stone)",
            borderRadius: "var(--radius-md)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem" }}>
            <span style={{ color: "var(--ink-secondary)" }}>Lifetime Pro License</span>
            <span style={{ fontWeight: 600, color: "var(--accent-emerald)" }}>Included</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem" }}>
            <span style={{ color: "var(--ink-secondary)" }}>EU VAT / US Sales Tax</span>
            <span style={{ color: "var(--accent-emerald)", fontWeight: 600 }}>Automated (MoR)</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem", borderTop: "1px solid var(--border-stone)", paddingTop: "8px" }}>
            <span style={{ fontWeight: 600, color: "var(--ink-primary)" }}>GitHub Access</span>
            <span style={{ color: "var(--accent-emerald)", fontWeight: 600 }}>Instant Webhook Grant</span>
          </div>
        </div>
      </div>

      {/* 4. Sliding-Window Rate Limiter */}
      <div className="paper-card">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--brand-forest)", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px" }}>
          <Shield size={16} />
          <span>Security & DDoS Shield</span>
        </div>
        <h3 style={{ fontSize: "1.35rem", marginBottom: "8px" }}>Sliding-Window Rate Limiter</h3>
        <p style={{ color: "var(--ink-secondary)", fontSize: "0.92rem", marginBottom: "18px" }}>
          Protects every API route and Server Action from bot brute-force attacks and credential stuffing with memory sliding-window tokens.
        </p>

        <div
          style={{
            backgroundColor: "var(--bg-canvas)",
            border: "1px solid var(--border-stone)",
            borderRadius: "var(--radius-md)",
            padding: "16px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--ink-primary)" }}>Traffic Mitigation</span>
            <span style={{ fontSize: "0.75rem", color: "var(--accent-emerald)", fontWeight: 600 }}>Normal Status</span>
          </div>
          <div style={{ height: "6px", width: "100%", backgroundColor: "var(--border-stone)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
            <div style={{ width: "24%", height: "100%", backgroundColor: "var(--brand-forest)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--ink-muted)", marginTop: "6px" }}>
            <span>24 / 100 req/min</span>
            <span>0 dropped packets</span>
          </div>
        </div>
      </div>
    </div>
  );
}
