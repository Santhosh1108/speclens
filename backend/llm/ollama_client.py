import os
<<<<<<< HEAD
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

=======
>>>>>>> 0da939d (Fix API integration and deployment)
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
API_KEY = os.getenv("GROQ_API_KEY")

if not API_KEY:
    raise RuntimeError("GROQ_API_KEY is not set.")

client = Groq(api_key=API_KEY)
>>>>>>> 94154eb (Replace Ollama with Groq API)


<<<<<<< HEAD
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
=======
def ask_model(prompt: str, num_predict: int = 1000, system_prompt: str | None = None) -> str:
    if system_prompt is None:
        system_prompt = (
            "You are a JSON extraction engine. Return ONLY valid JSON requested by the user. "
            "Do not explain your reasoning or add markdown."
>>>>>>> 0da939d (Fix API integration and deployment)
        )

    completion = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ],
        temperature=0,
        max_tokens=num_predict,
        response_format={"type": "json_object"},
    )
<<<<<<< HEAD

    result = completion.choices[0].message.content

    if not result:
        raise ValueError("Model returned an empty response")

    return result.strip()
>>>>>>> 94154eb (Replace Ollama with Groq API)
=======
    return (completion.choices[0].message.content or "").strip()
>>>>>>> 0da939d (Fix API integration and deployment)
