from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.user_model import User
from app.schemas.user_schema import RegisterUser, LoginUser
from app.config.security import hash_password, verify_password
from app.config.jwt_handler import create_access_token


def register_user(db: Session, user: RegisterUser):

    if user.password != user.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )

    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    db_user = User(
        name=user.name,
        email=user.email,
        mobile=user.mobile,
        status='Active',
        is_su=False,
        password=hash_password(user.password)
    )

    existing_superuser = db.query(User).filter(User.is_su == True).first()
    if not existing_superuser:
        db_user.is_su = True

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {"message": "User registered successfully"}


def login_user(db: Session, user: LoginUser):

    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token = create_access_token({
        "sub": db_user.email,
        "is_su": bool(db_user.is_su)
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }