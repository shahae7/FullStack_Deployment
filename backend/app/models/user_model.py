from sqlalchemy import Boolean, Column, Integer, String

from app.database.database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(String)

    email = Column(
        String,
        unique=True
    )

    mobile = Column(String)

    status = Column(String, default="Active")

    is_su = Column(Boolean, default=False)

    password = Column(String)
