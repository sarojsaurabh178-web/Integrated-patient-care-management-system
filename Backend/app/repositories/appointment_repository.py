from sqlalchemy.orm import Session
from app.models.appointment import Appointment
from typing import List, Optional

class AppointmentRepository:
    @staticmethod
    def get_all(db: Session, patient_id: Optional[str] = None, doctor_id: Optional[str] = None, status: Optional[str] = None, date: Optional[str] = None) -> List[Appointment]:
        query = db.query(Appointment)
        if patient_id:
            query = query.filter(Appointment.patient_id == patient_id)
        if doctor_id:
            query = query.filter(Appointment.doctor_id == doctor_id)
        if status:
            query = query.filter(Appointment.status.ilike(status))
        if date:
            query = query.filter(Appointment.date == date)
        return query.all()

    @staticmethod
    def get_by_id(db: Session, appt_id: str) -> Optional[Appointment]:
        return db.query(Appointment).filter(Appointment.id == appt_id).first()

    @staticmethod
    def has_doctor_conflict(db: Session, doctor_id: str, date: str, time: str) -> bool:
        return db.query(Appointment).filter(
            Appointment.doctor_id == doctor_id,
            Appointment.date == date,
            Appointment.time == time,
            Appointment.status != "Cancelled"
        ).first() is not None

    @staticmethod
    def create(db: Session, data: dict) -> Appointment:
        count = db.query(Appointment).count()
        appt_id = data.get("id") or f"A{count + 101}"
        db_appt = Appointment(
            id=appt_id,
            patient_id=data["patientId"],
            patient_name=data.get("patientName", "Patient"),
            doctor_id=data.get("doctorId", "D-01"),
            doctor_name=data.get("doctorName", "Doctor"),
            department=data.get("department", "General Medicine"),
            date=data["date"],
            time=data["time"],
            type=data.get("type", "Consultation"),
            status=data.get("status", "Scheduled"),
            reason=data.get("reason", "General Health Check")
        )
        db.add(db_appt)
        db.commit()
        db.refresh(db_appt)
        return db_appt

    @staticmethod
    def update_status(db: Session, appt_id: str, status: str) -> Optional[Appointment]:
        appt = db.query(Appointment).filter(Appointment.id == appt_id).first()
        if not appt:
            return None
        appt.status = status
        db.commit()
        db.refresh(appt)
        return appt

    @staticmethod
    def get_stats(db: Session) -> dict:
        total = db.query(Appointment).count()
        completed = db.query(Appointment).filter(Appointment.status == "Completed").count()
        scheduled = db.query(Appointment).filter(Appointment.status == "Scheduled").count()
        cancelled = db.query(Appointment).filter(Appointment.status == "Cancelled").count()
        pending = db.query(Appointment).filter(Appointment.status == "Pending").count()
        return {
            "total": total,
            "completed": completed,
            "scheduled": scheduled,
            "cancelled": cancelled,
            "pending": pending
        }
