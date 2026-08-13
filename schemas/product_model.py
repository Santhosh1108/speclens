from typing import List
from pydantic import BaseModel, Field


class Requirement(BaseModel):
    description: str
    type: str = "functional"


class UserStory(BaseModel):
    actor: str
    action: str
    goal: str


class AcceptanceCriterion(BaseModel):
    description: str


class ProductModel(BaseModel):
    product: str
    problem: str
    users: List[str] = Field(default_factory=list)
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
