from app.database.database import SessionLocal
from app.models.employee_model import Employee

TARGET_EMAIL = 'shahae@yopmail.com'

session = SessionLocal()
try:
    emp = session.query(Employee).filter(Employee.email == TARGET_EMAIL).first()
    if not emp:
        print('Employee not found')
    else:
        print('Old employee status:', emp.status)
        emp.status = 'Active'
        session.commit()
        print('Updated employee status to Active for', emp.email)
finally:
    session.close()
