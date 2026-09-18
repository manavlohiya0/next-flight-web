"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Star, Loader2 } from "lucide-react";

export function StickyFloatingBar() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Only show after user has scrolled comfortably past the hero
      if (window.scrollY > 850) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
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
      alert("Connecting to Lemon Squeezy checkout...");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Quick Checkout Dock"
      style={{
        position: "fixed",
        bottom: "28px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 999,
        width: "92%",
        maxWidth: "500px",
        backgroundColor: "var(--bg-card)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid var(--border-stone)",
        borderRadius: "var(--radius-full)",
        padding: "8px 16px 8px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "var(--shadow-float)",
        boxSizing: "border-box",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "1.15rem", color: "var(--ink-primary)" }}>
          NextFlight
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.8rem", fontWeight: 600, color: "var(--ink-secondary)" }}>
          <Star size={13} fill="#F5B400" stroke="#F5B400" />
          <span>4.9/5 (820+ founders)</span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="btn-primary"
        style={{ padding: "8px 18px", fontSize: "0.85rem" }}
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <>
            Get Instant Access
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </aside>
  );
}
