from sqlalchemy.orm import Session
from app.models.prescription import Prescription
from typing import List, Optional

class PrescriptionRepository:
    @staticmethod
    def get_all(db: Session, patient_id: Optional[str] = None, doctor_id: Optional[str] = None) -> List[Prescription]:
        query = db.query(Prescription)
        if patient_id:
            query = query.filter(Prescription.patient_id == patient_id)
        if doctor_id:
            query = query.filter(Prescription.doctor_id == doctor_id)
        return query.all()

    @staticmethod
    def get_by_id(db: Session, rx_id: str) -> Optional[Prescription]:
        return db.query(Prescription).filter(Prescription.id == rx_id).first()

    @staticmethod
    def get_by_patient_id(db: Session, patient_id: str) -> List[Prescription]:
        return db.query(Prescription).filter(Prescription.patient_id == patient_id).order_by(Prescription.created_at.desc()).all()

    @staticmethod
    def create(db: Session, data: dict) -> Prescription:
        count = db.query(Prescription).count()
        rx_id = data.get("id") or f"RX-{count + 201}"
        db_rx = Prescription(
            id=rx_id,
            consultation_id=data.get("consultationId"),
            patient_id=data["patientId"],
            patient_name=data.get("patientName", "Patient"),
            doctor_id=data.get("doctorId", "D-01"),
            doctor_name=data.get("doctorName", "Dr. Ravi Sharma"),
            medicines=data["medicines"],
            instructions=data.get("instructions", "Take after meals.")
        )
        db.add(db_rx)
        db.commit()
        db.refresh(db_rx)
        return db_rx
