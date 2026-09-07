from pydantic import BaseModel
from typing import Optional

class AppointmentCreate(BaseModel):
    patientId: str
    doctorId: Optional[str] = "D-01"
    doctorName: Optional[str] = None
    department: Optional[str] = "General Medicine"
    date: str # YYYY-MM-DD
    time: str # e.g. 10:00 AM
    type: Optional[str] = "Consultation"
    reason: Optional[str] = "General Health Check"

class AppointmentUpdate(BaseModel):
    status: str # Scheduled | Completed | Cancelled | Pending

class AppointmentResponse(BaseModel):
    id: str
    patientId: str
    patientName: str
    doctorId: str
    doctorName: str
    department: Optional[str] = None
    date: str
    time: str
    type: Optional[str] = None
    status: str
    reason: Optional[str] = None

    class Config:
        from_attributes = True
