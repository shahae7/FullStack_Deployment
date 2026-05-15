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


class MessageResponse(BaseModel):

    message: str