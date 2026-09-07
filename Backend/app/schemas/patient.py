from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


def _to_camel(s: str) -> str:
    parts = s.split("_")
    return parts[0] + "".join(w.capitalize() for w in parts[1:])


class PatientCreate(BaseModel):
    fullName: str
    age: int
    gender: str
    phone: str
    address: Optional[str] = "N/A"
    emergencyContact: Optional[str] = None
    bloodGroup: Optional[str] = "O+"
    medicalHistoryNotes: Optional[str] = None


class PatientUpdate(BaseModel):
    phone: Optional[str] = None
    address: Optional[str] = None
    emergencyContact: Optional[str] = None
    bloodGroup: Optional[str] = None
    medicalHistoryNotes: Optional[str] = None


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
    createdAt: Optional[str] = Field(None, alias="created_at")
