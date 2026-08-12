from dataclasses import dataclass, field
from typing import List


@dataclass
class UserStory:
    actor: str
    action: str
    goal: str


@dataclass
class Requirement:
    description: str
    type: str = "functional"


@dataclass
class AcceptanceCriterion:
    description: str


@dataclass
class FlowStep:
    id: str
    label: str
    next_steps: List[str] = field(default_factory=list)


@dataclass
class EdgeCase:
    trigger: str
    expected_behavior: str
    severity: str = "medium"


@dataclass
class ProductModel:
    product: str
    problem: str
    users: List[str] = field(default_factory=list)
    goals: List[str] = field(default_factory=list)
    requirements: List[Requirement] = field(default_factory=list)
    user_stories: List[UserStory] = field(default_factory=list)
    acceptance_criteria: List[AcceptanceCriterion] = field(
        default_factory=list
    )
    flow: List[FlowStep] = field(default_factory=list)
    edge_cases: List[EdgeCase] = field(default_factory=list)
    missing_requirements: List[str] = field(default_factory=list)