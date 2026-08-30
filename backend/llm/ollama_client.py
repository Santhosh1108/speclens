import os
from groq import Groq


MODEL = os.getenv(
    "GROQ_MODEL",
    "llama-3.3-70b-versatile",
)

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)


def ask_model(
    prompt: str,
    num_predict: int = 1000,
    system_prompt: str | None = None,
) -> str:

    if system_prompt is None:
        system_prompt = (
            "You are a JSON extraction engine. "
            "Return ONLY the JSON object requested by the user. "
            "Do not explain your reasoning. "
            "Do not provide analysis. "
            "Do not write anything before or after the JSON."
        )

    completion = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0,
        max_tokens=num_predict,
        response_format={
            "type": "json_object"
        },
    )

    return completion.choices[0].message.content.strip()
