from sqlalchemy.orm import Session
from app.repositories.patient_repository import PatientRepository
from app.repositories.appointment_repository import AppointmentRepository
from app.repositories.consultation_repository import ConsultationRepository
from app.repositories.prescription_repository import PrescriptionRepository
from app.utils.report_generator import generate_csv_report, generate_html_report

class AnalyticsService:
    @staticmethod
    def get_dashboard_metrics(db: Session):
        patients = PatientRepository.get_all(db)
        appts_stats = AppointmentRepository.get_stats(db)
        doc_stats = ConsultationRepository.get_doctor_stats(db)
        total_consultations = len(ConsultationRepository.get_all(db))
        total_prescriptions = len(PrescriptionRepository.get_all(db))

        age_demographics = {"0-18": 0, "19-40": 0, "41-60": 0, "60+": 0}
        gender_distribution = {"Male": 0, "Female": 0, "Other": 0}

        for p in patients:
            age = p.age or 30
            if age <= 18: age_demographics["0-18"] += 1
            elif age <= 40: age_demographics["19-40"] += 1
            elif age <= 60: age_demographics["41-60"] += 1
            else: age_demographics["60+"] += 1

            if p.gender == "Male": gender_distribution["Male"] += 1
            elif p.gender == "Female": gender_distribution["Female"] += 1
            else: gender_distribution["Other"] += 1

        visit_trends = [
            {"day": "Monday", "visits": 80},
            {"day": "Tuesday", "visits": 95},
            {"day": "Wednesday", "visits": 70},
            {"day": "Thursday", "visits": 110},
            {"day": "Friday", "visits": 90},
            {"day": "Saturday", "visits": 45}
        ]

        return {
            "overview": {
                "totalPatients": PatientRepository.count(db),
                "totalAppointments": appts_stats["total"],
                "completedAppointments": appts_stats["completed"],
                "scheduledAppointments": appts_stats["scheduled"],
                "cancelledAppointments": appts_stats["cancelled"],
                "pendingAppointments": appts_stats["pending"],
                "totalConsultations": total_consultations,
                "totalPrescriptions": total_prescriptions
            },
            "patientDemographics": {
                "ageGroups": age_demographics,
                "gender": gender_distribution
            },
            "doctorConsultationStats": doc_stats,
            "visitTrends": visit_trends
        }

    @staticmethod
    def export_csv(db: Session, report_type: str = "appointments") -> str:
        if report_type == "patients":
            patients = PatientRepository.get_all(db)
            fields = [
                {"key": "id", "label": "Patient ID"},
                {"key": "full_name", "label": "Full Name"},
                {"key": "age", "label": "Age"},
                {"key": "gender", "label": "Gender"},
                {"key": "phone", "label": "Phone"},
                {"key": "blood_group", "label": "Blood Group"},
                {"key": "created_at", "label": "Registration Date"}
            ]
            return generate_csv_report(patients, fields)

        appointments = AppointmentRepository.get_all(db)
        fields = [
            {"key": "id", "label": "Appointment ID"},
            {"key": "patient_name", "label": "Patient Name"},
            {"key": "doctor_name", "label": "Doctor Name"},
            {"key": "department", "label": "Department"},
            {"key": "date", "label": "Date"},
            {"key": "time", "label": "Time"},
            {"key": "status", "label": "Status"}
        ]
        return generate_csv_report(appointments, fields)

    @staticmethod
    def export_html(db: Session, report_type: str = "monthly") -> str:
        stats = AppointmentRepository.get_stats(db)
        appts = AppointmentRepository.get_all(db)

        summary_items = [
            {"label": "Total Appointments", "value": stats["total"]},
            {"label": "Completed Visits", "value": stats["completed"]},
            {"label": "Scheduled / Pending", "value": stats["scheduled"] + stats["pending"]},
            {"label": "Cancelled Visits", "value": stats["cancelled"]}
        ]
        headers = ["Appointment ID", "Patient Name", "Doctor", "Date & Time", "Status"]
        rows = [[a.id, a.patient_name, a.doctor_name, f"{a.date} at {a.time}", a.status] for a in appts]

        return generate_html_report("Monthly Hospital Operational Summary", summary_items, headers, rows)
