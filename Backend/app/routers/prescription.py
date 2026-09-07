from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.prescription import PrescriptionCreate, PrescriptionResponse
from app.services.prescription_service import PrescriptionService
from app.middlewares.auth import get_current_user, require_roles

router = APIRouter(prefix="/prescriptions", tags=["Pharmacy & Prescriptions"])

@router.get("", response_model=List[PrescriptionResponse])
def get_prescriptions(
    patientId: Optional[str] = Query(None),
    doctorId: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return PrescriptionService.get_all_prescriptions(db, patient_id=patientId, doctor_id=doctorId)

@router.post("", response_model=PrescriptionResponse, status_code=201)
def create_prescription(
    data: PrescriptionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_roles("Doctor", "Admin"))
):
    return PrescriptionService.create_prescription(db, data, current_user)

@router.get("/{rx_id}", response_model=PrescriptionResponse)
def get_prescription(
    rx_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return PrescriptionService.get_prescription_by_id(db, rx_id)

@router.get("/patient/{patient_id}", response_model=List[PrescriptionResponse])
def get_patient_prescriptions(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return PrescriptionService.get_patient_prescriptions(db, patient_id)
