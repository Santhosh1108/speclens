import json
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
PROJECT_DIR = BACKEND_DIR.parent
PRD_PATH = PROJECT_DIR / "examples" / "sample-prd.md"

sys.path.insert(0, str(BACKEND_DIR))

from llm.ollama_client import ask_model
from schemas.product_model import ProductModel


# -----------------------------------------
# Load PRD
# -----------------------------------------

if not PRD_PATH.exists():
    raise FileNotFoundError(
        f"PRD not found: {PRD_PATH}"
    )

prd = PRD_PATH.read_text(
    encoding="utf-8"
).strip()

if not prd:
    raise ValueError(
        f"PRD is empty: {PRD_PATH}"
    )

print(f"Loaded PRD: {len(prd)} characters")


# -----------------------------------------
# Ask Qwen to extract product information
# -----------------------------------------

prompt = f"""
Extract the core product information from the PRD below.

Return ONLY valid JSON.

Use exactly this structure:

{{
  "product": "string",
  "problem": "string",
  "users": ["string"],
  "goals": ["string"],

  "requirements": [
    {{
      "description": "string",
      "type": "functional"
    }}
  ],

  "user_stories": [
    {{
      "actor": "string",
      "action": "string",
      "goal": "string"
    }}
  ],

  "acceptance_criteria": [
    {{
      "description": "string"
    }}
  ]
}}

Rules:
- Return only JSON.
- Do not use markdown.
- Do not explain your reasoning.
- Do not invent requirements.
- Use empty arrays when information is unavailable.

PRD:

{prd}
"""


print("\n--- SENDING PRD TO QWEN ---")

result = ask_model(prompt)


# -----------------------------------------
# Parse JSON
# -----------------------------------------

print("\n--- RAW MODEL OUTPUT ---")
print(result)

try:
    data = json.loads(result)

except json.JSONDecodeError as error:
    print("\nERROR: Qwen returned invalid JSON.")
    print(error)
    sys.exit(1)


# -----------------------------------------
# Validate against ProductModel
# -----------------------------------------

print("\n--- VALIDATING PRODUCT MODEL ---")

try:
    product = ProductModel.model_validate(data)

except Exception as error:
    print("\nERROR: ProductModel validation failed.")
    print(error)
    sys.exit(1)


# -----------------------------------------
# Success
# -----------------------------------------

print("\n--- VALID PRODUCT MODEL ---")

print(
    json.dumps(
        product.model_dump(),
        indent=2
    )
)