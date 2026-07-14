from app.models.audit_log import AuditLog


def create_audit_log(
    db,
    action,
    status,
    user_id=None,
    message=None,
    endpoint=None,
    http_method=None,
    ip_address=None,
    device=None,
    error_code=None
):

    log = AuditLog(
        user_id=user_id,
        action=action,
        status=status,
        message=message,
        endpoint=endpoint,
        http_method=http_method,
        ip_address=ip_address,
        device=device,
        error_code=error_code
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return log