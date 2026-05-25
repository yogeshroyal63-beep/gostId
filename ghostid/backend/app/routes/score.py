import numpy as np
from fastapi import APIRouter
from app.models.schemas import KeystrokeFeatures, ScoreResponse
from app.services.enrollment import enrollment_service
from app.services.inference import inference_service
from app.services.scoring import get_tier

router = APIRouter()


@router.post("/score", response_model=ScoreResponse)
def score_session(data: KeystrokeFeatures):
    features = np.array(data.features, dtype=np.float32)

    if enrollment_service.is_enrolled(data.user_id):
        # Compare against enrolled baseline
        confidence = enrollment_service.cosine_score(data.user_id, features)
        source = "cosine"
    else:
        # Fallback to LSTM classification
        confidence = inference_service.predict(features)
        source = "lstm"

    tier, action = get_tier(confidence)

    return ScoreResponse(
        user_id=data.user_id,
        confidence_score=round(confidence, 2),
        tier=tier,
        action=action,
        source=source,
    )
