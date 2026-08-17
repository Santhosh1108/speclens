"use client";

/** Shared low-level UI primitives, styled from the design tokens in globals.css. */

export function ActionButton({
  children,
  onClick,
  disabled,
  primary = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: primary ? "var(--ink)" : "var(--paper-raised)",
        color: primary ? "#fff" : "var(--ink)",
        border: primary ? "1px solid var(--ink)" : "1px solid var(--line-strong)",
        borderRadius: "var(--radius-sm)",
        padding: "11px 16px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        fontWeight: 600,
        fontSize: "13px",
        fontFamily: "var(--font-body)",
        transition: "transform 0.12s ease",
      }}
    >
      {children}
    </button>
  );
}

export function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div style={{ marginBottom: "18px" }}>
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
        {eyebrow}
      </div>
      <h2
        style={{
          margin: 0,
          fontFamily: "var(--font-display)",
          fontSize: "28px",
          letterSpacing: "-0.5px",
          fontWeight: 600,
          color: "var(--ink)",
        }}
      >
        {title}
      </h2>
    </div>
  );
}

export function SpecField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.06em",
          color: "var(--graphite-light)",
          textTransform: "uppercase",
          marginBottom: "5px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "13px",
          lineHeight: 1.5,
          color: value ? "var(--ink-soft)" : "var(--graphite-light)",
        }}
      >
        {value || "Not discovered yet"}
      </div>
    </div>
  );
}

export function SpecList({ label, items }: { label: string; items?: string[] }) {
  const validItems = Array.isArray(items) ? items.filter(Boolean) : [];

  return (
    <div style={{ marginBottom: "18px" }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.06em",
          color: "var(--graphite-light)",
          textTransform: "uppercase",
          marginBottom: "6px",
        }}
      >
        {label}
      </div>
      {validItems.length > 0 ? (
        <ul
          style={{
            margin: 0,
            paddingLeft: "18px",
            fontSize: "13px",
            lineHeight: 1.6,
            color: "var(--ink-soft)",
          }}
        >
          {validItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <div style={{ fontSize: "13px", color: "var(--graphite-light)" }}>
          Not discovered yet
        </div>
      )}
    </div>
  );
}

export function StepIndicator({
  number,
  label,
  active,
}: {
  number: string;
  label: string;
  active: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
        color: active ? "var(--ink)" : "var(--graphite-light)",
        fontWeight: active ? 700 : 500,
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
      }}
    >
      <span
        style={{
          fontSize: "10px",
          border: `1px solid ${active ? "var(--focus)" : "currentColor"}`,
          background: active ? "var(--focus)" : "transparent",
          color: active ? "#fff" : "currentColor",
          borderRadius: "50%",
          width: "23px",
          height: "23px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {number}
      </span>
      {label}
    </div>
  );
}

export const lineStyle = {
  width: "40px",
  height: "1px",
  background: "var(--line-strong)",
};

export function Card({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        background: "var(--paper-raised)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-lg)",
        padding: "24px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
