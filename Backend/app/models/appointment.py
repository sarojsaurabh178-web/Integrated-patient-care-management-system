from sqlalchemy import Column, String, DateTime
from datetime import datetime, timezone
from app.database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, index=True, nullable=False)
    patient_name = Column(String, nullable=False)
    doctor_id = Column(String, index=True, nullable=False)
    doctor_name = Column(String, nullable=False)
    department = Column(String, nullable=True, default="General Medicine")
    date = Column(String, nullable=False, index=True) # YYYY-MM-DD
    time = Column(String, nullable=False) # e.g. 10:00 AM
    type = Column(String, default="Consultation")
    status = Column(String, default="Scheduled", index=True) # Scheduled | Completed | Cancelled | Pending
    reason = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
