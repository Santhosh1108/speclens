from schemas.product_model import ProductModel


def generate_prd(product: ProductModel) -> str:

    lines = []

    lines.append("# Product Requirements Document")
    lines.append("")

    lines.append("## 1. Product")
    lines.append(product.product or "Not specified")
    lines.append("")

    lines.append("## 2. Problem")
    lines.append(product.problem or "Not specified")
    lines.append("")

    lines.append("## 3. Target Users")
    if product.users:
        for user in product.users:
            lines.append(f"- {user}")
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

    lines.append("## 5. Requirements")
    if product.requirements:
        for requirement in product.requirements:
            lines.append(
                f"- {requirement.description}"
            )
    else:
        lines.append("Not specified")
    lines.append("")

    lines.append("## 6. User Stories")
    if product.user_stories:
        for story in product.user_stories:
            lines.append(
                f"- As a {story.actor}, "
                f"I want to {story.action}, "
                f"so that {story.goal}."
            )
    else:
        lines.append("Not specified")
    lines.append("")

    lines.append("## 7. Acceptance Criteria")
    if product.acceptance_criteria:
        for criterion in product.acceptance_criteria:
            lines.append(f"- {criterion.description}")
    else:
        lines.append("Not specified")
    lines.append("")

    lines.append("## 8. Edge Cases")
    lines.append("Not specified")
    lines.append("")

    lines.append("## 9. Open Questions")
    if product.open_questions:
        for question in product.open_questions:
            lines.append(f"- {question}")
    else:
        lines.append("None")

    return "\n".join(lines)