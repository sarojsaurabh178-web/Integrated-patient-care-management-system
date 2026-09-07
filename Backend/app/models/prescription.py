from sqlalchemy import Column, String, DateTime, JSON
from datetime import datetime, timezone
from app.database import Base

class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(String, primary_key=True, index=True)
    consultation_id = Column(String, nullable=True)
    patient_id = Column(String, index=True, nullable=False)
    patient_name = Column(String, nullable=False)
    doctor_id = Column(String, index=True, nullable=False)
    doctor_name = Column(String, nullable=False)
    medicines = Column(JSON, nullable=False) # List of medicines with name, dosage, duration, instructions
    instructions = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
