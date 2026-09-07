def test_dashboard_analytics(client):
    login_resp = client.post("/api/v1/auth/login", json={"username": "dr.ravi", "password": "doctorpassword123"})
    token = login_resp.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/v1/analytics/dashboard", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "overview" in data
    assert "patientDemographics" in data
