from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Text
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.connection import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    action = Column(
        String(100),
        nullable=False
    )

    status = Column(
        String(30),
        nullable=False
    )

    endpoint = Column(
        String(255),
        nullable=True
    )

    http_method = Column(
        String(20),
        nullable=True
    )

    ip_address = Column(
        String(100),
        nullable=True
    )

    device = Column(
        String(255),
        nullable=True
    )

    error_code = Column(
        String(100),
        nullable=True
    )

    message = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user = relationship(
        "User",
        back_populates="audit_logs"
    )