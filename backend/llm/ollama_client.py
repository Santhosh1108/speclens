import os
<<<<<<< HEAD
from groq import Groq


MODEL = os.getenv(
    "GROQ_MODEL",
    "llama-3.3-70b-versatile",
)

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)
=======
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq


# Load backend/.env
BACKEND_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BACKEND_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH)

API_KEY = os.getenv("GROQ_API_KEY")

if not API_KEY:
    raise RuntimeError(
        f"GROQ_API_KEY not found. Expected .env at: {ENV_PATH}"
    )


# Confirmed available for your Groq API key
MODEL = "openai/gpt-oss-20b"


client = Groq(api_key=API_KEY)
>>>>>>> 94154eb (Replace Ollama with Groq API)


def ask_model(
    prompt: str,
    num_predict: int = 1000,
    system_prompt: str | None = None,
) -> str:

    messages = []

<<<<<<< HEAD
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
=======
    # Force JSON-only behaviour
    messages.append(
        {
            "role": "system",
            "content": (
                "You are a structured data generator. "
                "Return ONLY valid JSON. "
                "Do not use markdown. "
                "Do not wrap JSON in ```json blocks. "
                "Do not include explanations before or after the JSON. "
                "Ensure all strings and arrays are properly closed. "
                "The response must be parseable by Python json.loads()."
            ),
        }
    )

    if system_prompt:
        messages.append(
            {
                "role": "system",
                "content": system_prompt,
            }
        )

    messages.append(
        {
            "role": "user",
            "content": prompt,
        }
    )

    print(f"USING MODEL: {MODEL}")

    completion = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        temperature=0,
        max_tokens=max(num_predict, 2000),
        response_format={
            "type": "json_object"
        },
    )

    result = completion.choices[0].message.content

    if not result:
        raise ValueError("Model returned an empty response")

    return result.strip()
>>>>>>> 94154eb (Replace Ollama with Groq API)
