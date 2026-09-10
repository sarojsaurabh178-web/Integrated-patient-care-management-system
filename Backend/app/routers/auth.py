from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import (
    UserLogin, 
    UserRegister, 
    TokenResponse, 
    UserResponse,
    ForgotPasswordRequest,
    VerifyOtpRequest,
    ResetPasswordRequest
)
from app.services.auth_service import AuthService
from app.middlewares.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication & Access Control"])


@router.post("/login", response_model=TokenResponse)
def login(login_data: UserLogin, request: Request, db: Session = Depends(get_db)):
    ip = request.client.host if request.client else "127.0.0.1"
    return AuthService.login(db, login_data, ip=ip)


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(reg_data: UserRegister, db: Session = Depends(get_db)):
    return AuthService.register(db, reg_data)


@router.get("/me", response_model=UserResponse)
def get_profile(current_user: dict = Depends(get_current_user)):
    return current_user


@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    return AuthService.forgot_password(db, req.identifier)


@router.post("/verify-otp")
def verify_otp(req: VerifyOtpRequest):
    return AuthService.verify_otp(req.identifier, req.otp)


@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    return AuthService.reset_password(db, req.identifier, req.newPassword, req.resetToken)
