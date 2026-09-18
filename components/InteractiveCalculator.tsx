"use client";

import { useState } from "react";
import { Calculator, ArrowRight, DollarSign, Clock } from "lucide-react";

export function InteractiveCalculator() {
  const [hourlyRate, setHourlyRate] = useState(90);

  const hoursSaved = 120; // ~3 weeks of auth, security, db, payment plumbing
  const totalValue = hourlyRate * hoursSaved;
  const netSavings = totalValue - 100;
  const roiMultiple = Math.round(totalValue / 100);

  return (
    <div
      className="paper-card"
      style={{
        maxWidth: "840px",
        margin: "0 auto",
        padding: "36px 32px",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div className="status-pill" style={{ marginBottom: "12px" }}>
          <Calculator size={14} style={{ color: "var(--accent-brass)" }} />
          <span>Interactive Savings Calculator</span>
        </div>
        <h3 style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.2rem)", marginBottom: "8px" }}>
          Calculate Your Engineering Time Saved
        </h3>
        <p style={{ color: "var(--ink-secondary)", fontSize: "0.98rem", maxWidth: "600px", margin: "0 auto" }}>
          Building multi-tenancy, passkeys, and payment webhooks from scratch consumes 120+ senior developer hours.
        </p>
      </div>

      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "6px" }}>
          <label style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--ink-primary)" }}>
            Your Effective Hourly Rate:
          </label>
          <span
            style={{
              fontSize: "1.45rem",
              fontWeight: 700,
              color: "var(--ink-primary)",
              fontFamily: "var(--font-mono)",
            }}
          >
            ${hourlyRate}/hr
          </span>
        </div>

        <input
          type="range"
          min="40"
          max="250"
          step="5"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(Number(e.target.value))}
          style={{
            width: "100%",
            height: "8px",
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--border-stone)",
            outline: "none",
            accentColor: "var(--brand-forest)",
            cursor: "pointer",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--ink-muted)", marginTop: "8px" }}>
          <span>$40/hr (Junior / Bootstrapper)</span>
          <span>$100/hr (Senior Dev)</span>
          <span>$250/hr (Contractor)</span>
        </div>
      </div>

      {/* Results Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--bg-canvas)",
            border: "1px solid var(--border-stone)",
            borderRadius: "var(--radius-md)",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "0.78rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
            Time Saved
          </span>
          <p style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--ink-primary)", margin: "6px 0 0 0", fontFamily: "var(--font-mono)" }}>
            120 hrs
          </p>
          <span style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>~3 full weeks</span>
        </div>

        <div
          style={{
            backgroundColor: "var(--bg-canvas)",
            border: "1px solid var(--border-stone)",
            borderRadius: "var(--radius-md)",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "0.78rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
            Gross Dev Value
          </span>
          <p style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--ink-primary)", margin: "6px 0 0 0", fontFamily: "var(--font-mono)" }}>
            ${totalValue.toLocaleString()}
          </p>
          <span style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>at ${hourlyRate}/hr</span>
        </div>

        <div
          style={{
            backgroundColor: "var(--bg-canvas)",
            border: "1px solid var(--border-stone)",
            borderRadius: "var(--radius-md)",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "0.78rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
            Net ROI
          </span>
          <p style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--accent-emerald)", margin: "6px 0 0 0", fontFamily: "var(--font-mono)" }}>
            {roiMultiple}x
          </p>
          <span style={{ fontSize: "0.75rem", color: "var(--accent-emerald)", fontWeight: 600 }}>
            +${netSavings.toLocaleString()} value
          </span>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <a
          href="#pricing"
          className="btn-primary"
          style={{
            fontSize: "0.95rem",
            padding: "12px 24px",
            maxWidth: "100%",
            whiteSpace: "normal",
            textAlign: "center",
            display: "inline-flex",
          }}
        >
          <span>Save 120 Hours on Your Launch</span>
          <ArrowRight size={16} style={{ flexShrink: 0 }} />
        </a>
      </div>
    </div>
  );
}
