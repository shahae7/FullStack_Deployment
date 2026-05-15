from sqlalchemy.orm import Session

from app.models.user_model import User

from app.schemas.user_schema import (
    RegisterUser,
    LoginUser
)

from app.config.security import hash_password , verify_password 

from app.config.jwt_handler import (
    create_access_token
)

def register_user(
    db: Session,
    user: RegisterUser
):

    if user.password != user.confirm_password:

        return {
            "message": "Passwords do not match"
        }

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:

        return {
            "message": "Email already registered"
        }

    db_user = User(
        name=user.name,
        email=user.email,
        mobile=user.mobile,
        password=hash_password(user.password)
    )

    db.add(db_user)

    db.commit()

    db.refresh(db_user)

    return {
        "message": "User registered successfully"
    }

def login_user(
    db: Session,
    user: LoginUser
):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:

        return {
            "message": "Invalid email"
        }

    if not verify_password(
        user.password,
        db_user.password
    ):

        return {
            "message": "Invalid password"
        }

    access_token = create_access_token({
        "sub": db_user.email
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }