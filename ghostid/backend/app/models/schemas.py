from pydantic import BaseModel
from typing import List, Optional


class KeystrokeFeatures(BaseModel):
    user_id: str
    features: List[float]  # 41 features


class EnrollmentData(BaseModel):
    user_id: str
    features: List[float]


class ScoreResponse(BaseModel):
    user_id: str
    confidence_score: float
    tier: str
    action: str
    source: str  # "cosine" or "lstm"


class EnrollmentResponse(BaseModel):
    user_id: str
    enrolled_sessions: int
    status: str


class EnrollmentStatus(BaseModel):
    enrolled: bool
    sessions: int


class HealthResponse(BaseModel):
    status: str
    model: str
    version: str
