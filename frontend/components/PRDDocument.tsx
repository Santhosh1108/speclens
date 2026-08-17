"use client";

/**
 * Rich, presentation-ready in-app PRD view.
 * Renders the AI-expanded product_state (not raw markdown) as styled
 * sections/tables matching the app's existing minimalist design
 * language, plus a "Download Word" action that hits the backend's
 * /api/export-prd-docx endpoint and saves the returned .docx.
 */

import { useState } from "react";

type Requirement = {
  description: string;
  type: string;
  priority: "must" | "should" | "could" | "wont";
};

type UserStory = { actor: string; action: string; goal: string };
type AcceptanceCriterion = { description: string };
type SuccessMetric = { name: string; target: string };
type Risk = { description: string; mitigation: string; severity: "high" | "medium" | "low" };
type RoadmapPhase = { name: string; description: string };

export type ProductState = {
  product?: string;
  problem?: string;
  users?: string[];
  current_context?: string[];
  goals?: string[];
  mvp_scope?: string[];
  out_of_scope?: string[];
  requirements?: Requirement[];
  non_functional_requirements?: string[];
  user_stories?: UserStory[];
  acceptance_criteria?: AcceptanceCriterion[];
  edge_cases?: string[];
  success_metrics?: SuccessMetric[];
  risks?: Risk[];
  roadmap?: RoadmapPhase[];
  open_questions?: string[];
};

const PRIORITY_COLORS: Record<string, { bg: string; fg: string }> = {
  must: { bg: "#fde8e8", fg: "#c0392b" },
  should: { bg: "#fdf3e0", fg: "#b8790a" },
  could: { bg: "#e6f0fb", fg: "#2e6bc1" },
  wont: { bg: "#eee", fg: "#777" },
};

const SEVERITY_COLORS: Record<string, { bg: string; fg: string }> = {
  high: { bg: "#fde8e8", fg: "#c0392b" },
  medium: { bg: "#fdf3e0", fg: "#b8790a" },
  low: { bg: "#e6f0fb", fg: "#2e6bc1" },
};

function Badge({ text, color }: { text: string; color: { bg: string; fg: string } }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: "10px",
        fontWeight: 750,
        letterSpacing: "0.4px",
        padding: "3px 8px",
        borderRadius: "999px",
        background: color.bg,
        color: color.fg,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e1e1e1",
        borderRadius: "14px",
        padding: "26px",
        marginBottom: "18px",
      }}
    >
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        margin: "0 0 14px",
        fontSize: "16px",
        fontWeight: 750,
        letterSpacing: "-0.3px",
      }}
    >
      {children}
    </h3>
  );
}

