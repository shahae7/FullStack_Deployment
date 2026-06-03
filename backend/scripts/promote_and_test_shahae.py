import time
import requests
from app.database.database import SessionLocal
from app.models.user_model import User
from app.config.security import hash_password

API_BASE = "http://127.0.0.1:8000/api/v1"
TARGET_EMAIL = "shahae@yopmail.com"
TEMP_PASSWORD = "ShahaeSUp@123"

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

        time.sleep(1)
        r = requests.post(f"{API_BASE}/admin/login", json={"email": TARGET_EMAIL, "password": TEMP_PASSWORD})
        print('login status:', r.status_code)
        try:
            print(r.json())
        except Exception:
            print(r.text)
finally:
    session.close()
