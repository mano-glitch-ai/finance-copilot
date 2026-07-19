from app.services.ai.chroma_service import vector_db


def search_transactions(
    query: str,
    user_id: int,
    k: int = 5
):
    """
    Search the authenticated user's transactions.
    """

    results = vector_db.similarity_search(
        query=query,
        k=k,
        filter={
            "user_id": user_id
        }
    )

    return results