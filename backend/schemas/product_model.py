from typing import List, Literal
from pydantic import BaseModel, Field


class Requirement(BaseModel):
    description: str
    type: str = "functional"
    priority: Literal["must", "should", "could", "wont"] = "must"

    model_config = {
        "extra": "forbid"
    }


class UserStory(BaseModel):
    actor: str
    action: str
    goal: str

    model_config = {
        "extra": "forbid"
    }


class AcceptanceCriterion(BaseModel):
    description: str

    model_config = {
        "extra": "forbid"
    }


class SuccessMetric(BaseModel):
    name: str
    target: str = ""

    model_config = {
        "extra": "forbid"
    }


class Risk(BaseModel):
    description: str
    mitigation: str = ""
    severity: Literal["high", "medium", "low"] = "medium"

    model_config = {
        "extra": "forbid"
    }


class RoadmapPhase(BaseModel):
    name: str
    description: str = ""

    model_config = {
        "extra": "forbid"
    }


class ProductModel(BaseModel):
    product: str = ""
    problem: str = ""

    users: List[str] = Field(default_factory=list)
    current_context: List[str] = Field(default_factory=list)
    goals: List[str] = Field(default_factory=list)

    requirements: List[Requirement] = Field(
        default_factory=list
    )

    user_stories: List[UserStory] = Field(
        default_factory=list
    )

    acceptance_criteria: List[AcceptanceCriterion] = Field(
        default_factory=list
    )

    # --- Presentation-ready PRD additions ---
    mvp_scope: List[str] = Field(default_factory=list)
    out_of_scope: List[str] = Field(default_factory=list)
    non_functional_requirements: List[str] = Field(
        default_factory=list
    )
    success_metrics: List[SuccessMetric] = Field(
        default_factory=list
    )
    risks: List[Risk] = Field(default_factory=list)
    roadmap: List[RoadmapPhase] = Field(default_factory=list)
    edge_cases: List[str] = Field(default_factory=list)

    open_questions: List[str] = Field(
        default_factory=list
    )

    model_config = {
        "extra": "forbid"
    }
