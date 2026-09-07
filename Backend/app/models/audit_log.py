from sqlalchemy import Column, String, Integer, DateTime
from datetime import datetime, timezone
from app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=True)
    user_name = Column(String, nullable=True)
    user_role = Column(String, nullable=True)
    action = Column(String, nullable=False)
    method = Column(String, nullable=False)
    endpoint = Column(String, nullable=False)
    status_code = Column(Integer, default=200)
    ip = Column(String, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(String, primary_key=True, index=True)
    event_type = Column(String, nullable=False)
    user_id = Column(String, nullable=True)
    user_role = Column(String, nullable=True)
    ip = Column(String, nullable=True)
    path = Column(String, nullable=False)
    method = Column(String, nullable=False)
    severity = Column(String, default="MEDIUM") # LOW | MEDIUM | HIGH | CRITICAL
    details = Column(String, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
