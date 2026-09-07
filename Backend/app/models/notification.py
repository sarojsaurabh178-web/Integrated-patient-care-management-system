from sqlalchemy import Column, String, DateTime
from datetime import datetime, timezone
from app.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, index=True)
    recipient_id = Column(String, index=True, nullable=False)
    recipient_name = Column(String, nullable=False)
    type = Column(String, nullable=False) # Appointment Reminder | Prescription Alert | Follow-Up Reminder | Missed Appointment
    channel = Column(String, default="In-App") # Email | SMS | In-App
    message = Column(String, nullable=False)
    status = Column(String, default="Sent") # Sent | Delivered | Read
    scheduled_for = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
