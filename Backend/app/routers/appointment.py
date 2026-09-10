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

@router.get("/availability")
def check_availability(
    doctorId: str = Query(..., alias="doctorId"),
    date: str = Query(..., alias="date"),
    db: Session = Depends(get_db)
):
    from app.repositories.appointment_repository import AppointmentRepository
    booked_slots = AppointmentRepository.get_booked_slots(db, doctorId, date)
    all_slots = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
        "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
    ]
    available_slots = [s for s in all_slots if s not in booked_slots]
    return {
        "doctorId": doctorId,
        "date": date,
        "bookedSlots": booked_slots,
        "availableSlots": available_slots
    }

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
