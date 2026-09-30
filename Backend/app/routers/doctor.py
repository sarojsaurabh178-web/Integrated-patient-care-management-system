from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, ConfigDict, Field
from app.database import get_db
from app.models.doctor import Doctor
from app.models.appointment import Appointment

router = APIRouter(prefix="/doctors", tags=["Doctor Management & Profiles"])

class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    specialization: Optional[str] = None
    qualifications: Optional[str] = None
    experienceYears: Optional[int] = Field(None, alias="experience_years")
    department: Optional[str] = None
    consultationFee: Optional[str] = Field(None, alias="consultation_fee")
    workingDays: Optional[str] = Field(None, alias="working_days")
    workingHours: Optional[str] = Field(None, alias="working_hours")
    dutyStatus: Optional[str] = Field(None, alias="duty_status")
    bio: Optional[str] = None
    photoUrl: Optional[str] = Field(None, alias="photo_url")

    model_config = ConfigDict(populate_by_name=True)

class DoctorCreate(BaseModel):
    id: Optional[str] = None
    userId: Optional[str] = Field(None, alias="user_id")
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    specialization: str
    qualifications: Optional[str] = None
    experienceYears: Optional[int] = Field(5, alias="experience_years")
    department: str
    consultationFee: Optional[str] = Field("₹800", alias="consultation_fee")
    workingDays: Optional[str] = Field("Monday - Friday", alias="working_days")
    workingHours: Optional[str] = Field("09:00 AM - 04:00 PM", alias="working_hours")
    dutyStatus: Optional[str] = Field("On Duty", alias="duty_status")
    bio: Optional[str] = None
    photoUrl: Optional[str] = Field(None, alias="photo_url")

    model_config = ConfigDict(populate_by_name=True)

def doctor_to_dict(doc: Doctor, include_appointments: bool = False, db: Optional[Session] = None) -> Dict[str, Any]:
    res = {
        "id": doc.id,
        "userId": doc.user_id,
        "name": doc.name,
        "email": doc.email,
        "phone": doc.phone,
        "specialization": doc.specialization,
        "qualifications": doc.qualifications,
        "experienceYears": doc.experience_years,
        "department": doc.department,
        "consultationFee": doc.consultation_fee,
        "workingDays": doc.working_days,
        "workingHours": doc.working_hours,
        "dutyStatus": doc.duty_status,
        "bio": doc.bio,
        "photoUrl": doc.photo_url,
        "createdAt": doc.created_at.isoformat() if doc.created_at else None,
        "updatedAt": doc.updated_at.isoformat() if doc.updated_at else None,
    }
    if include_appointments and db:
        apts = db.query(Appointment).filter(Appointment.doctor_id == doc.id).all()
        res["assignedAppointments"] = [
            {
                "id": a.id,
                "patientId": a.patient_id,
                "patientName": a.patient_name,
                "date": a.date,
                "time": a.time,
                "type": a.type,
                "status": a.status,
                "reason": a.reason
            } for a in apts
        ]
        res["totalAssignedAppointments"] = len(apts)
        res["activeAppointmentsCount"] = len([a for a in apts if a.status in ["Scheduled", "In-Progress"]])
    return res

@router.get("", summary="Get all registered doctor profiles")
def get_all_doctors(
    department: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Doctor)
    if department and department != "All":
        query = query.filter(Doctor.department.ilike(f"%{department}%"))
    if status and status != "All":
        query = query.filter(Doctor.duty_status.ilike(status))
    doctors = query.all()
    return [doctor_to_dict(d, include_appointments=True, db=db) for d in doctors]

@router.get("/{doctor_id}", summary="Get doctor profile with appointments")
def get_doctor_by_id(doctor_id: str, db: Session = Depends(get_db)):
    # Match by id (e.g. D-04 or D-01) or user_id
    doc = db.query(Doctor).filter((Doctor.id == doctor_id) | (Doctor.user_id == doctor_id)).first()
    if not doc:
        # Fallback search by case-insensitive name match
        doc = db.query(Doctor).filter(Doctor.name.ilike(f"%{doctor_id}%")).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Doctor with ID '{doctor_id}' not found."
        )
    return doctor_to_dict(doc, include_appointments=True, db=db)

@router.put("/{doctor_id}", summary="Update doctor profile & duty status")
def update_doctor(doctor_id: str, payload: DoctorUpdate, db: Session = Depends(get_db)):
    doc = db.query(Doctor).filter((Doctor.id == doctor_id) | (Doctor.user_id == doctor_id)).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Doctor with ID '{doctor_id}' not found."
        )
    
    update_data = payload.model_dump(exclude_unset=True)
    field_map = {
        "name": "name",
        "email": "email",
        "phone": "phone",
        "specialization": "specialization",
        "qualifications": "qualifications",
        "experienceYears": "experience_years",
        "department": "department",
        "consultationFee": "consultation_fee",
        "workingDays": "working_days",
        "workingHours": "working_hours",
        "dutyStatus": "duty_status",
        "bio": "bio",
        "photoUrl": "photo_url"
    }
    for k, v in update_data.items():
        if v is not None and k in field_map:
            setattr(doc, field_map[k], v)
    
    doc.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(doc)
    return {
        "status": "success",
        "message": f"Profile for {doc.name} updated successfully.",
        "doctor": doctor_to_dict(doc, include_appointments=True, db=db)
    }

@router.post("", status_code=201, summary="Register a new doctor profile")
def create_doctor(payload: DoctorCreate, db: Session = Depends(get_db)):
    doc_id = payload.id
    if not doc_id:
        count = db.query(Doctor).count()
        doc_id = f"D-{count + 1:02d}"
    
    existing = db.query(Doctor).filter(Doctor.id == doc_id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Doctor with ID '{doc_id}' already exists."
        )

    new_doc = Doctor(
        id=doc_id,
        user_id=payload.userId,
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        specialization=payload.specialization,
        qualifications=payload.qualifications,
        experience_years=payload.experienceYears or 5,
        department=payload.department,
        consultation_fee=payload.consultationFee or "₹800",
        working_days=payload.workingDays or "Monday - Friday",
        working_hours=payload.workingHours or "09:00 AM - 04:00 PM",
        duty_status=payload.dutyStatus or "On Duty",
        bio=payload.bio,
        photo_url=payload.photoUrl
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return {
        "status": "success",
        "message": f"Doctor {new_doc.name} registered successfully.",
        "doctor": doctor_to_dict(new_doc, include_appointments=True, db=db)
    }
