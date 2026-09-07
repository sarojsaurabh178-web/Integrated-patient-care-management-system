from sqlalchemy import Column, String, Integer, Boolean, DateTime
from datetime import datetime, timezone
from app.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    full_name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    address = Column(String, nullable=True)
    emergency_contact = Column(String, nullable=True)
    blood_group = Column(String, nullable=True, default="O+")
    medical_history_notes = Column(String, nullable=True)
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
