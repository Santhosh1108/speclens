from fastapi import FastAPI
from pydantic import BaseModel

from agents.discovery import discover_product
from agents.prd_generator import generate_prd
from agents.prd_critic import critique_prd
from agents.prototype_generator import (
    generate_prototype_plan,
    render_prototype,
)
from schemas.product_model import ProductModel


app = FastAPI(
    title="SpecLens API",
    version="0.2.0",
)


class DiscoveryRequest(BaseModel):
    message: str
    product_state: ProductModel | None = None


@app.get("/")
def root():
    return {
        "message": "SpecLens API is running",
        "version": "0.2.0",
    }


@app.post("/api/discover")
def discover(request: DiscoveryRequest):
    return discover_product(
        message=request.message,
        current_state=request.product_state,
    )


@app.post("/api/generate-prd")
def generate_prd_endpoint(product: ProductModel):
    prd = generate_prd(product)

    return {
        "prd": prd,
    }


@app.post("/api/critique-prd")
def critique_prd_endpoint(product: ProductModel):
    return critique_prd(product)


@app.post("/api/generate-prototype")
def generate_prototype_endpoint(product: ProductModel):

    prototype = generate_prototype_plan(product)

    return {
        "prototype": prototype.model_dump(),
        "html": render_prototype(
            prototype,
            product,
        ),
    }