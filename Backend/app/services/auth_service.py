from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.user_repository import UserRepository
from app.repositories.audit_repository import AuditRepository
from app.utils.jwt import create_access_token
from app.schemas.auth import UserLogin, UserRegister

class AuthService:
    @staticmethod
    def login(db: Session, login_data: UserLogin, ip: str = "127.0.0.1"):
        user = UserRepository.get_by_username(db, login_data.username)
        if not user:
            AuditRepository.add_security_event(db, {
                "eventType": "FAILED_LOGIN_ATTEMPT",
                "ip": ip,
                "path": "/api/v1/auth/login",
                "method": "POST",
                "severity": "MEDIUM",
                "details": f"Non-existent username attempt: {login_data.username}"
            })
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password credentials.")

        if not UserRepository.verify_password(login_data.password, user.password_hash):
            AuditRepository.add_security_event(db, {
                "eventType": "FAILED_LOGIN_ATTEMPT",
                "userId": user.id,
                "userRole": user.role,
                "ip": ip,
                "path": "/api/v1/auth/login",
                "method": "POST",
                "severity": "HIGH",
                "details": f"Incorrect password entered for user: {login_data.username}"
            })
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password credentials.")

        token = create_access_token({"id": user.id, "username": user.username, "role": user.role})
        return {"token": token, "user": user}

    @staticmethod
    def register(db: Session, reg_data: UserRegister):
        existing = UserRepository.get_by_username(db, reg_data.username)
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username is already taken.")

        new_user = UserRepository.create(
            db,
            username=reg_data.username,
            password=reg_data.password,
            name=reg_data.name,
            email=reg_data.email,
            role=reg_data.role or "Patient"
        )
        token = create_access_token({"id": new_user.id, "username": new_user.username, "role": new_user.role})
        return {"token": token, "user": new_user}
