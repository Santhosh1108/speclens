"use client";

import { useState } from "react";

export default function PrototypePanel({ prototype }: { prototype: any }) {
  const [copied, setCopied] = useState(false);

  function openFullscreen() {
    const blob = new Blob([prototype.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) URL.revokeObjectURL(url);
  }

  async function copyForFigma() {
    const payload = JSON.stringify(prototype.prototype, null, 2);

    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Clipboard copy failed:", error);
    }
  }

  return (
    <section style={{ marginTop: "45px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "18px", gap: "20px" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10.5px", fontWeight: 600, letterSpacing: "0.08em", color: "var(--focus)", marginBottom: "7px", textTransform: "uppercase" }}>
            GENERATED MVP
          </div>
          <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "28px", letterSpacing: "-0.6px", fontWeight: 700, color: "var(--ink)" }}>
            Your prototype is ready.
          </h2>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={copyForFigma} style={{ background: copied ? "var(--ok-soft)" : "var(--paper-raised)", border: `1px solid ${copied ? "var(--ok)" : "var(--line-strong)"}`, borderRadius: "var(--radius-sm)", padding: "10px 14px", cursor: "pointer", fontSize: "13px", fontWeight: 500, color: copied ? "var(--ok)" : "var(--ink)" }}>
            {copied ? "Copied ✓" : "Copy for Figma"}
          </button>

          <button onClick={openFullscreen} style={{ background: "var(--paper-raised)", border: "1px solid var(--line-strong)", borderRadius: "var(--radius-sm)", padding: "10px 14px", cursor: "pointer", fontSize: "13px", fontWeight: 500, color: "var(--ink)" }}>
            Open Fullscreen ↗
          </button>
        </div>
      </div>

      <div className="focus-frame" style={{ background: "var(--paper-raised)", border: "1px solid var(--line-strong)", borderRadius: "var(--radius-lg)", padding: "10px", boxShadow: "0 12px 32px rgba(18,20,28,0.06)" }}>
        <iframe
          srcDoc={prototype.html}
          title="Generated MVP Prototype"
          sandbox="allow-scripts"
          referrerPolicy="no-referrer"
          style={{ width: "100%", height: "720px", border: "none", borderRadius: "8px", background: "#fff" }}
        />
      </div>
    </section>
  );
}
