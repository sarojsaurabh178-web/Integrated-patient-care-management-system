from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.patient_repository import PatientRepository
from app.repositories.appointment_repository import AppointmentRepository
from app.repositories.consultation_repository import ConsultationRepository
from app.repositories.prescription_repository import PrescriptionRepository
from app.schemas.patient import PatientCreate, PatientUpdate
from typing import Optional

class PatientService:
    @staticmethod
    def get_all_patients(db: Session, search: Optional[str] = None, gender: Optional[str] = None):
        return PatientRepository.get_all(db, search=search, gender=gender)

    @staticmethod
    def get_patient_by_id(db: Session, patient_id: str):
        patient = PatientRepository.get_by_id(db, patient_id)
        if not patient:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Patient with ID {patient_id} not found.")
        return patient

    @staticmethod
    def register_patient(db: Session, data: PatientCreate):
        return PatientRepository.create(db, data.model_dump())

    @staticmethod
    def update_patient(db: Session, patient_id: str, data: PatientUpdate):
        updated = PatientRepository.update(db, patient_id, data.model_dump(exclude_unset=True))
        if not updated:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Patient with ID {patient_id} not found.")
        return updated

    @staticmethod
    def archive_patient(db: Session, patient_id: str):
        success = PatientRepository.archive(db, patient_id)
        if not success:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Patient with ID {patient_id} not found.")
        return {"id": patient_id, "message": f"Patient record {patient_id} archived successfully."}

    @staticmethod
    def get_treatment_history(db: Session, patient_id: str):
        patient = PatientRepository.get_by_id(db, patient_id)
        if not patient:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Patient with ID {patient_id} not found.")

        appointments = AppointmentRepository.get_all(db, patient_id=patient_id)
        consultations = ConsultationRepository.get_by_patient_id(db, patient_id)
        prescriptions = PrescriptionRepository.get_by_patient_id(db, patient_id)

        return {
            "patient": patient,
            "summary": {
                "totalVisits": len(appointments),
                "totalConsultations": len(consultations),
                "totalPrescriptions": len(prescriptions)
            },
            "appointments": appointments,
            "consultations": consultations,
            "prescriptions": prescriptions
        }
