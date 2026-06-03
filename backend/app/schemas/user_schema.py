from typing import List, Optional

from pydantic import BaseModel, EmailStr


class RegisterUser(BaseModel):

    name: str

    email: EmailStr

    mobile: str

    password: str

    confirm_password: str


class LoginUser(BaseModel):

    email: EmailStr

    password: str


class UpdateUser(BaseModel):

    name: Optional[str] = None

    mobile: Optional[str] = None

    status: Optional[str] = None


class ForgotPasswordRequest(BaseModel):

    email: EmailStr


class VerifyOTPRequest(BaseModel):

    email: EmailStr

    otp: str


class ResetPasswordRequest(BaseModel):

    email: EmailStr

    otp: str

    new_password: str

    confirm_password: str


class UserResponse(BaseModel):

    id: int

    name: str

    email: EmailStr

    mobile: Optional[str] = None

    status: Optional[str] = None

    is_su: bool = False


class MessageResponse(BaseModel):

    message: str
