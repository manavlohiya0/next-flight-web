"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Bot,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Loader2,
  Star,
  Check,
  Layers,
  HelpCircle,
} from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { VideoWalkthrough } from "@/components/VideoWalkthrough";
import { InteractiveCalculator } from "@/components/InteractiveCalculator";
import { AgentPlayground } from "@/components/AgentPlayground";
import { BentoShowcase } from "@/components/BentoShowcase";
import { WallOfLove } from "@/components/WallOfLove";
import { StickyFloatingBar } from "@/components/StickyFloatingBar";
import { ScrollCanvasBackground } from "@/components/ScrollCanvasBackground";
import { ThemeToggle, ThemeMode } from "@/components/ThemeToggle";
import { FileTreeShowcase } from "@/components/FileTreeShowcase";

export default function LandingPage() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("day");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Connecting to Lemon Squeezy checkout...");
      }
    } catch {
      alert("Checkout error. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflowX: "clip", width: "100%" }}>
      {/* 3D Scroll-Driven Mountain Hyperlapse Canvas */}
      <ScrollCanvasBackground themeMode={themeMode} onTransitionChange={setIsTransitioning} />

      {/* 1. Spacious Editorial Navigation Header */}
      <header className="nav-header">
        <div className="nav-bar">
          <Link href="/" className="brand-wrap">
            <span>NextFlight</span>
          </Link>

          {/* Clean 3-anchor menu */}
          <nav aria-label="Main Navigation">
            <ul className="nav-menu">
              <li><a href="#features" className="nav-item-link">Architecture</a></li>
              <li><a href="#simulator" className="nav-item-link">AI Simulator</a></li>
              <li><a href="#pricing" className="nav-item-link">Pricing</a></li>
            </ul>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ThemeToggle mode={themeMode} isTransitioning={isTransitioning} onChange={setThemeMode} />
            <Link
              href="/claim"
              className="btn-ghost hide-mobile"
              style={{ padding: "8px 14px", fontSize: "0.85rem" }}
            >
              Claim Repo
            </Link>
            <a
              href="#pricing"
              className="btn-primary"
              style={{ padding: "8px 14px", fontSize: "0.82rem" }}
            >
              Get Access
            </a>
          </div>
        </div>
      </header>

      {/* 2. Hero Section: Editorial & Warm High-Trust Craft */}
      <section style={{ paddingTop: "100px", paddingBottom: "90px", textAlign: "center", position: "relative" }}>
        <div className="container">
          {/* Social Proof Pill (Unive.ai style) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: "flex", justifyContent: "center", marginBottom: "26px" }}
          >
            <div className="social-proof-pill">
              <div className="avatar-stack">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="Founder" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" alt="Founder" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80" alt="Founder" />
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80" alt="Founder" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", color: "var(--accent-brass)" }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </div>
                <span className="social-proof-text">
                  <strong>4.9/5</strong> from 820+ founders
                </span>
              </div>
            </div>
          </motion.div>

          {/* Main Title: Newsreader Editorial Serif */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              maxWidth: "960px",
              margin: "0 auto 26px",
              color: "var(--ink-primary)",
              lineHeight: 1.14,
            }}
          >
            The Next.js 15.5 SaaS starter built for founders who build with AI.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
              color: "var(--ink-secondary)",
              maxWidth: "720px",
              margin: "0 auto 34px",
              lineHeight: 1.65,
            }}
          >
            Build, ship, and monetize production applications with Antigravity, Cursor, and Claude Code. Multi-tenancy, hardware passkeys, and instant automated GitHub repository delivery.
          </motion.p>

          {/* [PRICE PLACE 1 OF 2] Early Access Price Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 18px",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-stone)",
                fontSize: "0.86rem",
                color: "var(--ink-secondary)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <Sparkles size={14} style={{ color: "var(--accent-brass)" }} />
              <span>
                Launch Offer:{" "}
                <span style={{ textDecoration: "line-through", opacity: 0.55, marginRight: "4px" }}>$199</span>
                <strong style={{ color: "var(--brand-forest)", fontWeight: 700 }}>$99.50</strong>{" "}
                <span style={{ color: "var(--accent-emerald)", fontWeight: 600 }}>(50% Off Lifetime)</span>
              </span>
            </span>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "16px",
              marginBottom: "46px",
            }}
          >
            <a
              href="#pricing"
              className="btn-primary"
              style={{ fontSize: "1.02rem", padding: "15px 36px" }}
            >
              Get Instant Access
              <ArrowRight size={17} />
            </a>
            <a
              href="#demo"
              className="btn-ghost"
              style={{ fontSize: "1.02rem", padding: "15px 28px" }}
            >
              Watch Founder Video Tour
            </a>
          </motion.div>

          {/* Metrics Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "28px",
              backgroundColor: "var(--bg-card)",
              backdropFilter: "blur(8px)",
              border: "1px solid var(--border-stone)",
              borderRadius: "var(--radius-full)",
              padding: "10px 28px",
              flexWrap: "wrap",
              justifyContent: "center",
              fontSize: "0.86rem",
              color: "var(--ink-secondary)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Check size={14} style={{ color: "var(--accent-emerald)" }} />
              <span><strong style={{ color: "var(--ink-primary)" }}>450+</strong> Repos Delivered</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Check size={14} style={{ color: "var(--accent-emerald)" }} />
              <span><strong style={{ color: "var(--ink-primary)" }}>100%</strong> Automated Delivery</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Check size={14} style={{ color: "var(--accent-emerald)" }} />
              <span><strong style={{ color: "var(--ink-primary)" }}>120h</strong> Saved / Project</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Tech Stack Pills (Strictly Contained with Defensive Wrapping) */}
      <section style={{ padding: "20px 0 60px" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-muted)", marginBottom: "20px", fontWeight: 600 }}>
            Production Tech Stack Vetted by Senior Engineers
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", maxWidth: "920px", margin: "0 auto" }}>
            {[
              "Next.js 15.5 App Router",
              "TypeScript 5.7 Strict",
              "Better-Auth (2FA & Passkeys)",
              "PostgreSQL & Prisma",
              "Lemon Squeezy (MoR)",
              "Resend Transactional Emails",
              "AGENTS.md Agent Rules",
              "Zod Runtime Validation",
              "Sliding-Window Rate Limiter",
            ].map((t) => (
              <span key={t} className="tag-badge">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Section: Founder Masterclass Video Walkthrough */}
      <section id="demo" style={{ padding: "100px 0" }}>
        <div className="container">
          <VideoWalkthrough />
        </div>
      </section>

      {/* 5. Section: Interactive AI Agent Simulator */}
      <section id="simulator" style={{ padding: "110px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 42px" }}>
            <div className="status-pill" style={{ marginBottom: "14px" }}>
              <Bot size={14} style={{ color: "var(--accent-brass)" }} />
              <span>Interactive Agent Simulator</span>
            </div>
            <h2 style={{ marginBottom: "12px" }}>
              Test Autonomous AI Coding Live
            </h2>
            <p style={{ fontSize: "1.05rem" }}>
              See how our AGENTS.md blueprint guides AI agents to write production-ready code with zero hallucinations.
            </p>
          </div>

          <AgentPlayground />
        </div>
      </section>

      {/* 6. Section: Bento Grid Features */}
      <section id="features" style={{ padding: "110px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 42px" }}>
            <div className="status-pill" style={{ marginBottom: "14px" }}>
              <Zap size={14} style={{ color: "var(--accent-brass)" }} />
              <span>Production Architecture</span>
            </div>
            <h2 style={{ marginBottom: "12px" }}>
              Everything Pre-Built for Scale
            </h2>
            <p style={{ fontSize: "1.05rem" }}>
              Every feature you need to launch, monetize, and protect your micro-SaaS application.
            </p>
          </div>

          <BentoShowcase />
          <FileTreeShowcase />
        </div>
      </section>

      {/* 7. Section: Interactive ROI Calculator */}
      <section id="roi" style={{ padding: "100px 0" }}>
        <div className="container">
          <InteractiveCalculator />
        </div>
      </section>

      {/* 8. Section: Comparison Matrix (Paper Scroll-Safe Table) */}
      <section id="compare" style={{ padding: "110px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 38px" }}>
            <div className="status-pill" style={{ marginBottom: "14px" }}>
              <Layers size={14} style={{ color: "var(--accent-brass)" }} />
              <span>ROI Comparison</span>
            </div>
            <h2 style={{ marginBottom: "12px" }}>
              Why Developers Choose NextFlight
            </h2>
            <p style={{ fontSize: "1.05rem" }}>
              Save 3 weeks of grueling plumbing for less than the cost of a single contractor hour.
            </p>
          </div>

          <div className="table-scroll-wrap">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: "34%" }}>Feature</th>
                  <th style={{ width: "24%", backgroundColor: "var(--bg-card)", color: "var(--brand-forest)", borderLeft: "2px solid var(--accent-brass)" }}>
                    NextFlight
                  </th>
                  <th style={{ width: "21%" }}>Scratch Development</th>
                  <th style={{ width: "21%" }}>$300+ Legacy Kits</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>License Model</td>
                  <td style={{ backgroundColor: "rgba(200, 147, 58, 0.06)", fontWeight: 700, color: "var(--brand-forest)", borderLeft: "2px solid var(--accent-brass)" }}>
                    Lifetime Access
                  </td>
                  <td style={{ color: "var(--ink-secondary)" }}>~$6,000+ dev time</td>
                  <td style={{ color: "var(--ink-secondary)" }}>$299 – $499</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Setup Time</td>
                  <td style={{ backgroundColor: "rgba(200, 147, 58, 0.06)", fontWeight: 700, color: "var(--accent-emerald)", borderLeft: "2px solid var(--accent-brass)" }}>
                    5 Minutes
                  </td>
                  <td style={{ color: "var(--ink-secondary)" }}>120+ Hours</td>
                  <td style={{ color: "var(--ink-secondary)" }}>2-4 Hours</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>AI Coding Agent Blueprint</td>
                  <td style={{ backgroundColor: "rgba(200, 147, 58, 0.06)", fontWeight: 700, color: "var(--brand-forest)", borderLeft: "2px solid var(--accent-brass)" }}>
                    Pre-tuned AGENTS.md & Rules
                  </td>
                  <td style={{ color: "var(--ink-secondary)" }}>None (High Hallucinations)</td>
                  <td style={{ color: "var(--ink-secondary)" }}>Generic Prompts</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Automated GitHub Repo Invite</td>
                  <td style={{ backgroundColor: "rgba(200, 147, 58, 0.06)", fontWeight: 700, color: "var(--accent-emerald)", borderLeft: "2px solid var(--accent-brass)" }}>
                    Instant via Lemon Squeezy Webhook
                  </td>
                  <td style={{ color: "var(--ink-secondary)" }}>Manual</td>
                  <td style={{ color: "var(--ink-secondary)" }}>Varies</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Merchant of Record (Global Tax)</td>
                  <td style={{ backgroundColor: "rgba(200, 147, 58, 0.06)", fontWeight: 700, color: "var(--brand-forest)", borderLeft: "2px solid var(--accent-brass)" }}>
                    Included (Lemon Squeezy)
                  </td>
                  <td style={{ color: "var(--ink-secondary)" }}>Complex tax setup</td>
                  <td style={{ color: "var(--ink-secondary)" }}>Depends on kit</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>2FA, Passkeys & RBAC</td>
                  <td style={{ backgroundColor: "rgba(200, 147, 58, 0.06)", fontWeight: 700, color: "var(--brand-forest)", borderLeft: "2px solid var(--accent-brass)" }}>
                    Included
                  </td>
                  <td style={{ color: "var(--ink-secondary)" }}>Days to implement</td>
                  <td style={{ color: "var(--ink-secondary)" }}>Included</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Multi-Tenant Organizations</td>
                  <td style={{ backgroundColor: "rgba(200, 147, 58, 0.06)", fontWeight: 700, color: "var(--brand-forest)", borderLeft: "2px solid var(--accent-brass)" }}>
                    Included
                  </td>
                  <td style={{ color: "var(--ink-secondary)" }}>Weeks to implement</td>
                  <td style={{ color: "var(--ink-secondary)" }}>Included</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 9. Section: Wall of Love */}
      <section id="reviews" style={{ padding: "100px 0" }}>
        <div className="container">
          <WallOfLove />
        </div>
      </section>

      {/* 10. [PRICE PLACE 2 OF 2] Main Pricing Section */}
      <section id="pricing" style={{ padding: "120px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 38px" }}>
            <div className="status-pill" style={{ marginBottom: "14px" }}>
              <Sparkles size={14} style={{ color: "var(--accent-brass)" }} />
              <span>Simple, Transparent Pricing</span>
            </div>
            <h2 style={{ marginBottom: "12px" }}>
              One Payment. Lifetime Access.
            </h2>
            <p style={{ fontSize: "1.05rem" }}>
              No subscriptions. No seat limits. Unlimited personal and commercial applications.
            </p>
          </div>

          <div
            className="paper-card"
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              padding: "44px 36px",
              position: "relative",
              textAlign: "center",
              border: "1px solid var(--border-stone)",
              boxShadow: "var(--shadow-card)",
              backgroundColor: "var(--bg-card)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "-14px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "var(--brand-forest)",
                color: "var(--bg-canvas)",
                padding: "5px 18px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              50% Launch Discount
            </span>

            <h3 style={{ fontSize: "1.55rem", marginTop: "8px", color: "var(--ink-primary)" }}>
              The Complete NextFlight License
            </h3>
            <p style={{ color: "var(--ink-secondary)", fontSize: "0.92rem", marginTop: "8px" }}>
              Everything you need to ship a production-ready SaaS with AI coding agents.
            </p>

            {/* Price Display: $199 strikethrough and $99.50 */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: "6px", margin: "28px 0 8px", flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)",
                  fontWeight: 600,
                  color: "var(--ink-muted)",
                  textDecoration: "line-through",
                  opacity: 0.6,
                  marginRight: "4px",
                }}
              >
                $199
              </span>
              <span style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--ink-primary)" }}>$</span>
              <span style={{ fontSize: "clamp(2.6rem, 7vw, 3.8rem)", fontWeight: 800, color: "var(--ink-primary)", fontFamily: "var(--font-sans)", lineHeight: 1 }}>
                99.50
              </span>
              <span style={{ fontSize: "0.92rem", color: "var(--ink-muted)", marginLeft: "4px" }}>/ one-time</span>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontSize: "0.82rem", color: "var(--accent-emerald)", fontWeight: 600, backgroundColor: "rgba(21, 128, 61, 0.08)", padding: "3px 12px", borderRadius: "var(--radius-full)" }}>
                Save $99.50 • Early Bird Lifetime License
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "1.05rem",
                marginBottom: "12px",
              }}
            >
              {checkoutLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Connecting to Lemon Squeezy...
                </>
              ) : (
                <>
                  Get Instant GitHub Access
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <p style={{ color: "var(--ink-muted)", fontSize: "0.8rem", marginBottom: "28px" }}>
              Processed securely via Lemon Squeezy • Automated GitHub invite • 14-day guarantee
            </p>

            <ul style={{ listStyle: "none", textAlign: "left", display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid var(--border-stone)", paddingTop: "24px", marginBottom: "24px" }}>
              {[
                { title: "Private GitHub Repo Access", desc: "Clone and fork with full commit history" },
                { title: "Pre-Tuned AI Agent Specs", desc: "AGENTS.md and .cursorrules" },
                { title: "Next.js 15.5 & React 19", desc: "App Router with Turbopack & TypeScript" },
                { title: "Complete Authentication", desc: "2FA, Passkeys, Magic links, Social OAuth" },
                { title: "Multi-Tenant Organizations", desc: "Workspaces, Team invites, Member roles" },
                { title: "Lemon Squeezy Billing", desc: "Checkout, Webhooks, Customer Portal" },
                { title: "Security Hardened", desc: "CSRF protection, Sliding rate limit, Zod schemas" },
                { title: "Unlimited Projects", desc: "Build as many client or personal apps as you want" },
                { title: "Free Lifetime Updates", desc: "Access new features and framework upgrades" },
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.88rem" }}>
                  <CheckCircle2 size={18} style={{ color: "var(--accent-emerald)", flexShrink: 0, marginTop: "2px" }} />
                  <span>
                    <strong style={{ color: "var(--ink-primary)" }}>{item.title}:</strong>{" "}
                    <span style={{ color: "var(--ink-secondary)" }}>{item.desc}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div
              style={{
                borderTop: "1px solid var(--border-stone)",
                paddingTop: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                color: "var(--ink-secondary)",
                fontSize: "0.85rem",
              }}
            >
              <GithubIcon size={15} style={{ color: "var(--ink-primary)" }} />
              <span>Already purchased? <Link href="/claim" style={{ color: "var(--brand-forest)", fontWeight: 600, textDecoration: "underline" }}>Claim your GitHub invite</Link></span>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ Section */}
      <section id="faq" style={{ padding: "100px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 40px" }}>
            <div className="status-pill" style={{ marginBottom: "14px" }}>
              <HelpCircle size={14} style={{ color: "var(--accent-brass)" }} />
              <span>Got Questions?</span>
            </div>
            <h2 style={{ marginBottom: "12px" }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ maxWidth: "760px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              {
                q: "How do I receive access to the boilerplate code?",
                a: "Immediately upon completing checkout with Lemon Squeezy, our automated webhook calls the GitHub REST API and sends a collaborator invitation to your GitHub username. You can also visit /claim at any time to trigger or re-send the invite.",
              },
              {
                q: "Do I need an account or login on this website?",
                a: "No! There is zero user registration required. Simply complete checkout, provide your email for receipt and GitHub username for repo access, and you're ready to clone and build.",
              },
              {
                q: "Can I use this for commercial or client projects?",
                a: "Yes. The lifetime license grants you rights to build and deploy unlimited personal, commercial, and client SaaS applications. You own 100% of the intellectual property you build on top of NextFlight.",
              },
              {
                q: "Why Lemon Squeezy over Stripe?",
                a: "Lemon Squeezy acts as a Merchant of Record (MoR), which means they handle all global sales taxes, EU VAT compliance, and localized invoicing on your behalf automatically.",
              },
              {
                q: "What AI coding tools does this work with?",
                a: "It includes dedicated configuration and system prompts for Google Antigravity, Cursor, Windsurf, Claude Code, GitHub Copilot, and any LLM that reads AGENTS.md or .cursorrules.",
              },
              {
                q: "What database does it use?",
                a: "It uses PostgreSQL with Prisma ORM (ready for Supabase, Neon, AWS RDS, or local Docker). Switching to Drizzle or another SQL database is effortless thanks to modular repository layers.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => toggleFaq(idx)}
                className="paper-card"
                style={{
                  padding: "20px 24px",
                  cursor: "pointer",
                  backgroundColor: "var(--bg-card)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontWeight: 600, fontSize: "0.98rem", color: "var(--ink-primary)" }}>
                  <span>{item.q}</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: openFaq === idx ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                      color: "var(--ink-secondary)",
                      flexShrink: 0,
                      marginLeft: "12px",
                    }}
                  />
                </div>
                {openFaq === idx && (
                  <p style={{ marginTop: "14px", fontSize: "0.92rem", color: "var(--ink-secondary)", lineHeight: 1.65 }}>
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Sticky Floating Dock */}
      <StickyFloatingBar />

      {/* 13. Approachable Footer */}
      <footer className="site-footer">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
            <div>
              <div className="brand-wrap" style={{ marginBottom: "8px" }}>
                <span>NextFlight</span>
              </div>
              <p style={{ color: "var(--ink-muted)", fontSize: "0.88rem" }}>
                The full-stack autonomous SaaS engine for modern founders building with AI.
              </p>
            </div>

            <ul style={{ display: "flex", gap: "28px", listStyle: "none", flexWrap: "wrap" }}>
              <li><a href="#features" className="nav-item-link">Architecture</a></li>
              <li><a href="#simulator" className="nav-item-link">AI Simulator</a></li>
              <li><a href="#pricing" className="nav-item-link">Pricing</a></li>
              <li><Link href="/claim" className="nav-item-link">Claim Repo</Link></li>
            </ul>
          </div>

          <div
            style={{
              marginTop: "40px",
              paddingTop: "24px",
              borderTop: "1px solid var(--border-stone)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "0.82rem",
              color: "var(--ink-muted)",
            }}
          >
            <span>© {new Date().getFullYear()} NextFlight. All rights reserved.</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--accent-emerald)" }} />
              <span>Automated GitHub Delivery: Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
