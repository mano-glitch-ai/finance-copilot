from app.database.connection import Base, engine

# Import models here
from app.models.user import User
from app.models.transaction import Transaction
from app.models.document import Document
from app.models.login_session import LoginSession
from app.models.audit_log import AuditLog
print("Creating database tables...")

Base.metadata.create_all(bind=engine)

print("✅ Tables created successfully!")
