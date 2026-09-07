from pydantic import BaseModel
from typing import Optional, Dict, Any

class ConsultationCreate(BaseModel):
    patientId: str
    appointmentId: Optional[str] = None
    doctorId: Optional[str] = None
    doctorName: Optional[str] = None
    symptoms: Optional[str] = None
    observations: Optional[str] = None
    diagnosis: Optional[str] = None
    labResults: Optional[str] = None
    treatmentPlan: Optional[str] = None
    clinicalNotes: Optional[str] = None
    vitals: Optional[Dict[str, Any]] = None

class ConsultationResponse(BaseModel):
    id: str
    appointmentId: Optional[str] = None
    patientId: str
    patientName: str
    doctorId: str
    doctorName: str
    symptoms: Optional[str] = None
    observations: Optional[str] = None
    diagnosis: Optional[str] = None
    labResults: Optional[str] = None
    treatmentPlan: Optional[str] = None
    clinicalNotes: Optional[str] = None
    vitals: Optional[Dict[str, Any]] = None
    createdAt: Optional[str] = None

    class Config:
        from_attributes = True
