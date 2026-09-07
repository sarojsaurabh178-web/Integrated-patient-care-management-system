from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate, AppointmentResponse
from app.services.appointment_service import AppointmentService
from app.middlewares.auth import get_current_user, require_roles

router = APIRouter(prefix="/appointments", tags=["Appointments Scheduling"])

@router.get("", response_model=List[AppointmentResponse])
def get_appointments(
    patientId: Optional[str] = Query(None),
    doctorId: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    date: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return AppointmentService.get_all_appointments(db, patient_id=patientId, doctor_id=doctorId, status_filter=status, date=date)

@router.post("", response_model=AppointmentResponse, status_code=201)
def create_appointment(
    data: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return AppointmentService.create_appointment(db, data)

@router.get("/{appt_id}", response_model=AppointmentResponse)
def get_appointment(
    appt_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return AppointmentService.get_appointment_by_id(db, appt_id)

@router.put("/{appt_id}", response_model=AppointmentResponse)
def update_appointment(
    appt_id: str,
    data: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_roles("Admin", "Doctor"))
):
    return AppointmentService.update_status(db, appt_id, data.status)

@router.delete("/{appt_id}", response_model=AppointmentResponse)
def cancel_appointment(
    appt_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return AppointmentService.cancel_appointment(db, appt_id)
