import uuid

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.user_schema import UserCreate, UserLogin

from app.auth.hashing import hash_password, verify_password
from app.auth.jwt_handler import create_access_token

from app.services.auth_service import create_login_session
from app.services.audit_service import create_audit_log

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(
    request: Request,
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:

        create_audit_log(
            db=db,
            action="REGISTER",
            status="FAILED",
            message="Email already exists",
            endpoint=str(request.url.path),
            http_method=request.method,
            ip_address=request.client.host,
            device=request.headers.get("user-agent"),
            error_code="EMAIL_EXISTS"
        )

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    create_audit_log(
        db=db,
        user_id=new_user.id,
        action="REGISTER",
        status="SUCCESS",
        message="User registered successfully",
        endpoint=str(request.url.path),
        http_method=request.method,
        ip_address=request.client.host,
        device=request.headers.get("user-agent")
    )

    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.full_name,
            "email": new_user.email
        }
    }


@router.post("/login")
def login(
    request: Request,
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:

        create_audit_log(
            db=db,
            action="LOGIN",
            status="FAILED",
            message=f"Unknown email attempted: {user.email}",
            endpoint=str(request.url.path),
            http_method=request.method,
            ip_address=request.client.host,
            device=request.headers.get("user-agent"),
            error_code="INVALID_EMAIL"
        )

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        user.password,
        db_user.hashed_password
    ):

        create_audit_log(
            db=db,
            user_id=db_user.id,
            action="LOGIN",
            status="FAILED",
            message="Incorrect password",
            endpoint=str(request.url.path),
            http_method=request.method,
            ip_address=request.client.host,
            device=request.headers.get("user-agent"),
            error_code="INVALID_PASSWORD"
        )

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    session_id = str(uuid.uuid4())

    create_login_session(
        db=db,
        user_id=db_user.id,
        session_id=session_id,
        ip_address=request.client.host,
        device=request.headers.get("user-agent")
    )

    create_audit_log(
        db=db,
        user_id=db_user.id,
        action="LOGIN",
        status="SUCCESS",
        message="User logged in successfully",
        endpoint=str(request.url.path),
        http_method=request.method,
        ip_address=request.client.host,
        device=request.headers.get("user-agent")
    )

    token = create_access_token(
        {
            "sub": db_user.email,
            "user_id": db_user.id,
            "session_id": session_id
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }