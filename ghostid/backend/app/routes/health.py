from fastapi import APIRouter
from app.models.schemas import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(
        status="ok",
        model="ghostid_lstm_v1",
        version="1.0.0",
    )
