from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.prescription_repository import PrescriptionRepository
from app.repositories.patient_repository import PatientRepository
from app.repositories.notification_repository import NotificationRepository
from app.schemas.prescription import PrescriptionCreate
from typing import Optional

class PrescriptionService:
    @staticmethod
    def get_all_prescriptions(db: Session, patient_id: Optional[str] = None, doctor_id: Optional[str] = None):
        return PrescriptionRepository.get_all(db, patient_id=patient_id, doctor_id=doctor_id)

    @staticmethod
    def get_prescription_by_id(db: Session, rx_id: str):
        rx = PrescriptionRepository.get_by_id(db, rx_id)
        if not rx:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Prescription {rx_id} not found.")
        return rx

    @staticmethod
    def create_prescription(db: Session, data: PrescriptionCreate, current_user: dict):
        patient = PatientRepository.get_by_id(db, data.patientId)
        if not patient:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Patient {data.patientId} not found.")

        payload = data.model_dump()
        payload["patientName"] = patient.full_name
        payload["doctorId"] = current_user.get("id") if current_user else "D-01"
        payload["doctorName"] = current_user.get("name") if current_user else "Dr. Ravi Sharma"
        # Convert medicines list to json dicts
        payload["medicines"] = [m if isinstance(m, dict) else m.model_dump() for m in data.medicines]

        new_rx = PrescriptionRepository.create(db, payload)

        # Trigger notification alert (Milestone 3)
        NotificationRepository.create(db, {
            "recipientId": patient.id,
            "recipientName": patient.full_name,
            "type": "Prescription Alert",
            "channel": "In-App",
            "message": f"Your electronic prescription ({new_rx.id}) has been issued by {new_rx.doctor_name}."
        })

        return new_rx

    @staticmethod
    def get_patient_prescriptions(db: Session, patient_id: str):
        return PrescriptionRepository.get_by_patient_id(db, patient_id)
