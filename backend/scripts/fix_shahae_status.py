from app.database.database import SessionLocal
from app.models.user_model import User

TARGET_EMAIL = 'shahae@yopmail.com'

session = SessionLocal()
try:
    user = session.query(User).filter(User.email == TARGET_EMAIL).first()
    if not user:
        print('User not found')
    else:
        print('Old status:', user.status)
        user.status = 'Active'
        session.commit()
        print('Updated status to Active for', user.email)
finally:
    session.close()
