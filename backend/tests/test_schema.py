import json
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

from schemas.product_model import ProductModel


sample_data = {
    "product": "Task Creation",
    "problem": "Users need to track work",
    "users": ["User"],
    "goals": ["Allow users to create tasks"],
    "requirements": [
        {
            "description": "Users can create a task",
            "type": "functional"
        }
    ],
    "user_stories": [
        {
            "actor": "User",
            "action": "create a task",
            "goal": "keep track of work"
        }
    ],
    "acceptance_criteria": [
        {
            "description": "The title cannot be empty"
        }
    ]
}


product = ProductModel.model_validate(sample_data)

print("\n--- VALID PRODUCT MODEL ---")
print(json.dumps(product.model_dump(), indent=2))