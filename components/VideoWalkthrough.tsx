"use client";

import { useState } from "react";
import {
  Play,
  Pause,
  Clock,
  Tv,
  CheckCircle2,
  Maximize2,
  Volume2,
} from "lucide-react";

interface Chapter {
  id: number;
  time: string;
  title: string;
  tagline: string;
  desc: string;
  snippet: string;
}

const chapters: Chapter[] = [
  {
    id: 1,
    time: "00:00",
    title: "The 48h Solopreneur Blueprint",
    tagline: "Speed & Execution",
    desc: "Why writing auth, database connections, and Lemon Squeezy plumbing from scratch kills 90% of SaaS startups before launch.",
    snippet: `// Solopreneur velocity: Zero plumbing needed
import { auth } from "@/lib/auth";
import { lemonSqueezy } from "@/lib/payments";

// 100% pre-configured: Auth, 2FA, Multi-Tenancy & Global Taxes
export const runtime = "nodejs";`,
  },
  {
    id: 2,
    time: "03:15",
    title: "Multi-Tenant Architecture Tour",
    tagline: "PostgreSQL & Prisma",
    desc: "How strict organization-level scoping ensures zero tenant data leakage and effortless workspace switching.",
    snippet: `// Strict tenant isolation guard:
const projects = await db.project.findMany({
  where: { organizationId: session.orgId },
  include: { members: true }
});`,
  },
  {
    id: 3,
    time: "06:40",
    title: "Autonomous AI Pair-Programming",
    tagline: "Zero Hallucinations",
    desc: "How AGENTS.md and .cursorrules instruct Antigravity, Cursor, and Claude Code to build features without breaking schemas.",
    snippet: `# Prompting Cursor / Antigravity / Claude Code:
"Add an invite member modal following AGENTS.md rules"
-> 0 hallucinated imports, 100% type-safe compilation on pass 1!`,
  },
  {
    id: 4,
    time: "10:10",
    title: "Lemon Squeezy & 2FA in 3 Mins",
    tagline: "Instant Monetization",
    desc: "Hooking up your store ID, automated GitHub collaborator invites, and WebAuthn hardware passkeys in under 180 seconds.",
    snippet: `// Automated Merchant of Record:
export const checkout = await lemonSqueezy.createCheckout({
  storeId: process.env.LEMON_SQUEEZY_STORE_ID!,
  variantId: process.env.LEMON_SQUEEZY_VARIANT_ID!,
  custom: { github_username: buyerHandle }
});`,
  },
];

export function VideoWalkthrough() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const curr = chapters[activeChapter];

  return (
    <div style={{ maxWidth: "100%", margin: "0 auto", boxSizing: "border-box" }}>
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div className="status-pill" style={{ marginBottom: "12px" }}>
          <Tv size={14} style={{ color: "var(--accent-brass)" }} />
          <span>Founder Video Tour</span>
        </div>
        <h2 style={{ fontSize: "clamp(2rem, 3.6vw, 2.8rem)", marginBottom: "12px" }}>
          How to Ship a Production SaaS in 48 Hours
        </h2>
        <p style={{ color: "var(--ink-secondary)", maxWidth: "660px", margin: "0 auto", fontSize: "1.05rem" }}>
          A 12-minute deep-dive walking through real codebase architecture, multi-tenant security guards, and the exact AI pair-programming workflow.
        </p>
      </div>

      {/* Media Player Shell */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-stone)",
          boxShadow: "var(--shadow-card)",
          overflow: "hidden",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Studio Top Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 22px",
            backgroundColor: "var(--bg-card-muted)",
            borderBottom: "1px solid var(--border-stone)",
            fontSize: "0.85rem",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "3px 10px",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--brand-forest)",
                color: "var(--bg-canvas)",
                fontSize: "0.74rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--accent-emerald)" }} />
              4K Tour
            </span>
            <span style={{ fontWeight: 600, color: "var(--ink-primary)" }}>
              Full Technical Repo Walkthrough
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "var(--ink-muted)", fontSize: "0.82rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Clock size={14} /> 12:45 Total
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Volume2 size={14} /> Stereo
            </span>
            <Maximize2 size={14} style={{ cursor: "pointer" }} />
          </div>
        </div>

        {/* Player Viewport Area */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            backgroundColor: "#1A1C19",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "24px",
            boxSizing: "border-box",
          }}
        >
          {/* Top Info Overlay */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 2, flexWrap: "wrap", gap: "10px" }}>
            <div>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#C8933A",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Chapter {curr.id} of 4 • {curr.tagline}
              </span>
              <h3 style={{ color: "#FFFFFF", fontSize: "clamp(1.1rem, 2vw, 1.45rem)", marginTop: "4px" }}>
                {curr.title}
              </h3>
            </div>
            <span
              style={{
                padding: "4px 12px",
                borderRadius: "var(--radius-full)",
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                color: "#FFFFFF",
                fontSize: "0.82rem",
                fontFamily: "var(--font-mono)",
              }}
            >
              {curr.time}
            </span>
          </div>

          {/* Center Interactive Simulation / Diff */}
          <div
            style={{
              zIndex: 2,
              backgroundColor: "rgba(18, 20, 17, 0.94)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "var(--radius-md)",
              padding: "16px 20px",
              maxWidth: "680px",
              width: "100%",
              margin: "0 auto",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "6px" }}>
              <span style={{ fontSize: "0.76rem", color: "#A3A79E", fontFamily: "var(--font-mono)" }}>
                src/lib/nextflight-architecture.ts
              </span>
              <span style={{ fontSize: "0.72rem", color: "#34D399", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle2 size={12} /> VERIFIED BY AGENTS.MD
              </span>
            </div>
            <pre
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(0.72rem, 1.2vw, 0.86rem)",
                color: "#E5E7EB",
                lineHeight: 1.5,
                margin: 0,
                overflowX: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              <code>{curr.snippet}</code>
            </pre>
          </div>

          {/* Bottom Controls Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", zIndex: 2, flexWrap: "wrap" }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "#FFFFFF",
                color: "#181A18",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                transition: "transform 0.15s ease",
              }}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: "2px" }} />}
            </button>
            <p style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "0.88rem", margin: 0, flex: 1, minWidth: "200px" }}>
              {curr.desc}
            </p>
          </div>
        </div>

        {/* Chapter Tabs Strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            borderTop: "1px solid var(--border-stone)",
            backgroundColor: "var(--bg-canvas)",
          }}
        >
          {chapters.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => setActiveChapter(idx)}
              style={{
                padding: "16px 18px",
                textAlign: "left",
                backgroundColor: activeChapter === idx ? "var(--bg-card)" : "transparent",
                border: "none",
                borderRight: idx < chapters.length - 1 ? "1px solid var(--border-stone)" : "none",
                borderBottom: activeChapter === idx ? "3px solid #242817" : "none",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: activeChapter === idx ? "#242817" : "var(--ink-muted)" }}>
                  {ch.time}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    backgroundColor: activeChapter === idx ? "#242817" : "var(--border-stone)",
                    color: activeChapter === idx ? "#FFFFFF" : "var(--ink-secondary)",
                    fontWeight: 600,
                  }}
                >
                  Ch {ch.id}
                </span>
              </div>
              <p style={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--ink-primary)", margin: 0 }}>
                {ch.title}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
