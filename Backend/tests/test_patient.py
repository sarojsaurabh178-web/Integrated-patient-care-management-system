def test_get_patients(client):
    # First login to get doctor token
    login_resp = client.post("/api/v1/auth/login", json={"username": "dr.ravi", "password": "doctorpassword123"})
    token = login_resp.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/v1/patients", headers=headers)
    assert response.status_code == 200
    patients = response.json()
    assert len(patients) >= 2
