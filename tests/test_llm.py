import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

from llm.ollama_client import ask_model


prompt = """
Return ONLY this JSON:

{
  "product": "Task Creation",
  "problem": "Users need to track work",
  "users": ["User"]
}

Do not explain anything.
"""

print("Sending test request...")

result = ask_model(prompt)

print("\n--- RESPONSE ---")
print(result)