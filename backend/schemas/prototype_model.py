from typing import List
from pydantic import BaseModel, Field


class PrototypeComponent(BaseModel):
    name: str
    purpose: str

    model_config = {
        "extra": "forbid"
    }


class PrototypePage(BaseModel):
    name: str
    purpose: str
    components: List[PrototypeComponent] = Field(
        default_factory=list
    )

    model_config = {
        "extra": "forbid"
    }


class PrototypeModel(BaseModel):
    app_name: str = ""
    tagline: str = ""
    primary_action: str = ""

    pages: List[PrototypePage] = Field(
        default_factory=list
    )

    primary_flow: List[str] = Field(
        default_factory=list
    )

    model_config = {
        "extra": "forbid"
    }