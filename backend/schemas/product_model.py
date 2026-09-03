from typing import List, Literal
from pydantic import BaseModel, Field


TEXT_LIMIT = 2000
LIST_LIMIT = 50


class Requirement(BaseModel):
    description: str = Field(max_length=TEXT_LIMIT)
    type: str = Field(default="functional", max_length=100)
    priority: Literal["must", "should", "could", "wont"] = "must"

    model_config = {"extra": "forbid"}


class UserStory(BaseModel):
    actor: str = Field(max_length=TEXT_LIMIT)
    action: str = Field(max_length=TEXT_LIMIT)
    goal: str = Field(max_length=TEXT_LIMIT)

    model_config = {"extra": "forbid"}


class AcceptanceCriterion(BaseModel):
    description: str = Field(max_length=TEXT_LIMIT)

    model_config = {"extra": "forbid"}


class SuccessMetric(BaseModel):
    name: str = Field(max_length=500)
    target: str = Field(default="", max_length=TEXT_LIMIT)

    model_config = {"extra": "forbid"}


class Risk(BaseModel):
    description: str = Field(max_length=TEXT_LIMIT)
    mitigation: str = Field(default="", max_length=TEXT_LIMIT)
    severity: Literal["high", "medium", "low"] = "medium"

    model_config = {"extra": "forbid"}


class RoadmapPhase(BaseModel):
    name: str = Field(max_length=500)
    description: str = Field(default="", max_length=TEXT_LIMIT)

    model_config = {"extra": "forbid"}


class ProductModel(BaseModel):
    product: str = Field(default="", max_length=TEXT_LIMIT)
    problem: str = Field(default="", max_length=TEXT_LIMIT)

    users: List[str] = Field(default_factory=list, max_length=LIST_LIMIT)
    current_context: List[str] = Field(default_factory=list, max_length=LIST_LIMIT)
    goals: List[str] = Field(default_factory=list, max_length=LIST_LIMIT)
    requirements: List[Requirement] = Field(default_factory=list, max_length=LIST_LIMIT)
    user_stories: List[UserStory] = Field(default_factory=list, max_length=LIST_LIMIT)
    acceptance_criteria: List[AcceptanceCriterion] = Field(default_factory=list, max_length=LIST_LIMIT)

    mvp_scope: List[str] = Field(default_factory=list, max_length=LIST_LIMIT)
    out_of_scope: List[str] = Field(default_factory=list, max_length=LIST_LIMIT)
    non_functional_requirements: List[str] = Field(default_factory=list, max_length=LIST_LIMIT)
    success_metrics: List[SuccessMetric] = Field(default_factory=list, max_length=LIST_LIMIT)
    risks: List[Risk] = Field(default_factory=list, max_length=LIST_LIMIT)
    roadmap: List[RoadmapPhase] = Field(default_factory=list, max_length=LIST_LIMIT)
    edge_cases: List[str] = Field(default_factory=list, max_length=LIST_LIMIT)
    open_questions: List[str] = Field(default_factory=list, max_length=LIST_LIMIT)

    model_config = {"extra": "forbid"}
