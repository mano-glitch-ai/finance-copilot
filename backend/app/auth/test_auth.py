from app.auth.hashing import hash_password
from app.auth.jwt_handler import create_access_token

password = "finance123"

hashed = hash_password(password)

print("Password:")
print(password)

print("\nHashed:")
print(hashed)

token = create_access_token(
    {
        "sub": "test@example.com"
    }
)

print("\nJWT:")
print(token)