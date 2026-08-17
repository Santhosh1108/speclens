import json

from llm.ollama_client import ask_model
from schemas.product_model import ProductModel


def _expand_with_model(product: ProductModel) -> dict:
    """
    Uses the local LLM to turn the raw structured product state into a
    full, presentation-ready PRD narrative: proper prose for the sections
    that are just fragments today (problem framing, MVP scope, success
    metrics, risks, roadmap), while never inventing facts the user did
    not provide. Anything the model adds beyond verbatim user input is
    tagged as an assumption so the frontend/Word export can visually
    separate "stated by user" vs "AI-drafted".
    """

    prompt = f"""
You are a senior product manager turning a structured product state into
a polished, presentation-ready Product Requirements Document.

RULES:
- Do not contradict or discard any fact in PRODUCT STATE.
- You MAY draft reasonable, clearly-labeled professional phrasing for
  sections that are thin or empty (mvp_scope, out_of_scope,
  non_functional_requirements, success_metrics, risks, roadmap,
  edge_cases) based on what IS known, but never invent user counts,
  dates, budgets, or company names.
- Every generated item must be traceable to something in PRODUCT STATE.
- Keep language concise and professional, one PRD-ready sentence per item.

PRODUCT STATE:
{product.model_dump_json()}

Return ONLY valid JSON with exactly this structure:

{{
  "executive_summary": "2-3 sentence executive summary",
  "problem_narrative": "polished 2-4 sentence problem statement",
  "mvp_scope": ["short scope item", "..."],
  "out_of_scope": ["short item", "..."],
  "non_functional_requirements": ["short item", "..."],
  "success_metrics": [{{"name": "metric name", "target": "target value or description"}}],
  "risks": [{{"description": "risk", "mitigation": "mitigation", "severity": "high|medium|low"}}],
  "roadmap": [{{"name": "phase name", "description": "what happens in this phase"}}],
  "edge_cases": ["short item", "..."]
}}

Do not include explanations. Do not use markdown. Return JSON only.
"""

    result = ask_model(prompt)

    try:
        data = json.loads(result)
    except json.JSONDecodeError:
        start = result.find("{")
        end = result.rfind("}")
        if start == -1 or end == -1:
            return {}
        try:
            data = json.loads(result[start:end + 1])
        except json.JSONDecodeError:
            return {}

    return data if isinstance(data, dict) else {}


def _merge_generated(product: ProductModel, generated: dict) -> ProductModel:
    """Fill in only the fields the user hasn't already populated."""

    data = product.model_dump()

    if not data.get("mvp_scope") and generated.get("mvp_scope"):
        data["mvp_scope"] = [str(x) for x in generated["mvp_scope"]]

    if not data.get("out_of_scope") and generated.get("out_of_scope"):
        data["out_of_scope"] = [str(x) for x in generated["out_of_scope"]]

    if not data.get("non_functional_requirements") and generated.get(
        "non_functional_requirements"
    ):
        data["non_functional_requirements"] = [
            str(x) for x in generated["non_functional_requirements"]
        ]

    if not data.get("success_metrics") and generated.get("success_metrics"):
        data["success_metrics"] = [
            {"name": str(m.get("name", "")), "target": str(m.get("target", ""))}
            for m in generated["success_metrics"]
            if isinstance(m, dict) and m.get("name")
        ]

    if not data.get("risks") and generated.get("risks"):
        data["risks"] = [
            {
                "description": str(r.get("description", "")),
                "mitigation": str(r.get("mitigation", "")),
                "severity": r.get("severity", "medium")
                if r.get("severity") in ("high", "medium", "low")
                else "medium",
            }
            for r in generated["risks"]
            if isinstance(r, dict) and r.get("description")
        ]

    if not data.get("roadmap") and generated.get("roadmap"):
        data["roadmap"] = [
            {"name": str(r.get("name", "")), "description": str(r.get("description", ""))}
            for r in generated["roadmap"]
            if isinstance(r, dict) and r.get("name")
        ]

    if not data.get("edge_cases") and generated.get("edge_cases"):
        data["edge_cases"] = [str(x) for x in generated["edge_cases"]]

    return ProductModel.model_validate(data)


