from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.connection import Base


class LoginSession(Base):
    __tablename__ = "login_sessions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    session_id = Column(
        String(255),
        unique=True,
        nullable=False
    )

    jwt_id = Column(
        String(255),
        nullable=True
    )

    login_time = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    logout_time = Column(
        DateTime(timezone=True),
        nullable=True
    )

    device = Column(
        String(255),
        nullable=True
    )

    ip_address = Column(
        String(100),
        nullable=True
    )

    status = Column(
        String(30),
        default="ACTIVE"
    )

    user = relationship(
        "User",
        back_populates="login_sessions"
    )