# 💰 AI-Powered Personal Finance Copilot

> An AI-driven personal finance assistant that transforms scattered bank statements, receipts, and transaction histories into actionable financial insights, intelligent forecasts, anomaly detection, and conversational financial assistance.

![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql)
![LangGraph](https://img.shields.io/badge/LangGraph-AI-purple)
![ChromaDB](https://img.shields.io/badge/ChromaDB-VectorDB-orange)
![n8n](https://img.shields.io/badge/n8n-Automation-ef6d1f)
![License](https://img.shields.io/badge/License-MIT-green)

---

# 📌 Overview

Managing personal finances often requires switching between bank statements, receipts, budgeting tools, and spreadsheets.

**AI-Powered Personal Finance Copilot** combines Machine Learning, Retrieval-Augmented Generation (RAG), LangGraph agents, forecasting, and workflow automation into a single intelligent platform.

The application allows users to:

- 🔐 Securely authenticate
- 📄 Upload bank statements (CSV/PDF)
- 📷 Parse receipt images using OCR
- 🤖 Automatically categorize transactions using ML
- 📊 Visualize spending analytics
- 📈 Predict future expenses
- 🚨 Detect unusual spending patterns
- 💬 Ask natural-language questions about personal finances
- ⚙️ Generate AI-powered weekly financial summaries using n8n + Gemini

---

# ✨ Features

## 🔐 Authentication

- JWT-based authentication
- Secure login & registration
- Protected routes
- User-specific financial data

---

## 📄 Multi-format Data Ingestion

Supports:

- CSV bank statements
- PDF bank statements
- Receipt images (OCR)

Uploaded documents are automatically parsed and stored in PostgreSQL.

---

## 🤖 AI Transaction Categorization

A Machine Learning model automatically predicts transaction categories such as:

- Grocery
- Shopping
- Travel
- Bills
- Entertainment
- Salary
- Healthcare
- Restaurants

Users can review categorized transactions directly from the dashboard.

---

## 📊 Interactive Dashboard

Beautiful React dashboard featuring:

- Total Income
- Total Expenses
- Balance
- Savings Rate
- Financial Health Score
- Spending Distribution
- Recent Transactions

---

## 📈 Expense Forecasting

Uses Facebook Prophet to forecast future expenses based on historical spending.

Displays:

- Daily predictions
- Forecast trend
- Upper & Lower confidence bounds
- Forecast statistics

---

## 🚨 Anomaly Detection

Automatically identifies transactions that significantly exceed historical spending patterns.

Example:

```
⚠️ Shopping expense unusually higher than average
```

Displayed directly inside the dashboard.

---

## 💬 AI Financial Assistant

Powered by:

- LangGraph
- ChromaDB
- Google Gemini
- RAG

Users can ask:

- Where did I spend the most?
- Show salary transactions.
- How much did I spend on shopping?
- Summarize my finances.
- Forecast next month's expenses.

The assistant answers using the user's own financial history.

---

## ⚙️ Workflow Automation

n8n workflow automatically:

1. Authenticates user
2. Retrieves weekly analytics
3. Generates AI summary using Gemini
4. Ready for scheduled execution

---

# 🏗️ Architecture

```
                React Dashboard
                      │
                      ▼
                FastAPI Backend
                      │
      ┌───────────────┼────────────────┐
      ▼               ▼                ▼
 PostgreSQL      ML Models        LangGraph
      │               │                │
      ▼               ▼                ▼
Transactions   Categorization     ChromaDB
                                      │
                                      ▼
                                 Google Gemini

                      ▼

                   n8n Workflow
```

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Chart.js
- Axios

---

## Backend

- FastAPI
- SQLAlchemy
- JWT Authentication
- PostgreSQL
- Pydantic

---

## Artificial Intelligence

- Scikit-learn
- Prophet
- LangGraph
- ChromaDB
- Google Gemini Embeddings
- Retrieval-Augmented Generation (RAG)

---

## Automation

- n8n
- Google Gemini

---

# 📂 Project Structure

```
finance-copilot/

├── backend/
│   ├── app/
│   ├── services/
│   ├── api/
│   ├── models/
│   └── database/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
├── ml/
│
├── docs/
│
├── data/
│
├── chroma_db/
│
└── n8n/
```

---

# 🚀 Installation

## Clone

```bash
git clone https://github.com/mano-glitch-ai/finance-copilot.git
```

```bash
cd finance-copilot
```

---

## Backend

```bash
python -m venv .venv
```

```bash
source .venv/bin/activate
```

Windows

```bash
.venv\Scripts\activate
```

Install packages

```bash
pip install -r requirements.txt
```

Run server

```bash
uvicorn app.main:app --reload
```

---

## Frontend

```bash
cd frontend
```

```bash
npm install
```

```bash
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env`

```
DATABASE_URL=

JWT_SECRET_KEY=

GOOGLE_API_KEY=
```

---

# 📊 Machine Learning

### Transaction Categorization

Algorithm:

- Scikit-learn Classifier

Purpose:

Automatically predicts transaction categories.

---

### Forecasting

Algorithm:

- Facebook Prophet

Predicts:

- Future daily expenses
- Spending trends

---

### Anomaly Detection

Rule-based statistical model

Flags:

- Transactions significantly larger than historical category averages.

---

# 🤖 AI Components

- LangGraph Multi-Agent Workflow
- RAG Pipeline
- ChromaDB Vector Store
- Google Gemini
- Financial Question Answering

---

# ⚙️ n8n Workflow

```
Manual Trigger
      │
      ▼
Login
      │
      ▼
Weekly Summary API
      │
      ▼
Gemini
      │
      ▼
Generate Weekly Digest
```

---

# 📸 Screenshots

Add screenshots here:

- Login Page
- Dashboard
- Forecast
- Upload
- Chat Assistant
- Analytics
- n8n Workflow

---

# 🎯 Future Improvements

- Email delivery integration
- Live stock & crypto APIs
- Budget recommendations
- Investment tracking
- Mobile application
- Multi-user collaboration
- Real-time notifications

---

# 👨‍💻 Author

**Manoj Kumar**

B.Tech Computer Science Student

GitHub:
https://github.com/mano-glitch-ai

---

# ⭐ If you found this project useful, consider giving it a star!
