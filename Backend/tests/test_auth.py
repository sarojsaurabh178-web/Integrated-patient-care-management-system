def test_login_success(client):
    response = client.post("/api/v1/auth/login", json={"username": "dr.ravi", "password": "doctorpassword123"})
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["user"]["role"] == "Doctor"

def test_login_failure(client):
    response = client.post("/api/v1/auth/login", json={"username": "dr.ravi", "password": "wrongpassword"})
    assert response.status_code == 401
    assert "Invalid username or password" in response.json()["detail"]
