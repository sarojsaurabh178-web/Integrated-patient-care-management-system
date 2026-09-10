from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, Dict, Any, Union
from datetime import datetime


class ConsultationCreate(BaseModel):
    patientId: str = Field(alias="patient_id")
    patientName: Optional[str] = Field(None, alias="patient_name")
    appointmentId: Optional[str] = Field(None, alias="appointment_id")
    doctorId: Optional[str] = Field(None, alias="doctor_id")
    doctorName: Optional[str] = Field(None, alias="doctor_name")
    symptoms: Optional[str] = None
    observations: Optional[str] = None
    diagnosis: Optional[str] = None
    labResults: Optional[str] = Field(None, alias="lab_results")
    treatmentPlan: Optional[str] = Field(None, alias="treatment_plan")
    clinicalNotes: Optional[str] = Field(None, alias="clinical_notes")
    vitals: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(populate_by_name=True)


class ConsultationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    appointmentId: Optional[str] = Field(None, alias="appointment_id")
    patientId: str = Field(alias="patient_id")
    patientName: str = Field(alias="patient_name")
    doctorId: str = Field(alias="doctor_id")
    doctorName: str = Field(alias="doctor_name")
    symptoms: Optional[str] = None
    observations: Optional[str] = None
    diagnosis: Optional[str] = None
    labResults: Optional[str] = Field(None, alias="lab_results")
    treatmentPlan: Optional[str] = Field(None, alias="treatment_plan")
    clinicalNotes: Optional[str] = Field(None, alias="clinical_notes")
    vitals: Optional[Dict[str, Any]] = None
    createdAt: Optional[Union[datetime, str]] = Field(None, alias="created_at")
