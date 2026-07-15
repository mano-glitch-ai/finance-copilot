from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.auth.jwt_handler import verify_token

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):

    print("=" * 60)
    print("RAW HEADER:", credentials)
    print("TOKEN:", credentials.credentials)
    print("=" * 60)

    payload = verify_token(credentials.credentials)

    print("PAYLOAD:", payload)

    email = payload.get("sub")

    user = db.query(User).filter(
        User.email == email
    ).first()

    print("USER:", user)

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user