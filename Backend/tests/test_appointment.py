def test_appointment_booking_and_conflict(client):
    login_resp = client.post("/api/v1/auth/login", json={"username": "dr.ravi", "password": "doctorpassword123"})
    token = login_resp.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # First booking for Dr. Ravi at 04:00 PM on 2026-09-20
    booking1 = {
        "patientId": "P101",
        "doctorId": "D-01",
        "doctorName": "Dr. Ravi Sharma",
        "date": "2026-09-20",
        "time": "04:00 PM",
        "reason": "Routine Cardiology Review"
    }
    res1 = client.post("/api/v1/appointments", json=booking1, headers=headers)
    assert res1.status_code == 201

    # Second booking for Dr. Ravi at exact same slot should fail with 409 Conflict
    booking2 = {
        "patientId": "P102",
        "doctorId": "D-01",
        "doctorName": "Dr. Ravi Sharma",
        "date": "2026-09-20",
        "time": "04:00 PM",
        "reason": "Duplicate Slot Conflict"
    }
    res2 = client.post("/api/v1/appointments", json=booking2, headers=headers)
    assert res2.status_code == 409
    assert "Slot Conflict" in res2.json()["detail"]
