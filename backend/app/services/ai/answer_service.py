import os

from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile",
    temperature=0.2
)


def generate_answer(question: str, context: str):

    prompt = f"""
You are an AI Personal Finance Copilot.

Answer ONLY using the provided financial information.

Be concise.

If the information is insufficient,
say so honestly.

Question:

{question}

Financial Information:

{context}

Answer:
"""

    response = llm.invoke(prompt)

    return response.content