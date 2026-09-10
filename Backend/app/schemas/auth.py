from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


class UserLogin(BaseModel):
    username: Optional[str] = None
    identifier: Optional[str] = None
    password: str

    model_config = ConfigDict(populate_by_name=True)


class UserRegister(BaseModel):
    username: Optional[str] = None
    password: str
    name: Optional[str] = None
    fullName: Optional[str] = Field(None, alias="full_name")
    email: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = "Patient"  # Admin | Doctor | Patient

    model_config = ConfigDict(populate_by_name=True)


class ForgotPasswordRequest(BaseModel):
    identifier: str


class VerifyOtpRequest(BaseModel):
    identifier: str
    otp: str


class ResetPasswordRequest(BaseModel):
    identifier: str
    resetToken: Optional[str] = Field(None, alias="reset_token")
    newPassword: str = Field(alias="new_password")

    model_config = ConfigDict(populate_by_name=True)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    username: str
    name: str
    email: Optional[str] = None
    role: str
    specialty: Optional[str] = None


class TokenResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    token: str
    user: UserResponse
