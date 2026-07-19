from typing import TypedDict, List, Optional


class FinanceState(TypedDict):

    question: str

    user_id: int

    tools: List[str]

    context: str

    answer: Optional[str]