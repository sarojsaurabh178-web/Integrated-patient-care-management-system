from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.consultation import ConsultationCreate, ConsultationResponse
from app.services.consultation_service import ConsultationService
from app.middlewares.auth import get_current_user, require_roles

router = APIRouter(prefix="/consultations", tags=["Clinical OPD & Consultations"])

@router.get("", response_model=List[ConsultationResponse])
def get_consultations(
    patientId: Optional[str] = Query(None),
    doctorId: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return ConsultationService.get_all_consultations(db, patient_id=patientId, doctor_id=doctorId)

@router.post("", response_model=ConsultationResponse, status_code=201)
def create_consultation(
    data: ConsultationCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_roles("Doctor", "Admin"))
):
    return ConsultationService.create_consultation(db, data, current_user)

@router.get("/{cons_id}", response_model=ConsultationResponse)
def get_consultation(
    cons_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return ConsultationService.get_consultation_by_id(db, cons_id)

@router.get("/patient/{patient_id}", response_model=List[ConsultationResponse])
def get_patient_consultations(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return ConsultationService.get_patient_consultations(db, patient_id)
