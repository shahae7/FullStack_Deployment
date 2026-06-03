from sqlalchemy import Column, Integer, String, Float, Date
from app.database.database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=False)

    mobile = Column(String, nullable=False)

    department = Column(String, nullable=False)

    designation = Column(String, nullable=False)

    salary = Column(Float, nullable=False)

    joining_date = Column(Date, nullable=False)

    status = Column(String, default="Active")