from sqlalchemy import Column, String, DateTime, JSON
from datetime import datetime, timezone
from app.database import Base

class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(String, primary_key=True, index=True)
    appointment_id = Column(String, nullable=True)
    patient_id = Column(String, index=True, nullable=False)
    patient_name = Column(String, nullable=False)
    doctor_id = Column(String, index=True, nullable=False)
    doctor_name = Column(String, nullable=False)
    symptoms = Column(String, nullable=True)
    observations = Column(String, nullable=True)
    diagnosis = Column(String, nullable=True)
    lab_results = Column(String, nullable=True)
    treatment_plan = Column(String, nullable=True)
    clinical_notes = Column(String, nullable=True)
    vitals = Column(JSON, nullable=True) # e.g. {"bloodPressure": "120/80", "pulse": "72"}
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
