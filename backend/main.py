from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from agents.discovery import discover_product
from agents.prd_generator import expand_product, generate_prd
from agents.prd_critic import critique_prd
from agents.prototype_generator import generate_prototype_plan, render_prototype
from exporters.docx_exporter import build_prd_docx
from schemas.product_model import ProductModel


app = FastAPI(
    title="SpecLens API",
    version="0.2.0"
)


# TEMPORARY: Allow frontend requests from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def product_from_payload(payload: dict) -> ProductModel:
    try:
        return ProductModel.model_validate(payload)
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid product state: {exc}"
        ) from exc


@app.get("/")
def root():
    return {
        "message": "SpecLens API is running",
        "version": "0.2.0"
    }


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/discover")
def discover(data: dict):
    message = str(
        data.get("message")
        or data.get("idea")
        or ""
    ).strip()

    if not message:
        raise HTTPException(
            status_code=400,
            detail="A product idea or discovery answer is required."
        )

    current_state_payload = (
        data.get("current_state")
        or data.get("product_state")
    )

    try:
        current_state = (
            ProductModel.model_validate(current_state_payload)
            if current_state_payload
            else None
        )

        return discover_product(
            message=message,
            current_state=current_state
        )

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Discovery failed: {exc}"
        ) from exc


@app.post("/api/generate-prd")
def generate_prd_endpoint(data: dict):
    try:
        product = product_from_payload(data)

        expanded = expand_product(product)
        expanded_product = expanded[0]

        prd = generate_prd(
            expanded_product,
            _expanded=expanded
        )

        return {
            "prd": prd,
            "product_state": expanded_product.model_dump()
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"PRD generation failed: {exc}"
        ) from exc


@app.post("/api/critique-prd")
def critique_prd_endpoint(data: dict):
    try:
        product = product_from_payload(data)
        return critique_prd(product)

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"PRD critique failed: {exc}"
        ) from exc


@app.post("/api/generate-prototype")
def generate_prototype_endpoint(data: dict):
    try:
        product = product_from_payload(data)

        prototype = generate_prototype_plan(product)
        html = render_prototype(prototype, product)

        return {
            "prototype": prototype.model_dump(),
            "html": html
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Prototype generation failed: {exc}"
        ) from exc


@app.post("/api/export-prd-docx")
def export_prd_docx_endpoint(data: dict):
    try:
        product = product_from_payload(
            data.get("product") or {}
        )

        critique = (
            data.get("critique")
            if data.get("include_critique", True)
            else None
        )

        document = build_prd_docx(
            product,
            critique=critique
        )

        return StreamingResponse(
            document,
            media_type=(
                "application/vnd.openxmlformats-officedocument."
                "wordprocessingml.document"
            ),
            headers={
                "Content-Disposition":
                    'attachment; filename="product-requirements.docx"'
            },
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Word export failed: {exc}"
        ) from exc
