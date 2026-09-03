import logging
import os
import time
from collections import defaultdict, deque
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from starlette.middleware.base import BaseHTTPMiddleware

from agents.discovery import discover_product
from agents.prd_generator import expand_product, generate_prd
from agents.prd_critic import critique_prd
from agents.prototype_generator import generate_prototype_plan, render_prototype
from exporters.docx_exporter import build_prd_docx
from schemas.product_model import ProductModel

logger = logging.getLogger("speclens")
logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))

MAX_BODY_BYTES = int(os.getenv("MAX_BODY_BYTES", "65536"))
MAX_DISCOVERY_MESSAGE_CHARS = int(os.getenv("MAX_DISCOVERY_MESSAGE_CHARS", "4000"))
RATE_LIMIT_REQUESTS = int(os.getenv("RATE_LIMIT_REQUESTS", "30"))
RATE_LIMIT_WINDOW_SECONDS = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "60"))
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,https://speclens.vercel.app",
    ).split(",")
    if origin.strip()
]

_request_times: dict[str, deque[float]] = defaultdict(deque)


class RequestLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        content_length = request.headers.get("content-length")
        if content_length:
            try:
                if int(content_length) > MAX_BODY_BYTES:
                    return JSONResponse({"detail": "Request body too large."}, status_code=413)
            except ValueError:
                return JSONResponse({"detail": "Invalid Content-Length."}, status_code=400)

        client_ip = request.client.host if request.client else "unknown"
        now = time.monotonic()
        timestamps = _request_times[client_ip]
        cutoff = now - RATE_LIMIT_WINDOW_SECONDS
        while timestamps and timestamps[0] <= cutoff:
            timestamps.popleft()
        if len(timestamps) >= RATE_LIMIT_REQUESTS:
            return JSONResponse(
                {"detail": "Too many requests. Please try again shortly."},
                status_code=429,
                headers={"Retry-After": str(RATE_LIMIT_WINDOW_SECONDS)},
            )
        timestamps.append(now)
        return await call_next(request)


app = FastAPI(title="SpecLens API", version="0.2.2")
app.add_middleware(RequestLimitMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


def product_from_payload(payload: Any) -> ProductModel:
    if not isinstance(payload, dict):
        raise HTTPException(status_code=422, detail="Invalid product payload.")
    try:
        return ProductModel.model_validate(payload)
    except Exception as exc:
        logger.info("Product validation failed: %s", type(exc).__name__)
        raise HTTPException(status_code=422, detail="Invalid product state.") from exc


def internal_error(message: str) -> HTTPException:
    logger.exception(message)
    return HTTPException(status_code=500, detail=message)


@app.get("/")
def root():
    return {"message": "SpecLens API is running", "version": "0.2.2"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/discover")
def discover(data: dict):
    message = str(data.get("message") or data.get("idea") or "").strip()
    if not message:
        raise HTTPException(status_code=400, detail="A product idea or discovery answer is required.")
    if len(message) > MAX_DISCOVERY_MESSAGE_CHARS:
        raise HTTPException(status_code=413, detail="Discovery message is too long.")

    current_state_payload = data.get("current_state") or data.get("product_state")
    try:
        current_state = ProductModel.model_validate(current_state_payload) if current_state_payload else None
        return discover_product(message=message, current_state=current_state)
    except HTTPException:
        raise
    except Exception:
        raise internal_error("Discovery failed.")


@app.post("/api/generate-prd")
def generate_prd_endpoint(data: dict):
    try:
        product = product_from_payload(data)
        expanded = expand_product(product)
        expanded_product = expanded[0]
        prd = generate_prd(expanded_product, _expanded=expanded)
        return {"prd": prd, "product_state": expanded_product.model_dump()}
    except HTTPException:
        raise
    except Exception:
        raise internal_error("PRD generation failed.")


@app.post("/api/critique-prd")
def critique_prd_endpoint(data: dict):
    try:
        product = product_from_payload(data)
        return critique_prd(product)
    except HTTPException:
        raise
    except Exception:
        raise internal_error("PRD critique failed.")


@app.post("/api/generate-prototype")
def generate_prototype_endpoint(data: dict):
    try:
        product = product_from_payload(data)
        prototype = generate_prototype_plan(product)
        html = render_prototype(prototype, product)
        return {"prototype": prototype.model_dump(), "html": html}
    except HTTPException:
        raise
    except Exception:
        raise internal_error("Prototype generation failed.")


@app.post("/api/export-prd-docx")
def export_prd_docx_endpoint(data: dict):
    try:
        product = product_from_payload(data.get("product") or {})
        critique = data.get("critique") if data.get("include_critique", True) else None
        document = build_prd_docx(product, critique=critique)
        return StreamingResponse(
            document,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": 'attachment; filename="product-requirements.docx"'},
        )
    except HTTPException:
        raise
    except Exception:
        raise internal_error("Word export failed.")
