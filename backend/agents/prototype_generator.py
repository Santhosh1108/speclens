import json
import html

from llm.ollama_client import ask_model
from schemas.product_model import ProductModel
from schemas.prototype_model import PrototypeModel


def generate_prototype_plan(
    product: ProductModel,
) -> PrototypeModel:

    prompt = f"""
You are the product design engine for SpecLens.

Create a practical MVP prototype plan from the product specification below.

The product can belong to ANY industry or category.

Do not assume the product is:
- an education product
- a marketplace
- a SaaS product
- a mobile app
- an e-commerce product

Determine the appropriate MVP interface from the specification.

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

Create a prototype plan containing:

1. app_name
2. tagline
3. primary_action
4. pages
5. primary_flow

The prototype should represent the smallest useful MVP.

Prefer 1 to 3 pages.

Each page should contain practical UI components.

Possible component types include:
- navigation
- header
- search
- form
- cards
- table
- list
- filters
- dashboard
- detail view
- status indicator
- call to action
- empty state
- confirmation
- profile
- settings

Only use components that make sense for the product.

Do not invent complex features that are not supported
by the product specification.

Return ONLY valid JSON.

Use exactly this structure:

{{
  "app_name": "string",
  "tagline": "string",
  "primary_action": "string",
  "pages": [
    {{
      "name": "string",
      "purpose": "string",
      "components": [
        {{
          "name": "string",
          "purpose": "string"
        }}
      ]
    }}
  ],
  "primary_flow": [
    "step"
  ]
}}

Do not provide explanations.
Do not use markdown.
Do not include comments.
"""

    result = ask_model(
        prompt,
        num_predict=1000,
    )

    print("\n--- PROTOTYPE RAW OUTPUT ---")
    print(result)

    try:
        data = json.loads(result)

    except json.JSONDecodeError:

        start = result.find("{")
        end = result.rfind("}")

        if start == -1 or end == -1:
            raise ValueError(
                "Prototype model did not return JSON."
            )

        cleaned = result[start:end + 1]

        try:
            data = json.loads(cleaned)

        except json.JSONDecodeError as e:
            raise ValueError(
                f"Prototype model returned invalid JSON: {e}"
            ) from e

    return PrototypeModel.model_validate(data)


def _component_html(component):

    name = html.escape(component.name)
    purpose = html.escape(component.purpose)

    return f"""
    <div class="component-card">
        <div class="component-title">{name}</div>
        <div class="component-purpose">{purpose}</div>
    </div>
    """


