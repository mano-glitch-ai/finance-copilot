from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    DateTime,
    ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.connection import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    document_id = Column(
        Integer,
        ForeignKey("documents.id"),
        nullable=False
    )

    transaction_id = Column(
        String(50),
        unique=True,
        nullable=False
    )

    date = Column(Date, nullable=False)

    transaction_description = Column(
        String(255),
        nullable=False
    )

    merchant_name = Column(String(255))

    amount = Column(Float, nullable=False)

    transaction_type = Column(
        String(20),
        nullable=False
    )

    category = Column(
        String(100),
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user = relationship(
        "User",
        back_populates="transactions"
    )

    document = relationship(
        "Document",
        back_populates="transactions"
    )