from app.database.database import SessionLocal
from app.models.user_model import User

session = SessionLocal()
try:
    users = session.query(User).all()
    for u in users:
        print(u.id, u.name, u.email, 'is_su=', u.is_su)
finally:
    session.close()
