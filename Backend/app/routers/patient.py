from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.patient import PatientCreate, PatientUpdate, PatientResponse
from app.services.patient_service import PatientService
from app.middlewares.auth import get_current_user, require_roles

router = APIRouter(prefix="/patients", tags=["Patient Management"])

@router.get("", response_model=List[PatientResponse])
def get_patients(
    search: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return PatientService.get_all_patients(db, search=search, gender=gender)

@router.post("", response_model=PatientResponse, status_code=201)
def create_patient(
    data: PatientCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_roles("Admin", "Doctor"))
):
    return PatientService.register_patient(db, data)

@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return PatientService.get_patient_by_id(db, patient_id)

@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: str,
    data: PatientUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_roles("Admin", "Doctor"))
):
    return PatientService.update_patient(db, patient_id, data)

@router.delete("/{patient_id}")
def delete_patient(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_roles("Admin"))
):
    return PatientService.archive_patient(db, patient_id)

@router.get("/{patient_id}/history")
def get_treatment_history(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return PatientService.get_treatment_history(db, patient_id)
