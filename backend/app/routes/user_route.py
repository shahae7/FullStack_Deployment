from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.user_schema import (
    RegisterUser,
    LoginUser,
    MessageResponse
)
from app.config.auth_bearer import (
    verify_token
)

from app.services.user_service import (
    register_user,
    login_user
)

router = APIRouter(
    prefix="/api/v1",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=MessageResponse
)
def register(
    user: RegisterUser,
    db: Session = Depends(get_db)
):

    return register_user(
        db,
        user
    )

@router.post("/login")
def login(
    user: LoginUser,
    db: Session = Depends(get_db)
):

    return login_user(
        db,
        user
    )
@router.get("/profile")
def profile(
    payload: dict = Depends(verify_token)
):

    return {
        "message": "Protected route accessed",
        "user": payload
    }