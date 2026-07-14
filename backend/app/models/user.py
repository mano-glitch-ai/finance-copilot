from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.connection import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    transactions = relationship(
        "Transaction",
        back_populates="user"
    )

    documents = relationship(
        "Document",
        back_populates="user"
    )

    login_sessions = relationship(
        "LoginSession",
        back_populates="user"
    )

    audit_logs = relationship(
        "AuditLog",
        back_populates="user"
    ) 