from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

import app.models

from app.api.auth_routes import router as auth_router
from app.api.transaction_routes import router as transaction_router
from app.api.document_routes import router as document_router
from app.api.user_routes import router as user_router
from app.api.analytics_routes import router as analytics_router
from app.api.forecast_routes import router as forecast_router
from app.api.chat_routes import router as chat_router
from app.api.report_routes import router as report_router

app = FastAPI(
    title="AI-Powered Personal Finance Copilot",
    description="Backend API for managing personal finance, AI chat, forecasting, and anomaly detection.",
    version="1.0.0"
)

# ---------------- CORS ----------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Root ----------------

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


# ---------------- DEBUG ----------------

@app.get("/debug/headers")
async def debug_headers(request: Request):
    return dict(request.headers)


# ---------------- Routers ----------------

app.include_router(auth_router)
app.include_router(transaction_router)
app.include_router(document_router)
app.include_router(user_router)
app.include_router(analytics_router)
app.include_router(forecast_router)
app.include_router(chat_router)
app.include_router(report_router)