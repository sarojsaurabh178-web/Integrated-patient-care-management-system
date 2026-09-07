from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.jwt import decode_access_token
from app.repositories.user_repository import UserRepository
from app.repositories.audit_repository import AuditRepository
from typing import List, Callable

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        AuditRepository.add_security_event(db, {
            "eventType": "UNAUTHORIZED_ACCESS_ATTEMPT",
            "path": "/protected",
            "method": "REQUEST",
            "severity": "WARNING",
            "details": "Missing Authorization header"
        })
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access denied. Bearer authentication token required."
        )

    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        AuditRepository.add_security_event(db, {
            "eventType": "INVALID_TOKEN_ATTEMPT",
            "path": "/protected",
            "method": "REQUEST",
            "severity": "HIGH",
            "details": "Expired or tampered JWT token provided"
        })
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token."
        )

    user = UserRepository.get_by_id(db, payload.get("id"))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user account no longer exists."
        )

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "name": user.name
    }

def require_roles(*allowed_roles: str):
    def role_checker(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
        if current_user.get("role") not in allowed_roles:
            AuditRepository.add_security_event(db, {
                "eventType": "ROLE_AUTHORIZATION_FAILURE",
                "userId": current_user.get("id"),
                "userRole": current_user.get("role"),
                "severity": "HIGH",
                "details": f"User attempted restricted action requiring [{', '.join(allowed_roles)}]"
            })
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden. Action requires one of roles: [{', '.join(allowed_roles)}]."
            )
        return current_user
    return role_checker
