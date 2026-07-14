from app.models.login_session import LoginSession


def create_login_session(
    db,
    user_id,
    session_id,
    ip_address=None,
    device=None
):

    session = LoginSession(
        user_id=user_id,
        session_id=session_id,
        ip_address=ip_address,
        device=device,
        status="ACTIVE"
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session