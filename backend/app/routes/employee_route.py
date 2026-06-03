from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.services.employee_service import (
    create_employee,
    get_all_employees,
    get_employee_by_id,
    update_employee,
    delete_employee
)
from app.database.database import get_db
from app.config.auth_bearer import verify_token
from app.models.user_model import User

from app.schemas.employee_schema import (
    EmployeeCreate,
    EmployeeResponse,
    EmployeeUpdate
)

router = APIRouter(
    prefix="/api/v1",
    tags=["Employees"]
)

@router.post(
    "/employees",
    response_model=EmployeeResponse
)
def add_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    payload: dict = Depends(verify_token)
):
    # enforce server-side permission: only superusers or specific email may add employees
    email = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if not user.is_su and email != 'shahae@yopmail.com':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to add employees")

    return create_employee(db, employee)

@router.get(
    "/employees",
    response_model=list[EmployeeResponse]
)
def get_employees(
    db: Session = Depends(get_db)
):
    return get_all_employees(db)

@router.get(
    "/employees/{employee_id}",
    response_model=EmployeeResponse
)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db)
):
    return get_employee_by_id(db, employee_id)

@router.put(
    "/employees/{employee_id}",
    response_model=EmployeeResponse
)
def edit_employee(
    employee_id: int,
    employee: EmployeeUpdate,
    db: Session = Depends(get_db)
):
    return update_employee(db, employee_id, employee)

@router.delete(
    "/employees/{employee_id}"
)
def remove_employee(
    employee_id: int,
    db: Session = Depends(get_db)
):
    return delete_employee(db, employee_id)