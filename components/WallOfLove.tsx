"use client";

import { Star, CheckCircle2 } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  metrics: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Alex Rivers",
    role: "Full-Stack Engineer",
    company: "PromptCraft",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    content: "NextFlight's Next.js 15 App Router architecture and AGENTS.md specs are top-notch. I had a working multi-tenant SaaS deployed on Vercel with Lemon Squeezy in under 30 minutes!",
    metrics: "Shipped in 30 mins",
  },
  {
    name: "Joel Hernandez",
    role: "Founder & Solo Builder",
    company: "FlowBase AI",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    content: "The AGENTS.md blueprint alone is worth $500. Cursor and Antigravity build new endpoints without breaking schemas or inventing non-existent imports. An absolute game-changer.",
    metrics: "$18k MRR in 6 weeks",
  },
  {
    name: "Elena Rostova",
    role: "Technical Founder",
    company: "DocuSense SaaS",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    content: "The automated Lemon Squeezy checkout and instant GitHub repository invite was completely seamless. Zero friction for my customers and zero manual support tickets for me.",
    metrics: "450+ Active Users",
  },
];

export function WallOfLove() {
  return (
    <div style={{ maxWidth: "100%", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <div className="status-pill" style={{ marginBottom: "12px" }}>
          <Star size={14} style={{ color: "var(--accent-brass)" }} />
          <span>Real Stories • Verified Builders</span>
        </div>
        <h2 style={{ fontSize: "clamp(2rem, 3.4vw, 2.8rem)", marginBottom: "10px" }}>
          Loved by Over 820+ Solo Founders
        </h2>
        <p style={{ color: "var(--ink-secondary)", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto" }}>
          Here is what builders say after shipping real SaaS products with NextFlight.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="paper-card"
            style={{
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#F5B400" stroke="#F5B400" />
                  ))}
                </div>
                <span
                  style={{
                    backgroundColor: "var(--bg-canvas)",
                    border: "1px solid var(--border-stone)",
                    color: "var(--brand-forest)",
                    padding: "3px 10px",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.74rem",
                    fontWeight: 600,
                  }}
                >
                  {t.metrics}
                </span>
              </div>

              <p style={{ color: "var(--ink-primary)", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "24px" }}>
                &ldquo;{t.content}&rdquo;
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", borderTop: "1px solid var(--border-stone)", paddingTop: "16px" }}>
              <img
                src={t.avatar}
                alt={t.name}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid var(--border-stone)",
                }}
              />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontWeight: 600, color: "var(--ink-primary)", fontSize: "0.92rem" }}>
                    {t.name}
                  </span>
                  <CheckCircle2 size={13} style={{ color: "var(--accent-emerald)" }} />
                </div>
                <span style={{ color: "var(--ink-muted)", fontSize: "0.8rem" }}>
                  {t.role} • {t.company}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
