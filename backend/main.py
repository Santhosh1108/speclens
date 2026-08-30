from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from agents.discovery import discover_product

app = FastAPI(
    title="SpecLens API",
    version="0.2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://speclens-delta.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "SpecLens API is running",
        "version": "0.2.0"
    }


@app.post("/discover")
def discover(data: dict):
    return discover_product(
        idea=data.get("idea", ""),
        answers=data.get("answers", [])
    )