def expand_product(product: ProductModel, use_ai_expansion: bool = True) -> tuple[ProductModel, str, str]:
    """
    Returns (expanded_product, executive_summary, problem_narrative).
    expanded_product has thin sections filled in by the local model
    (see _expand_with_model) without overwriting any user-provided fact.
    Callers that need both the markdown PRD and the same expanded data
    (e.g. the docx exporter) should call this once and reuse the result.
    """

    executive_summary = ""
    problem_narrative = product.problem or "Not specified"

    if use_ai_expansion:
        try:
            generated = _expand_with_model(product)
        except Exception:
            generated = {}

        product = _merge_generated(product, generated)
        executive_summary = generated.get("executive_summary", "")
        if generated.get("problem_narrative"):
            problem_narrative = generated["problem_narrative"]

    return product, executive_summary, problem_narrative


def generate_prd(
    product: ProductModel,
    use_ai_expansion: bool = True,
    _expanded: tuple[ProductModel, str, str] | None = None,
) -> str:
    """
    Generates a full, presentation-ready PRD in markdown.
    Pass `_expanded` (the tuple from expand_product) to avoid re-calling
    the model when you already expanded the product elsewhere.
    """

    if _expanded is not None:
        product, executive_summary, problem_narrative = _expanded
    else:
        product, executive_summary, problem_narrative = expand_product(
            product, use_ai_expansion=use_ai_expansion
        )

    lines = []

    lines.append(f"# {product.product or 'Product Requirements Document'}")
    lines.append("")

    if executive_summary:
        lines.append("## Executive Summary")
        lines.append(executive_summary)
        lines.append("")

    lines.append("## 1. Problem")
    lines.append(problem_narrative)
    lines.append("")

    lines.append("## 2. Target Users")
    if product.users:
        for user in product.users:
            lines.append(f"- {user}")
    else:
        lines.append("Not specified")
    lines.append("")

    lines.append("## 3. Current Context")
    if product.current_context:
        for ctx in product.current_context:
            lines.append(f"- {ctx}")
    else:
        lines.append("Not specified")
    lines.append("")

    lines.append("## 4. Goals")
    if product.goals:
        for goal in product.goals:
            lines.append(f"- {goal}")
    else:
        lines.append("Not specified")
    lines.append("")

    lines.append("## 5. MVP Scope")
    if product.mvp_scope:
        for item in product.mvp_scope:
            lines.append(f"- {item}")
    else:
        lines.append("Not specified")
    lines.append("")

    lines.append("## 6. Out of Scope")
    if product.out_of_scope:
        for item in product.out_of_scope:
            lines.append(f"- {item}")
    else:
        lines.append("Not specified")
    lines.append("")

    lines.append("## 7. Requirements")
    if product.requirements:
        for req in product.requirements:
            lines.append(f"- **[{req.priority.upper()}]** {req.description} _(type: {req.type})_")
    else:
        lines.append("Not specified")
    lines.append("")

    lines.append("## 8. Non-Functional Requirements")
    if product.non_functional_requirements:
        for item in product.non_functional_requirements:
            lines.append(f"- {item}")
    else:
        lines.append("Not specified")
    lines.append("")

    lines.append("## 9. User Stories")
    if product.user_stories:
        for story in product.user_stories:
            lines.append(
                f"- As a {story.actor}, I want to {story.action}, so that {story.goal}."
            )
    else:
        lines.append("Not specified")
    lines.append("")

    lines.append("## 10. Acceptance Criteria")
    if product.acceptance_criteria:
        for criterion in product.acceptance_criteria:
            lines.append(f"- {criterion.description}")
    else:
        lines.append("Not specified")
    lines.append("")

    lines.append("## 11. Edge Cases")
    if product.edge_cases:
        for item in product.edge_cases:
            lines.append(f"- {item}")
    else:
        lines.append("Not specified")
    lines.append("")

    lines.append("## 12. Success Metrics")
    if product.success_metrics:
        for metric in product.success_metrics:
            lines.append(f"- **{metric.name}**: {metric.target}")
    else:
        lines.append("Not specified")
    lines.append("")

    lines.append("## 13. Risks & Mitigations")
    if product.risks:
        for risk in product.risks:
            lines.append(f"- **[{risk.severity.upper()}]** {risk.description} — _Mitigation: {risk.mitigation}_")
    else:
        lines.append("Not specified")
    lines.append("")

    lines.append("## 14. Roadmap")
    if product.roadmap:
        for phase in product.roadmap:
            lines.append(f"- **{phase.name}**: {phase.description}")
    else:
        lines.append("Not specified")
    lines.append("")

    lines.append("## 15. Open Questions")
    if product.open_questions:
        for question in product.open_questions:
            lines.append(f"- {question}")
    else:
        lines.append("None")

    return "\n".join(lines)
