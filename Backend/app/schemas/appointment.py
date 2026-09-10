from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, Union
from datetime import datetime


class AppointmentCreate(BaseModel):
    patientId: str = Field(alias="patient_id")
    patientName: Optional[str] = Field(None, alias="patient_name")
    doctorId: Optional[str] = Field("D-01", alias="doctor_id")
    doctorName: Optional[str] = Field(None, alias="doctor_name")
    department: Optional[str] = "General Medicine"
    date: str  # YYYY-MM-DD
    time: str  # e.g. 10:00 AM
    type: Optional[str] = "Consultation"
    reason: Optional[str] = "General Health Check"

    model_config = ConfigDict(populate_by_name=True)


class AppointmentUpdate(BaseModel):
    status: str  # Scheduled | Completed | Cancelled | Pending

    model_config = ConfigDict(populate_by_name=True)


class AppointmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    patientId: str = Field(alias="patient_id")
    patientName: str = Field(alias="patient_name")
    doctorId: str = Field(alias="doctor_id")
    doctorName: str = Field(alias="doctor_name")
    department: Optional[str] = None
    date: str
    time: str
    type: Optional[str] = None
    status: str
    reason: Optional[str] = None
    createdAt: Optional[Union[datetime, str]] = Field(None, alias="created_at")
