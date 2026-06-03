from pydantic import BaseModel, EmailStr
from datetime import date

class EmployeeCreate(BaseModel):

    name: str

    email: EmailStr

    mobile: str

    department: str

    designation: str

    salary: float

    joining_date: date


class EmployeeResponse(EmployeeCreate):

    id: int

    status: str

    class Config:
        from_attributes = True


class EmployeeUpdate(BaseModel):

    name: str

    email: EmailStr

    mobile: str

    department: str

    designation: str

    salary: float

    joining_date: date

    status: str