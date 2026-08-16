import json

from llm.ollama_client import ask_model
from schemas.product_model import ProductModel


def critique_prd(product: ProductModel):

    prompt = f"""
You are a senior product manager reviewing a product specification.

Evaluate the following product specification for clarity,
completeness, consistency, and usefulness for MVP development.

PRODUCT:
{product.product}

PROBLEM:
{product.problem}

USERS:
{json.dumps(product.users)}

CURRENT CONTEXT:
{json.dumps(product.current_context)}

GOALS:
{json.dumps(product.goals)}

REQUIREMENTS:
{json.dumps([
    item.model_dump()
    for item in product.requirements
])}

USER STORIES:
{json.dumps([
    item.model_dump()
    for item in product.user_stories
])}

ACCEPTANCE CRITERIA:
{json.dumps([
    item.model_dump()
    for item in product.acceptance_criteria
])}

OPEN QUESTIONS:
{json.dumps(product.open_questions)}

Evaluate the specification.

Return ONLY valid JSON.

Use exactly this structure:

{{
  "overall_score": 0,
  "summary": "short overall assessment",
  "strengths": [
    "strength"
  ],
  "issues": [
    {{
      "severity": "high",
      "category": "category",
      "issue": "specific issue",
      "suggestion": "specific improvement"
    }}
  ]
}}

Rules:

- overall_score must be an integer from 0 to 100.
- strengths must contain concrete strengths.
- issues must identify actual weaknesses.
- severity must be one of: high, medium, low.
- Do not invent product facts.
- Do not rewrite the entire PRD.
- Keep the critique concise.
- Return valid JSON only.
- Do not use markdown.
- Do not include explanations outside the JSON.
"""

    # IMPORTANT:
    # ask_model() currently does not accept num_predict.
    # Therefore we call it with only the prompt.
    result = ask_model(prompt)

    print("\n--- CRITIC RAW OUTPUT ---")
    print(result)

    # ---------------------------------------------------------
    # Parse JSON
    # ---------------------------------------------------------

    try:
        data = json.loads(result)

    except json.JSONDecodeError:
        print("\n--- INVALID CRITIC JSON ---")
        print(result)

        start = result.find("{")
        end = result.rfind("}")

        if start == -1 or end == -1:
            raise ValueError(
                "Critic model did not return a JSON object."
            )

        cleaned = result[start:end + 1]

        try:
            data = json.loads(cleaned)

        except json.JSONDecodeError as e:
            raise ValueError(
                f"Critic model returned invalid JSON: {e}"
            ) from e

    # ---------------------------------------------------------
    # Basic validation
    # ---------------------------------------------------------

    if not isinstance(data, dict):
        raise ValueError(
            "Critic response must be a JSON object."
        )

    if "overall_score" not in data:
        raise ValueError(
            "Critic response missing overall_score."
        )

    if "summary" not in data:
        raise ValueError(
            "Critic response missing summary."
        )

    if "strengths" not in data:
        data["strengths"] = []

    if "issues" not in data:
        data["issues"] = []

    # ---------------------------------------------------------
    # Normalize score
    # ---------------------------------------------------------

    try:
        score = int(data["overall_score"])
    except (TypeError, ValueError):
        score = 0

    score = max(0, min(100, score))

    data["overall_score"] = score

    # ---------------------------------------------------------
    # Normalize arrays
    # ---------------------------------------------------------

    if not isinstance(data["strengths"], list):
        data["strengths"] = [str(data["strengths"])]

    if not isinstance(data["issues"], list):
        data["issues"] = []

    normalized_issues = []

    for issue in data["issues"]:

        if not isinstance(issue, dict):
            continue

        normalized_issues.append({
            "severity": str(
                issue.get("severity", "medium")
            ),
            "category": str(
                issue.get("category", "general")
            ),
            "issue": str(
                issue.get("issue", "")
            ),
            "suggestion": str(
                issue.get("suggestion", "")
            )
        })

    data["issues"] = normalized_issues

    return data