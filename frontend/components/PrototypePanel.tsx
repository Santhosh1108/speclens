"use client";

export default function PrototypePanel({ prototype }: { prototype: any }) {
  function openFullscreen() {
    const blob = new Blob([prototype.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  return (
    <section style={{ marginTop: "45px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "18px",
          gap: "20px",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10.5px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "var(--focus)",
              marginBottom: "7px",
              textTransform: "uppercase",
            }}
          >
            GENERATED MVP
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              letterSpacing: "-0.6px",
              fontWeight: 700,
              color: "var(--ink)",
            }}
          >
            Your prototype is ready.
          </h2>
        </div>

        <button
          onClick={openFullscreen}
          style={{
            background: "var(--paper-raised)",
            border: "1px solid var(--line-strong)",
            borderRadius: "var(--radius-sm)",
            padding: "10px 14px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--ink)",
          }}
        >
          Open Fullscreen ↗
        </button>
      </div>

      <div
        className="focus-frame"
        style={{
          background: "var(--paper-raised)",
          border: "1px solid var(--line-strong)",
          borderRadius: "var(--radius-lg)",
          padding: "10px",
          boxShadow: "0 12px 32px rgba(18,20,28,0.06)",
        }}
      >
        <iframe
          srcDoc={prototype.html}
          title="Generated MVP Prototype"
          style={{
            width: "100%",
            height: "720px",
            border: "none",
            borderRadius: "8px",
            background: "#fff",
          }}
        />
      </div>
    </section>
  );
}
