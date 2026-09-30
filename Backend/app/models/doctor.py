from sqlalchemy import Column, String, Integer, DateTime
from datetime import datetime, timezone
from app.database import Base

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=True)
    name = Column(String, nullable=False, index=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    specialization = Column(String, nullable=False, index=True)
    qualifications = Column(String, nullable=True)
    experience_years = Column(Integer, default=5)
    department = Column(String, nullable=False, index=True)
    consultation_fee = Column(String, default="₹800")
    working_days = Column(String, default="Monday - Friday")
    working_hours = Column(String, default="09:00 AM - 04:00 PM")
    duty_status = Column(String, default="On Duty", index=True) # On Duty | In Consultation | Off Duty | Emergency Call
    bio = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
