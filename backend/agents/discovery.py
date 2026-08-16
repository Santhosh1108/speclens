import json

from llm.ollama_client import ask_model
from schemas.product_model import ProductModel


def discover_product(
    message: str,
    current_state: ProductModel | None = None,
):
    if current_state is None:
        current_state = ProductModel()

    prompt = f"""
You are SpecLens, an AI product discovery agent.

Your job is to gradually turn a user's rough product idea
into a structured product specification.

IMPORTANT:
- Read the USER MESSAGE carefully.
- Extract every product fact explicitly stated by the user.
- Preserve facts already present in CURRENT STATE.
- Never delete previously known information.
- Never invent facts.
- Never infer information that the user did not explicitly provide.

EXTRACTION RULES:

1. PRODUCT
If the user explicitly names or describes the product being built,
put that description in "product".

Example:
"I want to build a marketplace where students can find local tutors."

Product:
"marketplace where students can find local tutors"

Do not invent a product name if the user did not provide one.

2. PROBLEM
If the user explicitly describes a problem, put it in "problem".

Do not infer a problem from the product idea.

3. USERS
If the user explicitly identifies the people who will use the product,
put them in "users".

Do not invent a user type merely because it seems likely.

4. CURRENT CONTEXT
If the user explicitly describes:
- an existing platform
- a current tool
- a workaround
- a current process
- an existing behavior
- where the problem currently happens

put that information in "current_context".

Do not turn the product description itself into current context.

5. GOALS
If the user explicitly describes a desired outcome,
put it in "goals".

Examples of goal language:
- "I want users to..."
- "The goal is..."
- "so that..."
- "to help users..."
- "we want to..."
- "so users can..."

Do not invent business goals.

6. REQUIREMENTS
If the user explicitly describes something the product must do,
put it in "requirements".

Requirements should normally contain:
description
type

Use "functional" as the default type.

7. USER STORIES
Only create a user story when the user explicitly provides
user-story-like information.

Do NOT create a user story merely because:
- a user exists
- an action can be inferred
- the product has an obvious workflow
- the model thinks a user story would be useful

If the user does explicitly provide a user story,
represent it using:
actor
action
goal

Do not invent actor, action, or goal values.

8. ACCEPTANCE CRITERIA
Only create acceptance criteria when the user explicitly provides them.

Do not generate acceptance criteria merely from requirements.

9. OPEN QUESTIONS
Only preserve or add open questions when appropriate.
Do not invent questions as product facts.

DISCOVERY ORDER:

1. Problem
2. Target user
3. Current workaround/context
4. Desired outcome
5. Core workflow
6. Requirements
7. Edge cases

DISCOVERY RULES:

- Ask exactly ONE useful follow-up question.
- Ask about the NEXT missing discovery area.
- Do not ask about something the user already provided.
- Do not ask about features while the problem is still unknown.
- Do not ask about requirements while important discovery information
  is still missing.
- Extract information from the user's message before asking a question.
- If the user's message provides information for a field, store it.
- If information is unknown, leave the field empty.
- Never fill an empty field using assumptions.

IMPORTANT:

The initial product idea is NOT automatically:
- a problem
- a goal
- a current context
- a user story
- a requirement
- an acceptance criterion

Only extract what the user actually said.

CURRENT STATE:
{current_state.model_dump_json()}

USER MESSAGE:
{message}

Return ONLY valid JSON.

Use exactly this structure:

{{
  "reply": "one concise follow-up question",
  "product_state": {{
    "product": "",
    "problem": "",
    "users": [],
    "current_context": [],
    "goals": [],
    "requirements": [],
    "user_stories": [],
    "acceptance_criteria": [],
    "open_questions": []
  }}
}}

REQUIREMENT FORMAT:

{{
  "description": "short description of the requirement",
  "type": "functional"
}}

USER STORY FORMAT:

{{
  "actor": "person performing the action",
  "action": "action being performed",
  "goal": "desired outcome"
}}

ACCEPTANCE CRITERION FORMAT:

{{
  "description": "criterion"
}}

Do not provide explanations.
Do not provide reasoning.
Do not use markdown.
Do not include comments inside the JSON.
"""


    # ---------------------------------------------------------
    # Ask model
    # ---------------------------------------------------------

    result = ask_model(prompt)

    print("\n--- DISCOVERY RAW OUTPUT ---")
    print(result)


    # ---------------------------------------------------------
    # Parse JSON
    # ---------------------------------------------------------

    try:
        data = json.loads(result)

    except json.JSONDecodeError:
        print("\n--- INVALID MODEL JSON ---")
        print(result)

        start = result.find("{")
        end = result.rfind("}")

        if start == -1 or end == -1:
            raise ValueError(
                "Model did not return a JSON object."
            )

        cleaned = result[start:end + 1]

        try:
            data = json.loads(cleaned)

        except json.JSONDecodeError as e:
            raise ValueError(
                f"Model returned invalid JSON: {e}"
            ) from e


    # ---------------------------------------------------------
    # Validate top-level model response
    # ---------------------------------------------------------

    if not isinstance(data, dict):
        raise ValueError(
            "Model response must be a JSON object."
        )

    state = data.get("product_state", {})

    if not isinstance(state, dict):
        raise ValueError(
            "Model product_state must be a JSON object."
        )


    # ---------------------------------------------------------
    # Normalize acceptance criteria field name
    # ---------------------------------------------------------

    if "acceptance_criteria" not in state:

        if "accept" in state:
            state["acceptance_criteria"] = state.pop("accept")

        elif "accept:criteria" in state:
            state["acceptance_criteria"] = state.pop(
                "accept:criteria"
            )

        else:
            state["acceptance_criteria"] = []


    # ---------------------------------------------------------
    # Preserve existing basic information
    # ---------------------------------------------------------

    if not state.get("product"):
        state["product"] = current_state.product

    if not state.get("problem"):
        state["problem"] = current_state.problem

    if not state.get("users"):
        state["users"] = current_state.users

    if not state.get("current_context"):
        state["current_context"] = current_state.current_context

    if not state.get("goals"):
        state["goals"] = current_state.goals


    # ---------------------------------------------------------
    # Normalize requirements
    # ---------------------------------------------------------

    if state.get("requirements"):

        normalized_requirements = []

        for item in state["requirements"]:

            if isinstance(item, str):

                normalized_requirements.append({
                    "description": item,
                    "type": "functional"
                })

            elif isinstance(item, dict):

                if "description" in item:

                    normalized_requirements.append({
                        "description": str(
                            item["description"]
                        ),
                        "type": str(
                            item.get(
                                "type",
                                "functional"
                            )
                        )
                    })

                else:

                    parts = []

                    for key, value in item.items():
                        parts.append(
                            f"{key}: {value}"
                        )

                    normalized_requirements.append({
                        "description": ", ".join(parts),
                        "type": "functional"
                    })

        state["requirements"] = normalized_requirements

    else:

        state["requirements"] = [
            item.model_dump()
            for item in current_state.requirements
        ]


    # ---------------------------------------------------------
    # Normalize user stories
    #
    # IMPORTANT:
    # Never invent actor/action/goal values.
    # Never use domain-specific defaults.
    # ---------------------------------------------------------

    if state.get("user_stories"):

        normalized_user_stories = []

        for item in state["user_stories"]:

            if not isinstance(item, dict):
                continue

            actor = item.get("actor")
            action = item.get("action")
            goal = item.get("goal")

            if not actor or not action or not goal:
                continue

            normalized_user_stories.append({
                "actor": str(actor),
                "action": str(action),
                "goal": str(goal)
            })

        state["user_stories"] = normalized_user_stories

    else:

        state["user_stories"] = [
            item.model_dump()
            for item in current_state.user_stories
        ]


    # ---------------------------------------------------------
    # Normalize acceptance criteria
    # ---------------------------------------------------------

    if state.get("acceptance_criteria"):

        normalized_criteria = []

        for item in state["acceptance_criteria"]:

            if isinstance(item, str):

                normalized_criteria.append({
                    "description": item
                })

            elif isinstance(item, dict):

                description = item.get(
                    "description",
                    ""
                )

                if description:
                    normalized_criteria.append({
                        "description": str(description)
                    })

        state["acceptance_criteria"] = normalized_criteria

    else:

        state["acceptance_criteria"] = [
            item.model_dump()
            for item in current_state.acceptance_criteria
        ]


    # ---------------------------------------------------------
    # Preserve open questions
    # ---------------------------------------------------------

    if not state.get("open_questions"):

        state["open_questions"] = (
            current_state.open_questions
        )


    # ---------------------------------------------------------
    # Final validation
    # ---------------------------------------------------------

    product_state = ProductModel.model_validate(state)

    return {
        "reply": data.get("reply", ""),
        "product_state": product_state.model_dump(),
    }