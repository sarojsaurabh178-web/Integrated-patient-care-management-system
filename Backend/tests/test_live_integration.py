import pytest
import httpx

BASE_URL = "http://localhost:5000/api/v1"


def test_full_system_integration_flow():
    client = httpx.Client(base_url=BASE_URL, timeout=10.0)

    # 1. Health check
    health_res = client.get("/health")
    assert health_res.status_code == 200
    assert health_res.json()["database"] == "POSTGRESQL"

    # 2. Doctor Login
    doc_login_res = client.post("/auth/login", json={
        "identifier": "s.jenkins@meditrack.org",
        "password": "DocPass@123"
    })
    assert doc_login_res.status_code == 200
    doc_data = doc_login_res.json()
    doc_token = doc_data["token"]
    assert doc_data["user"]["role"] == "Doctor"
    doc_headers = {"Authorization": f"Bearer {doc_token}"}

    # 3. Patient Registration via Auth
    test_email = "test.patient.e2e@example.com"
    reg_res = client.post("/auth/register", json={
        "username": "test_patient_e2e",
        "email": test_email,
        "fullName": "E2E Test Patient",
        "phone": "+91 99887 76655",
        "password": "PatientPass@123",
        "role": "Patient"
    })
    # If already exists from prior run, login instead
    if reg_res.status_code == 201:
        pat_token = reg_res.json()["token"]
    else:
        pat_login = client.post("/auth/login", json={
            "identifier": test_email,
            "password": "PatientPass@123"
        })
        assert pat_login.status_code == 200
        pat_token = pat_login.json()["token"]

    pat_headers = {"Authorization": f"Bearer {pat_token}"}

    # 4. Fetch Patients
    patients_res = client.get("/patients", headers=doc_headers)
    assert patients_res.status_code == 200
    patients = patients_res.json()
    assert len(patients) >= 5
    patient_id = patients[0]["id"]

    # 5. Book Appointment & Verify Slot Conflict Prevention
    test_date = "2026-10-15"
    test_time = "02:30 PM"
    doctor_id = "D-01"

    # Book 1
    booking1 = {
        "patientId": patient_id,
        "doctorId": doctor_id,
        "doctorName": "Dr. Ravi Sharma",
        "department": "Cardiology",
        "date": test_date,
        "time": test_time,
        "reason": "E2E Cardiology Check"
    }
    b1_res = client.post("/appointments", json=booking1, headers=doc_headers)
    assert b1_res.status_code in [201, 409]  # 201 if first time, 409 if slot already held

    # Duplicate Booking Attempt -> MUST return HTTP 409 Conflict
    dup_res = client.post("/appointments", json=booking1, headers=doc_headers)
    assert dup_res.status_code == 409
    assert "Slot Conflict" in dup_res.json()["detail"]

    # 6. Availability Endpoint Check
    avail_res = client.get(f"/appointments/availability?doctorId={doctor_id}&date={test_date}")
    assert avail_res.status_code == 200
    avail_data = avail_res.json()
    assert test_time in avail_data["bookedSlots"]
    assert test_time not in avail_data["availableSlots"]

    # 7. Clinical Consultation
    consultation_payload = {
        "patientId": patient_id,
        "doctorId": doctor_id,
        "doctorName": "Dr. Ravi Sharma",
        "symptoms": "Mild palpitations during evening walk",
        "diagnosis": "Sinus Arrhythmia (Benign)",
        "treatmentPlan": "Adequate hydration, reduce caffeine",
        "vitals": {"bloodPressure": "122/80 mmHg", "pulse": "74 bpm"}
    }
    cons_res = client.post("/consultations", json=consultation_payload, headers=doc_headers)
    assert cons_res.status_code == 201
    consultation_id = cons_res.json()["id"]

    # 8. Digital Prescription
    rx_payload = {
        "patientId": patient_id,
        "consultationId": consultation_id,
        "doctorId": doctor_id,
        "doctorName": "Dr. Ravi Sharma",
        "medicines": [
            {
                "name": "Electrolyte Oral Solution",
                "dosage": "1 packet in 1L water",
                "duration": "7 Days",
                "instructions": "Drink throughout the morning"
            }
        ],
        "instructions": "Avoid heavy stimulants and energy drinks."
    }
    rx_res = client.post("/prescriptions", json=rx_payload, headers=doc_headers)
    assert rx_res.status_code == 201

    # 9. Notification Generated
    notif_res = client.get("/notifications", headers=doc_headers)
    assert notif_res.status_code == 200
    notifications = notif_res.json()
    assert len(notifications) > 0

    # 10. Dashboard Analytics
    dash_res = client.get("/analytics/dashboard", headers=doc_headers)
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    assert dash_data["overview"]["totalPatients"] >= 5
    assert dash_data["overview"]["totalAppointments"] >= 5
