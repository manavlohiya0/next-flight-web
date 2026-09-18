"use client";

import { Sun, Sparkles } from "lucide-react";

export type ThemeMode = "day" | "aurora";

interface ThemeToggleProps {
  mode: ThemeMode;
  isTransitioning?: boolean;
  onChange: (newMode: ThemeMode) => void;
}

export function ThemeToggle({ mode, isTransitioning = false, onChange }: ThemeToggleProps) {
  return (
    <div
      role="group"
      aria-label="Atmospheric mode switcher"
      style={{
        display: "inline-flex",
        alignItems: "center",
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-stone)",
        borderRadius: "var(--radius-full)",
        padding: "3px",
        gap: "3px",
        boxShadow: "var(--shadow-sm)",
        position: "relative",
      }}
    >
      {/* Daylight Mode Button */}
      <button
        type="button"
        onClick={() => onChange("day")}
        title="Daylight Parchment Mode"
        aria-pressed={mode === "day"}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          border: "none",
          backgroundColor: mode === "day" ? "var(--brand-forest)" : "transparent",
          color: mode === "day" ? "var(--bg-canvas)" : "var(--ink-secondary)",
          padding: "6px 14px",
          borderRadius: "var(--radius-full)",
          fontSize: "0.78rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <Sun size={13} />
        <span>Day</span>
      </button>

      {/* Aurora Night Mode Button */}
      <button
        type="button"
        onClick={() => onChange("aurora")}
        title="Aurora Hyperlapse Mode"
        aria-pressed={mode === "aurora"}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          border: "none",
          backgroundColor: mode === "aurora" ? "var(--brand-forest)" : "transparent",
          color: mode === "aurora" ? "var(--bg-canvas)" : "var(--ink-secondary)",
          padding: "6px 14px",
          borderRadius: "var(--radius-full)",
          fontSize: "0.78rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          position: "relative",
        }}
      >
        <Sparkles size={13} style={{ color: mode === "aurora" ? "inherit" : "var(--accent-brass)" }} />
        <span>Aurora</span>
        {isTransitioning && (
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#34D399",
              display: "inline-block",
              animation: "pulse 1s infinite alternate",
            }}
          />
        )}
      </button>
    </div>
  );
}
