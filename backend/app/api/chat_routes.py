from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User

from app.services.ai.graph import finance_graph
from app.services.ai.router_service import (
    greeting_tool,
    out_of_scope_tool,
)

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


class ChatRequest(BaseModel):
    question: str


@router.post("/")
def chat(

    request: ChatRequest,

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    # greetings are still handled directly

    if request.question.lower() in [
        "hi",
        "hello",
        "hey",
        "good morning",
        "good evening",
    ]:

        return {

            "tools": ["greeting"],

            **greeting_tool(request.question)

        }

    result = finance_graph.invoke(

        {

            "question": request.question,

            "user_id": current_user.id,

            "tools": [],

            "context": "",

            "answer": None

        }

    )

    return {

        "tools": result["tools"],

        "answer": result["answer"]

    }