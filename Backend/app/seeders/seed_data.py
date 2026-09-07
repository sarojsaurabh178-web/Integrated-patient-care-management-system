from sqlalchemy.orm import Session
from app.database import Base, engine, SessionLocal
from app.models import User, Patient, Appointment, Consultation, Prescription, Notification, AuditLog, SecurityEvent
from app.repositories.user_repository import pwd_context

def seed_db():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Check if users already seeded
        if db.query(User).count() > 0:
            return

        # 1. Users
        users = [
            User(id="U-ADMIN", username="admin", name="System Administrator", email="admin@meditrack.org", role="Admin", password_hash=pwd_context.hash("adminpassword123")),
            User(id="D-01", username="dr.ravi", name="Dr. Ravi Sharma", email="dr.ravi@meditrack.org", role="Doctor", specialty="Cardiology", password_hash=pwd_context.hash("doctorpassword123")),
            User(id="D-02", username="dr.priya", name="Dr. Priya Patel", email="dr.priya@meditrack.org", role="Doctor", specialty="General Medicine", password_hash=pwd_context.hash("doctorpassword123")),
            User(id="D-03", username="dr.kumar", name="Dr. Suresh Kumar", email="dr.kumar@meditrack.org", role="Doctor", specialty="Orthopedics", password_hash=pwd_context.hash("doctorpassword123")),
            User(id="U-P101", username="rahul", name="Rahul Verma", email="rahul.verma@example.com", role="Patient", password_hash=pwd_context.hash("patientpassword123"))
        ]
        db.add_all(users)

        # 2. Patients
        patients = [
            Patient(id="P101", name="Rahul Verma", full_name="Rahul Verma", age=34, gender="Male", phone="+91 98765 43210", address="12 Park Street, Connaught Place, New Delhi", emergency_contact="+91 98765 00000", blood_group="O+", medical_history_notes="History of seasonal allergies and primary hypertension stage 1."),
            Patient(id="P102", name="Priya Patel", full_name="Priya Patel", age=28, gender="Female", phone="+91 98123 45678", address="45 MG Road, Indiranagar, Bengaluru", emergency_contact="+91 98123 99999", blood_group="A+", medical_history_notes="No major surgeries. Mild asthma."),
            Patient(id="P103", name="Vikram Singh", full_name="Vikram Singh", age=45, gender="Male", phone="+91 99000 11223", address="Suite 404, Green Heights, Jubilee Hills, Hyderabad", emergency_contact="+91 99000 11224", blood_group="B+", medical_history_notes="Type 2 Diabetes Mellitus under medication."),
            Patient(id="P104", name="Ananya Roy", full_name="Ananya Roy", age=62, gender="Female", phone="+91 97777 88888", address="88 Lake Gardens, Kolkata", emergency_contact="+91 97777 88889", blood_group="AB+", medical_history_notes="Osteoarthritis right knee."),
            Patient(id="P105", name="Rajesh Gupta", full_name="Rajesh Gupta", age=16, gender="Male", phone="+91 96666 55555", address="23 Civil Lines, Jaipur", emergency_contact="+91 96666 55556", blood_group="O-", medical_history_notes="Acute viral fever follow-up.")
        ]
        db.add_all(patients)

        # 3. Appointments
        appointments = [
            Appointment(id="A101", patient_id="P101", patient_name="Rahul Verma", doctor_id="D-01", doctor_name="Dr. Ravi Sharma", department="Cardiology", date="2026-09-01", time="10:00 AM", type="Follow-Up", status="Completed", reason="Routine BP check & chest tightness follow-up"),
            Appointment(id="A102", patient_id="P102", patient_name="Priya Patel", doctor_id="D-02", doctor_name="Dr. Priya Patel", department="General Medicine", date="2026-09-02", time="11:30 AM", type="First Visit", status="Scheduled", reason="Persistent mild headache and fever"),
            Appointment(id="A103", patient_id="P103", patient_name="Vikram Singh", doctor_id="D-03", doctor_name="Dr. Suresh Kumar", department="Orthopedics", date="2026-09-03", time="02:00 PM", type="OPD Consultation", status="Scheduled", reason="Lower back discomfort after exercise"),
            Appointment(id="A104", patient_id="P104", patient_name="Ananya Roy", doctor_id="D-03", doctor_name="Dr. Suresh Kumar", department="Orthopedics", date="2026-08-25", time="10:00 AM", type="Follow-Up", status="Completed", reason="Knee joint pain review"),
            Appointment(id="A105", patient_id="P105", patient_name="Rajesh Gupta", doctor_id="D-02", doctor_name="Dr. Priya Patel", department="General Medicine", date="2026-08-27", time="04:00 PM", type="Emergency OPD", status="Cancelled", reason="Patient requested rescheduling")
        ]
        db.add_all(appointments)

        # 4. Consultations
        consultations = [
            Consultation(id="C-501", appointment_id="A101", patient_id="P101", patient_name="Rahul Verma", doctor_id="D-01", doctor_name="Dr. Ravi Sharma", symptoms="Mild chest tightness, blood pressure 140/90 mmHg", observations="Patient moderately stressed. Normal heart S1 S2.", diagnosis="Primary Hypertension Stage I", lab_results="ECG normal sinus rhythm.", treatment_plan="Lifestyle modifications, low sodium diet.", clinical_notes="Advised daily blood pressure log.", vitals={"bloodPressure": "140/90 mmHg", "pulse": "78 bpm", "temp": "98.4 F"}),
            Consultation(id="C-502", appointment_id="A104", patient_id="P104", patient_name="Ananya Roy", doctor_id="D-03", doctor_name="Dr. Suresh Kumar", symptoms="Bilateral knee joint stiffness", observations="Mild swelling over patellar tendon.", diagnosis="Grade II Knee Osteoarthritis", lab_results="X-Ray shows joint space narrowing.", treatment_plan="Quadriceps strengthening exercises.", clinical_notes="Avoid stairs climbing.", vitals={"bloodPressure": "130/85 mmHg", "pulse": "70 bpm", "temp": "98.6 F"})
        ]
        db.add_all(consultations)

        # 5. Prescriptions
        prescriptions = [
            Prescription(id="RX-201", consultation_id="C-501", patient_id="P101", patient_name="Rahul Verma", doctor_id="D-01", doctor_name="Dr. Ravi Sharma", medicines=[{"name": "Amlodipine 5mg", "dosage": "1 tablet daily morning", "duration": "30 Days", "instructions": "Take after breakfast"}, {"name": "Aspirin 75mg", "dosage": "1 tablet after dinner", "duration": "30 Days", "instructions": "Take with water"}], instructions="Maintain low sodium diet (< 2g/day)."),
            Prescription(id="RX-202", consultation_id="C-502", patient_id="P104", patient_name="Ananya Roy", doctor_id="D-03", doctor_name="Dr. Suresh Kumar", medicines=[{"name": "Glucosamine Sulfate 1500mg", "dosage": "1 tablet once daily", "duration": "60 Days", "instructions": "Take with main meal"}], instructions="Perform isometric knee exercises daily.")
        ]
        db.add_all(prescriptions)

        # 6. Notifications
        notifications = [
            Notification(id="NOTIF-101", recipient_id="P101", recipient_name="Rahul Verma", type="Appointment Reminder", channel="SMS & In-App", message="Reminder: Your consultation with Dr. Ravi Sharma is scheduled for tomorrow at 10:00 AM.", status="Sent"),
            Notification(id="NOTIF-102", recipient_id="P101", recipient_name="Rahul Verma", type="Prescription Alert", channel="In-App", message="Your electronic prescription RX-201 has been generated by Dr. Ravi Sharma.", status="Delivered"),
            Notification(id="NOTIF-103", recipient_id="P102", recipient_name="Priya Patel", type="Appointment Reminder", channel="Email", message="Upcoming Appointment: Dr. Priya Patel (General Medicine) today at 11:30 AM.", status="Sent")
        ]
        db.add_all(notifications)

        # 7. Audit Logs & Security Events
        audit_logs = [
            AuditLog(id="LOG-001", user_id="D-01", user_name="Dr. Ravi Sharma", user_role="Doctor", action="Viewed Patient P101 EHR Record", method="GET", endpoint="/api/v1/patients/P101", status_code=200, ip="192.168.1.105"),
            AuditLog(id="LOG-002", user_id="D-01", user_name="Dr. Ravi Sharma", user_role="Doctor", action="Recorded Clinical Consultation C-501", method="POST", endpoint="/api/v1/consultations", status_code=201, ip="192.168.1.105")
        ]
        security_events = [
            SecurityEvent(id="SEC-001", event_type="FAILED_LOGIN_ATTEMPT", user_id=None, user_role=None, ip="185.220.101.4", path="/api/v1/auth/login", method="POST", severity="MEDIUM", details="Invalid password supplied for username: admin")
        ]
        db.add_all(audit_logs)
        db.add_all(security_events)

        db.commit()
    finally:
        db.close()
