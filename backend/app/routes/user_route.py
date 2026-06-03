from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.user_schema import RegisterUser, LoginUser, UpdateUser, ForgotPasswordRequest, ResetPasswordRequest, MessageResponse, VerifyOTPRequest, UserResponse
from app.config.auth_bearer import verify_token
from app.config.email_service import send_otp_email
from app.services.user_service import register_user, login_user
from app.config.jwt_handler import create_access_token
from app.models.user_model import User
import random
import string
from datetime import datetime, timedelta

# OTP storage: {email: {otp: str, expires_at: datetime}}
otp_storage = {}

router = APIRouter(
    prefix="/api/v1",
    tags=["Authentication"]
)

@router.post("/register", response_model=MessageResponse)
def register(user: RegisterUser, db: Session = Depends(get_db)):
    return register_user(db, user)

@router.post("/login")
def login(user: LoginUser, db: Session = Depends(get_db)):
    return login_user(db, user)

def get_current_user(payload: dict, db: Session) -> User:
    email = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user


@router.get("/profile", response_model=UserResponse)
def profile(
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    user = get_current_user(payload, db)

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "mobile": user.mobile,
        "status": user.status or 'Active',
        "is_su": bool(user.is_su)
    }


@router.put("/profile")
def update_profile(
    user_update: UpdateUser,
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    email = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if user_update.name is not None:
        user.name = user_update.name
    if user_update.mobile is not None:
        user.mobile = user_update.mobile
    if user_update.status is not None:
        normalized = user_update.status.strip().title()
        if normalized not in ["Active", "Inactive"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Status must be Active or Inactive"
            )
        user.status = normalized

    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "mobile": user.mobile,
        "status": user.status or 'Active',
        "is_su": bool(user.is_su)
    }


@router.get("/admin/users", response_model=list[UserResponse])
def list_users(
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    current_user = get_current_user(payload, db)
    if not current_user.is_su:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    users = db.query(User).all()
    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "mobile": user.mobile,
            "status": user.status or 'Active',
            "is_su": bool(user.is_su)
        }
        for user in users
    ]


@router.post("/admin/users/{user_id}/toggle-superuser", response_model=MessageResponse)
def toggle_superuser(
    user_id: int,
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    current_user = get_current_user(payload, db)
    if not current_user.is_su:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user.is_su = not bool(user.is_su)
    db.commit()
    db.refresh(user)

    return {"message": f"User {user.email} is_su={user.is_su}"}


@router.post("/admin/login")
def admin_login(user: LoginUser, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not db_user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    from app.config.security import verify_password
    if not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if not bool(db_user.is_su):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Superuser access required"
        )

    access_token = create_access_token({
        "sub": db_user.email,
        "is_su": True
    })

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/admin/users/{user_id}", response_model=UserResponse)
def admin_get_user(
    user_id: int,
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    current_user = get_current_user(payload, db)
    if not current_user.is_su:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "mobile": user.mobile,
        "status": user.status or 'Active',
        "is_su": bool(user.is_su)
    }


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == request.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email not found in our system"
        )

    # Generate 6-digit OTP
    otp = ''.join(random.choices(string.digits, k=6))
    
    # Store OTP with 10 minute expiration
    otp_storage[request.email] = {
        "otp": otp,
        "expires_at": datetime.now() + timedelta(minutes=10)
    }

    # Send OTP via email
    email_sent = send_otp_email(request.email, otp)
    
    if not email_sent:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP email. Please check your email configuration."
        )

    return {
        "message": "OTP has been sent to your email. Please check your inbox and enter the code below."
    }


@router.post("/verify-otp", response_model=MessageResponse)
def verify_otp(
    request: VerifyOTPRequest,
    db: Session = Depends(get_db)
):
    if request.email not in otp_storage:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No OTP found for this email. Request a new one."
        )

    otp_data = otp_storage[request.email]
    
    # Check if OTP expired
    if datetime.now() > otp_data["expires_at"]:
        del otp_storage[request.email]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired. Request a new one."
        )

    # Verify OTP
    if otp_data["otp"] != request.otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP"
        )

    return {"message": "OTP verified successfully"}


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    # Verify OTP was provided and is valid
    if request.email not in otp_storage:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid request. Please verify OTP first."
        )

    otp_data = otp_storage[request.email]
    
    # Check if OTP expired
    if datetime.now() > otp_data["expires_at"]:
        del otp_storage[request.email]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired. Request a new one."
        )

    # Verify OTP matches
    if otp_data["otp"] != request.otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP"
        )

    if request.new_password != request.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )

    if len(request.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters"
        )

    user = db.query(User).filter(User.email == request.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    from app.config.security import hash_password
    user.password = hash_password(request.new_password)
    db.commit()

    # Clear OTP after successful reset
    del otp_storage[request.email]

    return {"message": "Password reset successfully"}
    db.refresh(user)

    return {"message": "Password has been reset successfully. Please log in with your new password."}
