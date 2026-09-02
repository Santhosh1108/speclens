import json
import re
from llm.ollama_client import ask_model
from schemas.product_model import ProductModel

def discover_product(
    message: str,
    current_state: ProductModel | None = None,
):
    if current_state is None:
        current_state = ProductModel()

    # FORCE OLLAMA BY REMINDING IT AGAIN IN A SUPER COMPACT PROMPT
    prompt = f"""
You are SpecLens, an AI product discovery agent.
Your job is to gradually turn a user's rough product idea into a structured product specification.

CURRENT STATE:
{current_state.model_dump_json()}

USER MESSAGE:
{message}

CRITICAL RULES:
1. Return ONLY a single raw valid JSON object.
2. Absolutely NO markdown code blocks like ```json or ```.
3. No conversational text, no introductions, no explanations.

Use exactly this JSON structure structure:
{{
  "reply": "one concise follow-up question asking about the next missing discovery area",
  "product_state": {{
    "product": "extracted product name/description",
    "problem": "extracted user problem",
    "users": [],
    "current_context": [],
    "goals": [],
    "requirements": [],
    "user_stories": [],
    "acceptance_criteria": [],
    "open_questions": []
  }}
}}
"""

    # 1. Get raw string back from Ollama
    result = ask_model(prompt)

    print("\n--- DISCOVERY RAW OUTPUT ---")
    print(result)

    # 2. PROOFING THE JSON AGAINST OLLAMA MARKDOWN GLITCHES
    cleaned = result.strip()
    
    # Remove markdown fencing blocks if Ollama ignored instructions
    if cleaned.startswith("```"):
        cleaned = re.sub(r'^```(?:json)?\s*', '', cleaned)
        cleaned = re.sub(r'\s*```$', '', cleaned)
    
    # Extra fallback: Find boundaries of the main bracket
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    
    if start == -1 or end == -1:
        raise ValueError("Ollama failed to return a JSON structural object.")
    
    cleaned = cleaned[start:end + 1]

    # 3. Parse JSON safely
    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as e:
        print("\n--- INVALID CLEANED MODEL JSON ---")
        print(cleaned)
        raise ValueError(f"Ollama returned invalid JSON format: {e}") from e

    # 4. Validate top-level elements expected by lib/api.ts
    if not isinstance(data, dict):
        raise ValueError("Model response must be a JSON dictionary mapping object.")

    state = data.get("product_state", {})
    if not isinstance(state, dict):
        state = {}
        data["product_state"] = state

    # 5. Normalize structural values to keep the frontend running smoothly
    if "reply" not in data or not data["reply"]:
        data["reply"] = "Could you tell me a little bit more about who will use this product?"

    for field in ["product", "problem"]:
        if not state.get(field):
            state[field] = getattr(current_state, field, "")

    for list_field in ["users", "current_context", "goals", "requirements", "user_stories", "acceptance_criteria", "open_questions"]:
        if list_field not in state or not isinstance(state[list_field], list):
            existing_val = getattr(current_state, list_field, [])
            state[list_field] = existing_val if isinstance(existing_val, list) else []

    return data
