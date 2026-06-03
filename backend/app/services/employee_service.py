from sqlalchemy.orm import Session
from app.models.employee_model import Employee
from app.schemas.employee_schema import EmployeeCreate

def create_employee(
    db: Session,
    employee: EmployeeCreate
):
    db_employee = Employee(
        name=employee.name,
        email=employee.email,
        mobile=employee.mobile,
        department=employee.department,
        designation=employee.designation,
        salary=employee.salary,
        joining_date=employee.joining_date
    )

    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)

    print(db_employee.status)
    return db_employee


def get_all_employees(db: Session):
    return db.query(Employee).all()

from fastapi import HTTPException

def get_employee_by_id(
    db: Session,
    employee_id: int
):

    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return employee 

def update_employee(
    db: Session,
    employee_id: int,
    employee_data
):

    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    employee.name = employee_data.name
    employee.email = employee_data.email
    employee.mobile = employee_data.mobile
    employee.department = employee_data.department
    employee.designation = employee_data.designation
    employee.salary = employee_data.salary
    employee.joining_date = employee_data.joining_date
    employee.status = employee_data.status

    db.commit()
    db.refresh(employee)

    return employee


def delete_employee(
    db: Session,
    employee_id: int
):

    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    db.delete(employee)
    db.commit()

    return {
        "message": "Employee deleted successfully"
    }