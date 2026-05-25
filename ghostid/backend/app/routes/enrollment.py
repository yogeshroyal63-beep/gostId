import numpy as np
from fastapi import APIRouter, HTTPException
from app.models.schemas import EnrollmentData, EnrollmentResponse, EnrollmentStatus
from app.services.enrollment import enrollment_service

router = APIRouter()


@router.post("/enroll", response_model=EnrollmentResponse)
def enroll_user(data: EnrollmentData):
    features = np.array(data.features, dtype=np.float32)
    sessions = enrollment_service.enroll(data.user_id, features)
    return EnrollmentResponse(
        user_id=data.user_id,
        enrolled_sessions=sessions,
        status="enrolled",
    )


@router.get("/enroll/{user_id}", response_model=EnrollmentStatus)
def check_enrollment(user_id: str):
    return EnrollmentStatus(
        enrolled=enrollment_service.is_enrolled(user_id),
        sessions=enrollment_service.session_count(user_id),
    )


@router.delete("/enroll/{user_id}")
def delete_enrollment(user_id: str):
    if not enrollment_service.is_enrolled(user_id):
        raise HTTPException(status_code=404, detail="User not enrolled")
    enrollment_service.delete(user_id)
    return {"user_id": user_id, "status": "deleted"}
