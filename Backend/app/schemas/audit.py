from pydantic import BaseModel
from typing import Optional

class AuditLogResponse(BaseModel):
    id: str
    userId: Optional[str] = None
    userName: Optional[str] = None
    userRole: Optional[str] = None
    action: str
    method: str
    endpoint: str
    statusCode: int
    ip: Optional[str] = None
    timestamp: Optional[str] = None

class SecurityEventResponse(BaseModel):
    id: str
    eventType: str
    userId: Optional[str] = None
    userRole: Optional[str] = None
    ip: Optional[str] = None
    path: str
    method: str
    severity: str
    details: Optional[str] = None
    timestamp: Optional[str] = None
