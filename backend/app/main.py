from fastapi import FastAPI

import app.models

from app.api.auth_routes import router as auth_router
from app.api.transaction_routes import router as transaction_router
from app.api.document_routes import router as document_router
from app.api.user_routes import router as user_router
from app.api.analytics_routes import router as analytics_router
from app.api.forecast_routes import router as forecast_router


app = FastAPI(
    title="AI-Powered Personal Finance Copilot",
    description="Backend API for managing personal finance, AI chat, forecasting, and anomaly detection.",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Welcome to the AI-Powered Personal Finance Copilot API 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


app.include_router(auth_router)
app.include_router(transaction_router)
app.include_router(document_router)
app.include_router(user_router)
app.include_router(analytics_router)
app.include_router(forecast_router)