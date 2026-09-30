from sqlalchemy import Column, String, Integer, DateTime
from datetime import datetime, timezone
from app.database import Base

class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    contact_number = Column(String, nullable=False)
    emergency_number = Column(String, nullable=False, default="1066")
    email = Column(String, nullable=True)
    website = Column(String, nullable=True)
    operating_hours = Column(String, default="24 Hours Open (Emergency & Trauma Active)")
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class HospitalBed(Base):
    __tablename__ = "hospital_beds"

    id = Column(String, primary_key=True, index=True)
    bed_number = Column(String, unique=True, index=True, nullable=False)
    ward = Column(String, nullable=False, index=True) # Cardiology ICU | General Ward A | General Ward B | Emergency Trauma Unit | Pediatric Care
    type = Column(String, nullable=False, index=True) # ICU | General Ward | Emergency | Pediatric
    floor = Column(String, default="Ground Floor")
    status = Column(String, default="Available", index=True) # Available | Occupied | Reserved | Under Maintenance
    patient_id = Column(String, nullable=True)
    patient_name = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
