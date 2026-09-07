from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.consultation_repository import ConsultationRepository
from app.repositories.patient_repository import PatientRepository
from app.repositories.appointment_repository import AppointmentRepository
from app.schemas.consultation import ConsultationCreate
from typing import Optional

class ConsultationService:
    @staticmethod
    def get_all_consultations(db: Session, patient_id: Optional[str] = None, doctor_id: Optional[str] = None):
        return ConsultationRepository.get_all(db, patient_id=patient_id, doctor_id=doctor_id)

    @staticmethod
    def get_consultation_by_id(db: Session, consultation_id: str):
        cons = ConsultationRepository.get_by_id(db, consultation_id)
        if not cons:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Consultation {consultation_id} not found.")
        return cons

    @staticmethod
    def create_consultation(db: Session, data: ConsultationCreate, current_user: dict):
        patient = PatientRepository.get_by_id(db, data.patientId)
        if not patient:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Patient {data.patientId} not found.")

        payload = data.model_dump()
        payload["patientName"] = patient.full_name
        payload["doctorId"] = current_user.get("id") if current_user else (data.doctorId or "D-01")
        payload["doctorName"] = current_user.get("name") if current_user else (data.doctorName or "Dr. Ravi Sharma")

        new_cons = ConsultationRepository.create(db, payload)

        if data.appointmentId:
            AppointmentRepository.update_status(db, data.appointmentId, "Completed")

        return new_cons

    @staticmethod
    def get_patient_consultations(db: Session, patient_id: str):
        return ConsultationRepository.get_by_patient_id(db, patient_id)