def render_prototype(
    prototype: PrototypeModel,
    product: ProductModel,
) -> str:

    app_name = html.escape(
        prototype.app_name
        or product.product
        or "MVP Prototype"
    )

    tagline = html.escape(
        prototype.tagline
        or product.problem
        or "MVP prototype"
    )

    primary_action = html.escape(
        prototype.primary_action
        or "Get Started"
    )

    navigation = ""

    for index, page in enumerate(prototype.pages):

        page_name = html.escape(page.name)

        navigation += f"""
        <button
            class="nav-item {'active' if index == 0 else ''}"
            onclick="showPage({index})"
        >
            {page_name}
        </button>
        """

    pages_html = ""

    for index, page in enumerate(prototype.pages):

        page_name = html.escape(page.name)
        purpose = html.escape(page.purpose)

        components = ""

        for component in page.components:
            components += _component_html(component)

        pages_html += f"""
        <section
            id="page-{index}"
            class="page {'visible' if index == 0 else ''}"
        >

            <div class="page-header">

                <div>

                    <div class="eyebrow">
                        MVP PROTOTYPE
                    </div>

                    <h2>
                        {page_name}
                    </h2>

                    <p>
                        {purpose}
                    </p>

                </div>

                <button class="primary-button">
                    {primary_action}
                </button>

            </div>

            <div class="component-grid">
                {components}
            </div>

        </section>
        """

    flow_html = ""

    for index, step in enumerate(
        prototype.primary_flow
    ):

        flow_html += f"""
        <div class="flow-step">

            <div class="flow-number">
                {index + 1}
            </div>

            <div>
                {html.escape(step)}
            </div>

        </div>
        """

    return f"""
<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
/>

<title>
    {app_name} — SpecLens Prototype
</title>

<style>

* {{
    box-sizing: border-box;
}}

body {{
    margin: 0;
    font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
    background: #f6f7f9;
    color: #111827;
}}

button {{
    font: inherit;
}}

.app {{
    min-height: 100vh;
    display: flex;
}}

.sidebar {{
    width: 250px;
    background: #111827;
    color: white;
    padding: 28px 18px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
}}

.logo {{
    font-size: 21px;
    font-weight: 700;
    margin-bottom: 8px;
}}

.logo-subtitle {{
    font-size: 12px;
    color: #9ca3af;
    margin-bottom: 35px;
}}

.nav {{
    display: flex;
    flex-direction: column;
    gap: 7px;
}}

.nav-item {{
    border: 0;
    background: transparent;
    color: #9ca3af;
    padding: 11px 13px;
    text-align: left;
    border-radius: 8px;
    cursor: pointer;
}}

.nav-item:hover,
.nav-item.active {{
    background: #1f2937;
    color: white;
}}

.main {{
    margin-left: 250px;
    width: calc(100% - 250px);
    padding: 42px;
}}

.hero {{
    max-width: 900px;
    margin-bottom: 35px;
}}

.eyebrow {{
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.2px;
    color: #6b7280;
    margin-bottom: 9px;
}}

h1 {{
    margin: 0 0 12px;
    font-size: 38px;
    letter-spacing: -1px;
}}

.hero p {{
    margin: 0;
    color: #6b7280;
    font-size: 16px;
    max-width: 700px;
}}

.page {{
    display: none;
}}

.page.visible {{
    display: block;
}}

.page-header {{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 25px;
    margin-bottom: 24px;
}}

.page-header h2 {{
    margin: 0 0 7px;
    font-size: 25px;
}}

.page-header p {{
    margin: 0;
    color: #6b7280;
}}

.primary-button {{
    border: 0;
    background: #111827;
    color: white;
    padding: 11px 17px;
    border-radius: 8px;
    cursor: pointer;
}}

.primary-button:hover {{
    opacity: 0.9;
}}

.component-grid {{
    display: grid;
    grid-template-columns:
        repeat(auto-fit, minmax(230px, 1fr));
    gap: 16px;
}}

.component-card {{
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
    min-height: 125px;
}}

.component-title {{
    font-weight: 650;
    margin-bottom: 10px;
}}

.component-purpose {{
    color: #6b7280;
    line-height: 1.5;
    font-size: 14px;
}}

.flow {{
    margin-top: 38px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 22px;
    max-width: 900px;
}}

.flow h3 {{
    margin-top: 0;
}}

.flow-step {{
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
}}

.flow-step:last-child {{
    border-bottom: 0;
}}

.flow-number {{
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #111827;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    flex-shrink: 0;
}}

@media (max-width: 800px) {{

    .sidebar {{
        width: 190px;
    }}

    .main {{
        margin-left: 190px;
        width: calc(100% - 190px);
        padding: 25px;
    }}

    .page-header {{
        flex-direction: column;
    }}
}}

</style>

</head>

<body>

<div class="app">

    <aside class="sidebar">

        <div class="logo">
            SpecLens
        </div>

        <div class="logo-subtitle">
            Generated MVP Prototype
        </div>

        <nav class="nav">
            {navigation}
        </nav>

    </aside>


    <main class="main">

        <div class="hero">

            <div class="eyebrow">
                AI-GENERATED PRODUCT PROTOTYPE
            </div>

            <h1>
                {app_name}
            </h1>

            <p>
                {tagline}
            </p>

        </div>


        {pages_html}


        <div class="flow">

            <h3>
                Primary User Flow
            </h3>

            {flow_html}

        </div>

    </main>

</div>


<script>

function showPage(index) {{

    const pages =
        document.querySelectorAll(".page");

    const buttons =
        document.querySelectorAll(".nav-item");

    pages.forEach(
        page => page.classList.remove("visible")
    );

    buttons.forEach(
        button => button.classList.remove("active")
    );

    if (pages[index]) {{
        pages[index].classList.add("visible");
    }}

    if (buttons[index]) {{
        buttons[index].classList.add("active");
    }}
}}

</script>

</body>

</html>
"""