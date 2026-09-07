import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    # Seed test db
    db = TestingSessionLocal()
    from app.models import User, Patient
    from app.repositories.user_repository import pwd_context
    if db.query(User).count() == 0:
        db.add_all([
            User(id="U-ADMIN", username="admin", name="System Administrator", email="admin@meditrack.org", role="Admin", password_hash=pwd_context.hash("adminpassword123")),
            User(id="D-01", username="dr.ravi", name="Dr. Ravi Sharma", email="dr.ravi@meditrack.org", role="Doctor", specialty="Cardiology", password_hash=pwd_context.hash("doctorpassword123")),
            User(id="U-P101", username="rahul", name="Rahul Verma", email="rahul.verma@example.com", role="Patient", password_hash=pwd_context.hash("patientpassword123"))
        ])
        db.add_all([
            Patient(id="P101", name="Rahul Verma", full_name="Rahul Verma", age=34, gender="Male", phone="+91 98765 43210", blood_group="O+"),
            Patient(id="P102", name="Priya Patel", full_name="Priya Patel", age=28, gender="Female", phone="+91 98123 45678", blood_group="A+")
        ])
        db.commit()
    db.close()

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    return TestClient(app)
