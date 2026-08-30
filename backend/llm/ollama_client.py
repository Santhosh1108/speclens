import os

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
API_KEY = os.getenv("GROQ_API_KEY")

if not API_KEY:
    raise RuntimeError("GROQ_API_KEY is not set.")

client = Groq(api_key=API_KEY)


def ask_model(
    prompt: str,
    num_predict: int = 2000,
    system_prompt: str | None = None,
) -> str:
    if system_prompt is None:
        system_prompt = (
            "You are a structured data generator. "
            "Return ONLY valid JSON. "
            "Do not use markdown or code fences. "
            "Do not include explanations before or after the JSON. "
            "Ensure the response is valid JSON parseable by Python json.loads()."
        )

    completion = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ],
        temperature=0,
        max_tokens=max(num_predict, 2000),
        response_format={"type": "json_object"},
    )

    result = completion.choices[0].message.content
    if not result:
        raise ValueError("Model returned an empty response")

    return result.strip()
