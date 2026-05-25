from fastapi import FastAPI
from app.core.middleware import register_middleware
from app.routes import health, score, enrollment

app = FastAPI(
    title="GhostID API",
    description="Continuous Behavioral Session Verification",
    version="1.0.0",
)

register_middleware(app)

app.include_router(health.router)
app.include_router(score.router)
app.include_router(enrollment.router)

if __name__ == "__main__":
    import uvicorn
    from app.core.config import PORT
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)
