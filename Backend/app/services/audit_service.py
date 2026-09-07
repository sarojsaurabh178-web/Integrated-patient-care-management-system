from sqlalchemy.orm import Session
from app.repositories.audit_repository import AuditRepository

class AuditService:
    @staticmethod
    def get_audit_logs(db: Session, limit: int = 50):
        return AuditRepository.get_audit_logs(db, limit)

    @staticmethod
    def get_security_events(db: Session, limit: int = 50):
        return AuditRepository.get_security_events(db, limit)
