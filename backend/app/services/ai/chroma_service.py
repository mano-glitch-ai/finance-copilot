from langchain_core.documents import Document
from langchain_chroma import Chroma

from app.services.ai.embeddings import embedding_model


vector_db = Chroma(
    collection_name="finance_transactions",
    embedding_function=embedding_model,
    persist_directory="chroma_db"
)


def create_document(transaction):

    text = f"""
Date: {transaction.date}

Merchant: {transaction.merchant_name}

Description: {transaction.transaction_description}

Category: {transaction.category}

Transaction Type: {transaction.transaction_type}

Amount: ₹{transaction.amount}

Transaction ID: {transaction.transaction_id}
"""

    metadata = {
        "user_id": transaction.user_id,
        "document_id": transaction.document_id,
        "transaction_id": transaction.transaction_id,
        "merchant": transaction.merchant_name,
        "category": transaction.category,
        "amount": float(transaction.amount),
        "date": str(transaction.date),
    }

    return Document(
        page_content=text,
        metadata=metadata
    )


def index_transactions(transactions):

    documents = [
        create_document(transaction)
        for transaction in transactions
    ]

    if documents:
        vector_db.add_documents(documents)
        print(f"✅ Indexed {len(documents)} transactions into Chroma.")