function BulletList({ items, empty = "Not specified" }: { items?: string[]; empty?: string }) {
  const valid = Array.isArray(items) ? items.filter(Boolean) : [];
  if (valid.length === 0) {
    return <div style={{ fontSize: "13px", color: "#bbb" }}>{empty}</div>;
  }
  return (
    <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "14px", lineHeight: 1.7 }}>
      {valid.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function Table({
  columns,
  rows,
  empty = "Not specified",
}: {
  columns: string[];
  rows: React.ReactNode[][];
  empty?: string;
}) {
  if (rows.length === 0) {
    return <div style={{ fontSize: "13px", color: "#bbb" }}>{empty}</div>;
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col}
              style={{
                textAlign: "left",
                fontSize: "10px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                color: "#999",
                borderBottom: "1px solid #eee",
                padding: "0 10px 8px 0",
                fontWeight: 750,
              }}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td
                key={j}
                style={{
                  padding: "10px 10px 10px 0",
                  borderBottom: "1px solid #f3f3f3",
                  verticalAlign: "top",
                  lineHeight: 1.5,
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function PRDDocument({
  product,
  onDownloadDocx,
}: {
  product: ProductState;
  onDownloadDocx?: () => Promise<void>;
}) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!onDownloadDocx || downloading) return;
    setDownloading(true);
    try {
      await onDownloadDocx();
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "16px",
          marginBottom: "22px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 750,
              letterSpacing: "1px",
              color: "#777",
              marginBottom: "6px",
            }}
          >
            PRODUCT REQUIREMENTS DOCUMENT
          </div>
          <h2 style={{ margin: 0, fontSize: "28px", letterSpacing: "-0.8px" }}>
            {product.product || "Untitled Product"}
          </h2>
        </div>

        {onDownloadDocx && (
          <button
            onClick={handleDownload}
            disabled={downloading}
            style={{
              background: "#171717",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "11px 16px",
              fontWeight: 650,
              cursor: downloading ? "wait" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {downloading ? "Preparing..." : "Download Word ↓"}
          </button>
        )}
      </div>

      {/* Problem */}
      <Card>
        <CardTitle>Problem</CardTitle>
        <div style={{ fontSize: "14px", lineHeight: 1.7, color: product.problem ? "#222" : "#bbb" }}>
          {product.problem || "Not specified"}
        </div>
      </Card>

      {/* Users / Context / Goals — 3-up */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "18px",
          marginBottom: "0px",
        }}
      >
        <Card>
          <CardTitle>Target Users</CardTitle>
          <BulletList items={product.users} />
        </Card>
        <Card>
          <CardTitle>Current Context</CardTitle>
          <BulletList items={product.current_context} />
        </Card>
        <Card>
          <CardTitle>Goals</CardTitle>
          <BulletList items={product.goals} />
        </Card>
      </div>

      {/* MVP scope / Out of scope */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "18px",
        }}
      >
        <Card>
          <CardTitle>MVP Scope</CardTitle>
          <BulletList items={product.mvp_scope} />
        </Card>
        <Card>
          <CardTitle>Out of Scope</CardTitle>
          <BulletList items={product.out_of_scope} />
        </Card>
      </div>

      {/* Requirements table */}
      <Card>
        <CardTitle>Requirements</CardTitle>
        <Table
          columns={["Priority", "Description", "Type"]}
          rows={(product.requirements || []).map((r) => [
            <Badge
              key="p"
              text={r.priority}
              color={PRIORITY_COLORS[r.priority] || PRIORITY_COLORS.must}
            />,
            r.description,
            r.type,
          ])}
        />
      </Card>

      <Card>
        <CardTitle>Non-Functional Requirements</CardTitle>
        <BulletList items={product.non_functional_requirements} />
      </Card>

      {/* User stories */}
      <Card>
        <CardTitle>User Stories</CardTitle>
        {(product.user_stories || []).length === 0 ? (
          <div style={{ fontSize: "13px", color: "#bbb" }}>Not specified</div>
        ) : (
          <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "14px", lineHeight: 1.8 }}>
            {product.user_stories!.map((s, i) => (
              <li key={i}>
                As a <strong>{s.actor}</strong>, I want to {s.action}, so that {s.goal}.
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Acceptance criteria / Edge cases */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "18px",
        }}
      >
        <Card>
          <CardTitle>Acceptance Criteria</CardTitle>
          <BulletList items={(product.acceptance_criteria || []).map((c) => c.description)} />
        </Card>
        <Card>
          <CardTitle>Edge Cases</CardTitle>
          <BulletList items={product.edge_cases} />
        </Card>
      </div>

      {/* Success metrics */}
      <Card>
        <CardTitle>Success Metrics</CardTitle>
        <Table
          columns={["Metric", "Target"]}
          rows={(product.success_metrics || []).map((m) => [m.name, m.target])}
        />
      </Card>

      {/* Risks */}
      <Card>
        <CardTitle>Risks & Mitigations</CardTitle>
        <Table
          columns={["Severity", "Risk", "Mitigation"]}
          rows={(product.risks || []).map((r) => [
            <Badge key="s" text={r.severity} color={SEVERITY_COLORS[r.severity] || SEVERITY_COLORS.medium} />,
            r.description,
            r.mitigation,
          ])}
        />
      </Card>

      {/* Roadmap */}
      <Card>
        <CardTitle>Roadmap</CardTitle>
        {(product.roadmap || []).length === 0 ? (
          <div style={{ fontSize: "13px", color: "#bbb" }}>Not specified</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {product.roadmap!.map((phase, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "14px",
                  padding: "12px 0",
                  borderTop: i > 0 ? "1px solid #f0f0f0" : "none",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 750,
                    color: "#fff",
                    background: "#171717",
                    borderRadius: "999px",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "2px" }}>
                    {phase.name}
                  </div>
                  <div style={{ fontSize: "13px", color: "#666", lineHeight: 1.6 }}>
                    {phase.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Open questions */}
      <Card>
        <CardTitle>Open Questions</CardTitle>
        <BulletList items={product.open_questions} empty="None" />
      </Card>
    </div>
  );
}
