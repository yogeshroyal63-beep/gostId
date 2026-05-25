import numpy as np
from typing import Dict, List


class EnrollmentService:
    def __init__(self):
        # In-memory store — swap with Cosmos DB for production
        self._sessions: Dict[str, List[np.ndarray]] = {}
        self._baselines: Dict[str, np.ndarray] = {}

    def enroll(self, user_id: str, features: np.ndarray) -> int:
        if user_id not in self._sessions:
            self._sessions[user_id] = []
        self._sessions[user_id].append(features)
        # Recompute baseline as mean of all sessions
        self._baselines[user_id] = np.mean(self._sessions[user_id], axis=0)
        return len(self._sessions[user_id])

    def is_enrolled(self, user_id: str) -> bool:
        return user_id in self._baselines

    def session_count(self, user_id: str) -> int:
        return len(self._sessions.get(user_id, []))

    def cosine_score(self, user_id: str, features: np.ndarray) -> float:
        baseline = self._baselines[user_id]
        dot = np.dot(features, baseline)
        norm = np.linalg.norm(features) * np.linalg.norm(baseline) + 1e-8
        similarity = dot / norm
        return float(np.clip(similarity * 100, 0, 100))

    def delete(self, user_id: str):
        self._sessions.pop(user_id, None)
        self._baselines.pop(user_id, None)


enrollment_service = EnrollmentService()
