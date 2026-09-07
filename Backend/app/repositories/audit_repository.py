from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog, SecurityEvent
from typing import List
import time

class AuditRepository:
    @staticmethod
    def add_audit_log(db: Session, data: dict) -> AuditLog:
        log_id = f"LOG-{int(time.time() * 1000)}"
        db_log = AuditLog(
            id=log_id,
            user_id=data.get("userId", "ANONYMOUS"),
            user_name=data.get("userName", "System/Guest"),
            user_role=data.get("userRole", "UNKNOWN"),
            action=data["action"],
            method=data.get("method", "GET"),
            endpoint=data.get("endpoint", "/"),
            status_code=data.get("statusCode", 200),
            ip=data.get("ip", "127.0.0.1")
        )
        db.add(db_log)
        db.commit()
        db.refresh(db_log)
        return db_log

    @staticmethod
    def get_audit_logs(db: Session, limit: int = 50) -> List[AuditLog]:
        return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()

    @staticmethod
    def add_security_event(db: Session, data: dict) -> SecurityEvent:
        sec_id = f"SEC-{int(time.time() * 1000)}"
        db_event = SecurityEvent(
            id=sec_id,
            event_type=data.get("eventType", "SECURITY_ALERT"),
            user_id=data.get("userId"),
            user_role=data.get("userRole"),
            ip=data.get("ip", "127.0.0.1"),
            path=data.get("path", "/"),
            method=data.get("method", "POST"),
            severity=data.get("severity", "MEDIUM"),
            details=data.get("details", "")
        )
        db.add(db_event)
        db.commit()
        db.refresh(db_event)
        return db_event

    @staticmethod
    def get_security_events(db: Session, limit: int = 50) -> List[SecurityEvent]:
        return db.query(SecurityEvent).order_by(SecurityEvent.timestamp.desc()).limit(limit).all()
