from pydantic import BaseModel, EmailStr
from typing import Optional

class UserLogin(BaseModel):
    username: str
    password: str

class UserRegister(BaseModel):
    username: str
    password: str
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = "Patient" # Admin | Doctor | Patient

class UserResponse(BaseModel):
    id: str
    username: str
    name: str
    email: Optional[str] = None
    role: str
    specialty: Optional[str] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    token: str
    user: UserResponse
