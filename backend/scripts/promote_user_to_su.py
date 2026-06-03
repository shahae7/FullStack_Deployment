from app.database.database import SessionLocal
from app.models.user_model import User
from app.config.security import hash_password

TARGET_EMAIL = "shahae@example.com"
TEMP_PASSWORD = "SuP3rUser!"

session = SessionLocal()
try:
    user = session.query(User).filter(User.email == TARGET_EMAIL).first()
    if not user:
        print(f"User with email {TARGET_EMAIL} not found.")
    else:
        user.is_su = True
        user.password = hash_password(TEMP_PASSWORD)
        session.commit()
        print(f"Promoted {user.email} to superuser. Temporary password: {TEMP_PASSWORD}")
finally:
    session.close()
