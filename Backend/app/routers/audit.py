from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.audit import AuditLogResponse, SecurityEventResponse
from app.services.audit_service import AuditService
from app.middlewares.auth import require_roles

router = APIRouter(prefix="/audit", tags=["Audit Logging & Security Monitoring"])

@router.get("/logs", response_model=List[AuditLogResponse])
def get_audit_logs(
    limit: int = Query(50, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_roles("Admin"))
):
    return AuditService.get_audit_logs(db, limit)

@router.get("/security-events", response_model=List[SecurityEventResponse])
def get_security_events(
    limit: int = Query(50, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_roles("Admin"))
):
    return AuditService.get_security_events(db, limit)
