from pydantic import BaseModel
from typing import Optional

class NotificationCreate(BaseModel):
    recipientId: str
    recipientName: Optional[str] = "Patient"
    type: Optional[str] = "Appointment Reminder"
    channel: Optional[str] = "In-App & SMS"
    message: str

class NotificationResponse(BaseModel):
    id: str
    recipientId: str
    recipientName: str
    type: str
    channel: str
    message: str
    status: str
    createdAt: Optional[str] = None

    class Config:
        from_attributes = True
