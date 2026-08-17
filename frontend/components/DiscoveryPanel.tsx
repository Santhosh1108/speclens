"use client";

import { SpecField, SpecList, ActionButton } from "./ui";

export default function DiscoveryPanel({
  reply,
  message,
  setMessage,
  loading,
  productState,
  onContinue,
  onGeneratePRD,
  onCritique,
  onGeneratePrototype,
  hasPrd,
}: {
  reply: string;
  message: string;
  setMessage: (v: string) => void;
  loading: boolean;
  productState: any;
  onContinue: () => void;
  onGeneratePRD: () => void;
  onCritique: () => void;
  onGeneratePrototype: () => void;
  hasPrd: boolean;
}) {
  return (
    <section>
      <div style={{ marginBottom: "26px" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10.5px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: "var(--focus)",
            marginBottom: "8px",
            textTransform: "uppercase",
          }}
        >
          PRODUCT DISCOVERY
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "32px",
            letterSpacing: "-1px",
            fontWeight: 700,
            margin: 0,
            color: "var(--ink)",
          }}
        >
          Shape the product.
        </h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 350px",
          gap: "22px",
          alignItems: "start",
        }}
      >
        {/* CHAT */}
        <div
          className="focus-frame"
          style={{
            background: "var(--paper-raised)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--graphite-light)",
              marginBottom: "10px",
              letterSpacing: "0.04em",
            }}
          >
            SPECLENS
          </div>

          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "19px",
              lineHeight: 1.4,
              fontWeight: 600,
              marginBottom: "25px",
              color: "var(--ink)",
            }}
          >
            {reply || "Tell me more about the product."}
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Answer the question..."
            rows={4}
            style={{
              width: "100%",
              boxSizing: "border-box",
              resize: "vertical",
              border: "1px solid var(--line-strong)",
              borderRadius: "var(--radius-sm)",
              padding: "12px",
              fontFamily: "inherit",
              outline: "none",
              color: "var(--ink)",
            }}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
            <button
              onClick={onContinue}
              disabled={loading || !message.trim()}
              style={{
                background: "var(--ink)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius-sm)",
                padding: "11px 18px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13.5px",
              }}
            >
              {loading ? "Thinking..." : "Continue →"}
            </button>
          </div>
        </div>

        {/* PRODUCT STATE */}
        <div
          style={{
            background: "var(--paper-raised)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-lg)",
            padding: "22px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10.5px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: "var(--graphite-light)",
              marginBottom: "18px",
              textTransform: "uppercase",
            }}
          >
            PRODUCT SPEC
          </div>

          <SpecField label="Product" value={productState.product} />
          <SpecField label="Problem" value={productState.problem} />
          <SpecList label="Users" items={productState.users} />
          <SpecList label="Context" items={productState.current_context} />
          <SpecList label="Goals" items={productState.goals} />
          <SpecList
            label="Requirements"
            items={productState.requirements?.map((x: any) => x.description)}
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "22px" }}>
        <ActionButton onClick={onGeneratePRD} disabled={loading} primary>
          {loading ? "Generating..." : "Generate PRD"}
        </ActionButton>

        <ActionButton onClick={onCritique} disabled={loading || !hasPrd}>
          Critique PRD
        </ActionButton>

        <ActionButton onClick={onGeneratePrototype} disabled={loading}>
          Generate MVP Prototype
        </ActionButton>
      </div>
    </section>
  );
}
