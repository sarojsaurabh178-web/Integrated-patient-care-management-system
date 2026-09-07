from pydantic import BaseModel
from typing import Optional, List

class MedicineItem(BaseModel):
    name: str
    dosage: str
    duration: str
    instructions: Optional[str] = "Take after meals with water."

class PrescriptionCreate(BaseModel):
    patientId: str
    consultationId: Optional[str] = None
    medicines: List[MedicineItem]
    instructions: Optional[str] = "Take after meals. Drink plenty of water."

class PrescriptionResponse(BaseModel):
    id: str
    consultationId: Optional[str] = None
    patientId: str
    patientName: str
    doctorId: str
    doctorName: str
    medicines: List[MedicineItem]
    instructions: Optional[str] = None
    createdAt: Optional[str] = None

    class Config:
        from_attributes = True
