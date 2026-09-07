from sqlalchemy.orm import Session
from app.models.consultation import Consultation
from typing import List, Optional

class ConsultationRepository:
    @staticmethod
    def get_all(db: Session, patient_id: Optional[str] = None, doctor_id: Optional[str] = None) -> List[Consultation]:
        query = db.query(Consultation)
        if patient_id:
            query = query.filter(Consultation.patient_id == patient_id)
        if doctor_id:
            query = query.filter(Consultation.doctor_id == doctor_id)
        return query.all()

    @staticmethod
    def get_by_id(db: Session, consultation_id: str) -> Optional[Consultation]:
        return db.query(Consultation).filter(Consultation.id == consultation_id).first()

    @staticmethod
    def get_by_patient_id(db: Session, patient_id: str) -> List[Consultation]:
        return db.query(Consultation).filter(Consultation.patient_id == patient_id).order_by(Consultation.created_at.desc()).all()

    @staticmethod
    def create(db: Session, data: dict) -> Consultation:
        count = db.query(Consultation).count()
        cons_id = data.get("id") or f"C-{count + 501}"
        db_cons = Consultation(
            id=cons_id,
            appointment_id=data.get("appointmentId"),
            patient_id=data["patientId"],
            patient_name=data.get("patientName", "Patient"),
            doctor_id=data.get("doctorId", "D-01"),
            doctor_name=data.get("doctorName", "Dr. Ravi Sharma"),
            symptoms=data.get("symptoms", ""),
            observations=data.get("observations", ""),
            diagnosis=data.get("diagnosis", ""),
            lab_results=data.get("labResults", "Standard screening clear"),
            treatment_plan=data.get("treatmentPlan", data.get("treatment", "")),
            clinical_notes=data.get("clinicalNotes", ""),
            vitals=data.get("vitals", {"bloodPressure": "120/80 mmHg", "pulse": "72 bpm", "temp": "98.6 F"})
        )
        db.add(db_cons)
        db.commit()
        db.refresh(db_cons)
        return db_cons

    @staticmethod
    def get_doctor_stats(db: Session) -> List[dict]:
        from sqlalchemy import func
        results = db.query(Consultation.doctor_name, func.count(Consultation.id)).group_by(Consultation.doctor_name).all()
        return [{"doctor": doc_name, "consultationsCount": count} for doc_name, count in results]
