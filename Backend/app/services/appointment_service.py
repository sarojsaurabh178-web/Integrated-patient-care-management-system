from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.appointment_repository import AppointmentRepository
from app.repositories.patient_repository import PatientRepository
from app.repositories.notification_repository import NotificationRepository
from app.schemas.appointment import AppointmentCreate
from typing import Optional

class AppointmentService:
    @staticmethod
    def get_all_appointments(db: Session, patient_id: Optional[str] = None, doctor_id: Optional[str] = None, status_filter: Optional[str] = None, date: Optional[str] = None):
        return AppointmentRepository.get_all(db, patient_id=patient_id, doctor_id=doctor_id, status=status_filter, date=date)

    @staticmethod
    def get_appointment_by_id(db: Session, appt_id: str):
        appt = AppointmentRepository.get_by_id(db, appt_id)
        if not appt:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Appointment {appt_id} not found.")
        return appt

    @staticmethod
    def create_appointment(db: Session, data: AppointmentCreate):
        patient = PatientRepository.get_by_id(db, data.patientId)
        if not patient:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Patient {data.patientId} not found.")

        doctor_id = data.doctorId or "D-01"

        # Milestone 4 Optimization: Conflict Check
        has_conflict = AppointmentRepository.has_doctor_conflict(db, doctor_id, data.date, data.time)
        if has_conflict:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Slot Conflict: Doctor {data.doctorName or doctor_id} is already booked for {data.time} on {data.date}. Please choose a different slot."
            )

        payload = data.model_dump()
        payload["patientName"] = patient.full_name
        payload["doctorId"] = doctor_id
        if not payload.get("doctorName"):
            payload["doctorName"] = "Dr. Ravi Sharma" if doctor_id == "D-01" else "Doctor"

        new_appt = AppointmentRepository.create(db, payload)

        # Trigger Appointment Notification (Milestone 3)
        NotificationRepository.create(db, {
            "recipientId": patient.id,
            "recipientName": patient.full_name,
            "type": "Appointment Reminder",
            "channel": "SMS & In-App",
            "message": f"Your appointment ({new_appt.id}) with {new_appt.doctor_name} is confirmed for {new_appt.date} at {new_appt.time}."
        })

        return new_appt

    @staticmethod
    def update_status(db: Session, appt_id: str, new_status: str):
        valid_statuses = ["Scheduled", "Completed", "Cancelled", "Pending"]
        if new_status not in valid_statuses:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid status. Must be one of: {valid_statuses}")

        updated = AppointmentRepository.update_status(db, appt_id, new_status)
        if not updated:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Appointment {appt_id} not found.")
        return updated

    @staticmethod
    def cancel_appointment(db: Session, appt_id: str):
        cancelled = AppointmentRepository.update_status(db, appt_id, "Cancelled")
        if not cancelled:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Appointment {appt_id} not found.")

        # Notification for cancellation
        NotificationRepository.create(db, {
            "recipientId": cancelled.patient_id,
            "recipientName": cancelled.patient_name,
            "type": "Missed Appointment",
            "channel": "In-App",
            "message": f"Your appointment {cancelled.id} on {cancelled.date} has been cancelled."
        })

        return cancelled
