"use client";

export default function Hero({
  message,
  setMessage,
  loading,
  onSubmit,
}: {
  message: string;
  setMessage: (v: string) => void;
  loading: boolean;
  onSubmit: () => void;
}) {
  return (
    <section
      className="grid-field"
      style={{
        maxWidth: "850px",
        margin: "60px auto 0",
        textAlign: "center",
        paddingTop: "10px",
        paddingBottom: "10px",
        borderRadius: "var(--radius-lg)",
      }}
    >
      <div
        style={{
          display: "inline-block",
          background: "var(--focus-soft)",
          color: "var(--focus)",
          borderRadius: "999px",
          padding: "6px 12px",
          fontFamily: "var(--font-mono)",
          fontSize: "10.5px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          marginBottom: "20px",
        }}
      >
        LOCAL AI PRODUCT BUILDER
      </div>

      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(38px, 6vw, 64px)",
          lineHeight: 1.05,
          letterSpacing: "-2px",
          margin: "0 0 20px",
          fontWeight: 700,
          color: "var(--ink)",
        }}
      >
        Bring your idea
        <br />
        into focus.
      </h1>

      <p
        style={{
          fontSize: "16px",
          color: "var(--graphite)",
          lineHeight: 1.65,
          maxWidth: "620px",
          margin: "0 auto 34px",
        }}
      >
        Describe what you want to build. SpecLens discovers the problem,
        structures the requirements, drafts a presentation-ready PRD,
        critiques it, and turns it into an MVP prototype.
      </p>

      <div
        className="focus-frame"
        style={{
          background: "var(--paper-raised)",
          border: "1px solid var(--line-strong)",
          borderRadius: "var(--radius-lg)",
          padding: "14px",
          boxShadow: "0 12px 32px rgba(18,20,28,0.06)",
        }}
      >
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            "What do you want to build?\n\nExample: I want to build a marketplace where students can find local tutors."
          }
          rows={5}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            resize: "vertical",
            fontSize: "15px",
            lineHeight: 1.6,
            padding: "10px",
            boxSizing: "border-box",
            fontFamily: "inherit",
            background: "transparent",
            color: "var(--ink)",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid var(--line)",
            paddingTop: "12px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--graphite-light)",
            }}
          >
            SpecLens will ask focused questions.
          </span>

          <button
            onClick={onSubmit}
            disabled={loading || !message.trim()}
            style={{
              background: "var(--ink)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-sm)",
              padding: "11px 19px",
              fontWeight: 600,
              fontSize: "13.5px",
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "Thinking..." : "Start Discovery →"}
          </button>
        </div>
      </div>
    </section>
  );
}
