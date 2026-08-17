"use client";

export default function Header({ onReset }: { onReset: () => void }) {
  return (
    <header
      style={{
        height: "72px",
        borderBottom: "1px solid var(--line)",
        background: "var(--paper-raised)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 42px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Lens mark: a simple aperture/viewfinder glyph tying to the name */}
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="9" stroke="var(--focus)" strokeWidth="1.6" />
          <circle cx="11" cy="11" r="2.6" fill="var(--focus)" />
          <path d="M11 1v3.4M11 17.6V21M21 11h-3.4M4.4 11H1" stroke="var(--focus)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>

        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "19px",
              fontWeight: 700,
              letterSpacing: "-0.3px",
              color: "var(--ink)",
            }}
          >
            SpecLens
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--graphite-light)",
              letterSpacing: "0.04em",
              marginTop: "1px",
            }}
          >
            IDEA → PRD → MVP
          </div>
        </div>
      </div>

      <button
        onClick={onReset}
        style={{
          border: "1px solid var(--line-strong)",
          background: "var(--paper-raised)",
          borderRadius: "var(--radius-sm)",
          padding: "9px 14px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--ink)",
        }}
      >
        New Product
      </button>
    </header>
  );
}
