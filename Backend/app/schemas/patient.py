from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, Union
from datetime import datetime


class PatientCreate(BaseModel):
    name: Optional[str] = None
    fullName: str = Field(alias="full_name", default="")
    age: int
    gender: str
    phone: str
    email: Optional[str] = None
    address: Optional[str] = "N/A"
    emergencyContact: Optional[str] = Field(None, alias="emergency_contact")
    bloodGroup: Optional[str] = Field("O+", alias="blood_group")
    medicalHistoryNotes: Optional[str] = Field(None, alias="medical_history_notes")

    model_config = ConfigDict(populate_by_name=True)


class PatientUpdate(BaseModel):
    fullName: Optional[str] = Field(None, alias="full_name")
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    emergencyContact: Optional[str] = Field(None, alias="emergency_contact")
    bloodGroup: Optional[str] = Field(None, alias="blood_group")
    medicalHistoryNotes: Optional[str] = Field(None, alias="medical_history_notes")

    model_config = ConfigDict(populate_by_name=True)


class PatientResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    name: str
    fullName: str = Field(alias="full_name")
    age: int
    gender: str
    phone: str
    address: Optional[str] = None
    emergencyContact: Optional[str] = Field(None, alias="emergency_contact")
    bloodGroup: Optional[str] = Field(None, alias="blood_group")
    medicalHistoryNotes: Optional[str] = Field(None, alias="medical_history_notes")
    isArchived: bool = Field(False, alias="is_archived")
    createdAt: Optional[Union[datetime, str]] = Field(None, alias="created_at")
