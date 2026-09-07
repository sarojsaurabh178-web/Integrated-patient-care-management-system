from sqlalchemy.orm import Session
from app.models.patient import Patient
from typing import List, Optional

class PatientRepository:
    @staticmethod
    def get_all(db: Session, search: Optional[str] = None, gender: Optional[str] = None) -> List[Patient]:
        query = db.query(Patient).filter(Patient.is_archived == False)
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (Patient.name.ilike(search_term)) |
                (Patient.full_name.ilike(search_term)) |
                (Patient.id.ilike(search_term)) |
                (Patient.phone.like(search_term))
            )
        if gender:
            query = query.filter(Patient.gender.ilike(gender))
        return query.all()

    @staticmethod
    def get_by_id(db: Session, patient_id: str) -> Optional[Patient]:
        return db.query(Patient).filter(Patient.id == patient_id, Patient.is_archived == False).first()

    @staticmethod
    def create(db: Session, patient_data: dict) -> Patient:
        count = db.query(Patient).count()
        patient_id = patient_data.get("id") or f"P{count + 101}"
        db_patient = Patient(
            id=patient_id,
            name=patient_data.get("fullName") or patient_data.get("name"),
            full_name=patient_data.get("fullName") or patient_data.get("name"),
            age=int(patient_data["age"]),
            gender=patient_data["gender"],
            phone=patient_data["phone"],
            address=patient_data.get("address", "N/A"),
            emergency_contact=patient_data.get("emergencyContact", patient_data["phone"]),
            blood_group=patient_data.get("bloodGroup", "O+"),
            medical_history_notes=patient_data.get("medicalHistoryNotes", "No prior chronic conditions recorded.")
        )
        db.add(db_patient)
        db.commit()
        db.refresh(db_patient)
        return db_patient

    @staticmethod
    def update(db: Session, patient_id: str, update_data: dict) -> Optional[Patient]:
        patient = db.query(Patient).filter(Patient.id == patient_id, Patient.is_archived == False).first()
        if not patient:
            return None
        for key, value in update_data.items():
            if value is not None and hasattr(patient, key):
                setattr(patient, key, value)
        db.commit()
        db.refresh(patient)
        return patient

    @staticmethod
    def archive(db: Session, patient_id: str) -> bool:
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            return False
        patient.is_archived = True
        db.commit()
        return True

    @staticmethod
    def count(db: Session) -> int:
        return db.query(Patient).filter(Patient.is_archived == False).count()
