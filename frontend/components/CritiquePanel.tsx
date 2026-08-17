"use client";

import { SectionHeading } from "./ui";

const SEVERITY_COLORS: Record<string, { bg: string; fg: string }> = {
  high: { bg: "var(--danger-soft)", fg: "var(--danger)" },
  medium: { bg: "var(--warn-soft)", fg: "var(--warn)" },
  low: { bg: "var(--focus-soft)", fg: "var(--focus)" },
};

export default function CritiquePanel({ critique }: { critique: any }) {
  const scoreColor =
    critique.overall_score >= 75
      ? "var(--ok)"
      : critique.overall_score >= 50
      ? "var(--warn)"
      : "var(--danger)";

  return (
    <section style={{ marginTop: "38px" }}>
      <SectionHeading eyebrow="AI REVIEW" title="PRD Critique" />

      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "22px" }}>
        <div
          style={{
            background: "var(--ink)",
            color: "#fff",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            height: "fit-content",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10.5px",
              opacity: 0.65,
              marginBottom: "8px",
              letterSpacing: "0.06em",
            }}
          >
            SCORE
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "46px",
              fontWeight: 700,
              lineHeight: 1,
              color: scoreColor,
            }}
          >
            {critique.overall_score}
          </div>
          <div style={{ marginTop: "5px", opacity: 0.65, fontSize: "12px" }}>/ 100</div>
        </div>

        <div
          style={{
            background: "var(--paper-raised)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
          }}
        >
          <p style={{ marginTop: 0, lineHeight: 1.6, color: "var(--ink-soft)" }}>
            {critique.summary}
          </p>

          {critique.strengths?.length > 0 && (
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "15px" }}>
                Strengths
              </h3>
              <ul style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--ink-soft)" }}>
                {critique.strengths.map((item: string, index: number) => (
                  <li key={index} style={{ marginBottom: "8px" }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {critique.issues?.length > 0 && (
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "15px" }}>
                Improvements
              </h3>
              {critique.issues.map((issue: any, index: number) => {
                const color = SEVERITY_COLORS[issue.severity] || SEVERITY_COLORS.medium;
                return (
                  <div
                    key={index}
                    style={{
                      borderTop: "1px solid var(--line)",
                      padding: "14px 0",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        padding: "3px 8px",
                        borderRadius: "999px",
                        background: color.bg,
                        color: color.fg,
                        textTransform: "uppercase",
                        marginRight: "8px",
                      }}
                    >
                      {issue.severity}
                    </span>
                    <strong style={{ fontSize: "13px", color: "var(--ink)" }}>
                      {issue.category}
                    </strong>
                    <p style={{ margin: "8px 0 4px", color: "var(--ink-soft)" }}>
                      {issue.issue}
                    </p>
                    <small style={{ color: "var(--graphite)" }}>
                      Suggested: {issue.suggestion}
                    </small>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
