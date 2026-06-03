import time
import requests

from app.database.database import SessionLocal
from app.models.user_model import User
from app.config.security import hash_password

API_BASE = "http://127.0.0.1:8000/api/v1"
ADMIN_EMAIL = "admin_test@example.com"
ADMIN_PWD = "TestPass123"

session = SessionLocal()

try:
    user = session.query(User).filter(User.email == ADMIN_EMAIL).first()
    if not user:
        print("Creating temp admin user...")
        user = User(
            name="Admin Test",
            email=ADMIN_EMAIL,
            mobile="",
            password=hash_password(ADMIN_PWD),
            status='Active',
            is_su=True
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        print(f"Created user id={user.id} email={user.email}")
    else:
        print(f"User exists id={user.id} email={user.email} - setting is_su=True")
        user.is_su = True
        user.password = hash_password(ADMIN_PWD)
        session.commit()

    # Wait a moment for server readiness
    time.sleep(1)

    # Attempt admin login
    print("Calling /admin/login...")
    r = requests.post(f"{API_BASE}/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PWD})
    print("Status:", r.status_code)
    try:
        print("Response:", r.json())
    except Exception:
        print(r.text)

    if r.status_code == 200 and 'access_token' in r.json():
        token = r.json()['access_token']
        headers = {"Authorization": f"Bearer {token}"}
        user_id = user.id
        print(f"Calling /admin/users/{user_id} with token...")
        r2 = requests.get(f"{API_BASE}/admin/users/{user_id}", headers=headers)
        print("Status:", r2.status_code)
        try:
            print("Response:", r2.json())
        except Exception:
            print(r2.text)
    else:
        print("Admin login failed, cannot call user-detail endpoint.")

finally:
    session.close()
