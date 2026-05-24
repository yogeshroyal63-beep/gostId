from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import onnxruntime as ort
import pickle
from typing import List

app = FastAPI(title="GhostID API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ONNX model
session = ort.InferenceSession("../ml/models/ghostid_model.onnx")

class KeystrokeFeatures(BaseModel):
    user_id: str
    features: List[float]  # 41 features

class ScoreResponse(BaseModel):
    user_id: str
    confidence_score: float
    tier: str
    action: str

def get_tier(score: float):
    if score >= 85:
        return "SILENT_PASS", "log_only"
    elif score >= 70:
        return "SOFT_NUDGE", "one_tap_confirm"
    elif score >= 40:
        return "TYPING_CHALLENGE", "randomized_phrase"
    else:
        return "HARD_STOP", "sdk_callback"

@app.get("/health")
def health():
    return {"status": "ok", "model": "ghostid_lstm_v1"}

@app.post("/score", response_model=ScoreResponse)
def score_session(data: KeystrokeFeatures):
    features = np.array(data.features, dtype=np.float32).reshape(1, 1, 41)
    logits = session.run(None, {"keystroke_features": features})[0]
    probs = np.exp(logits) / np.exp(logits).sum()
    confidence = float(np.max(probs) * 100)
    tier, action = get_tier(confidence)
    
    return ScoreResponse(
        user_id=data.user_id,
        confidence_score=round(confidence, 2),
        tier=tier,
        action=action
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)