from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Union
from datetime import datetime


class MedicineItem(BaseModel):
    name: str
    dosage: str
    duration: str
    instructions: Optional[str] = "Take after meals with water."

    model_config = ConfigDict(populate_by_name=True)


class PrescriptionCreate(BaseModel):
    patientId: str = Field(alias="patient_id")
    consultationId: Optional[str] = Field(None, alias="consultation_id")
    doctorId: Optional[str] = Field(None, alias="doctor_id")
    doctorName: Optional[str] = Field(None, alias="doctor_name")
    patientName: Optional[str] = Field(None, alias="patient_name")
    medicines: List[MedicineItem]
    instructions: Optional[str] = "Take after meals. Drink plenty of water."

    model_config = ConfigDict(populate_by_name=True)


class PrescriptionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    consultationId: Optional[str] = Field(None, alias="consultation_id")
    patientId: str = Field(alias="patient_id")
    patientName: str = Field(alias="patient_name")
    doctorId: str = Field(alias="doctor_id")
    doctorName: str = Field(alias="doctor_name")
    medicines: List[MedicineItem]
    instructions: Optional[str] = None
    createdAt: Optional[Union[datetime, str]] = Field(None, alias="created_at")
