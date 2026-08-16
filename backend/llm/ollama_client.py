import requests


OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL = "qwen3:4b"


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

    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        "stream": False,
        "think": False,
        "format": "json",
        "options": {
            "temperature": 0,
            "num_predict": num_predict,
        },
    }

    response = requests.post(
        OLLAMA_URL,
        json=payload,
        timeout=180,
    )

    response.raise_for_status()

    data = response.json()

    return data["message"]["content"].strip()