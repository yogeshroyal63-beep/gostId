import numpy as np
import onnxruntime as ort
from app.core.config import MODEL_PATH


class InferenceService:
    def __init__(self):
        self.session = ort.InferenceSession(MODEL_PATH)

    def predict(self, features: np.ndarray) -> float:
        """Run LSTM inference, return max class probability as confidence score."""
        x = features.reshape(1, 1, 41).astype(np.float32)
        logits = self.session.run(None, {"keystroke_features": x})[0]
        probs = np.exp(logits) / np.exp(logits).sum()
        return float(np.max(probs) * 100)


inference_service = InferenceService()
