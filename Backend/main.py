import uvicorn
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seeders.seed_data import seed_db
from app.middlewares.security import SecurityHeadersMiddleware
from app.repositories.audit_repository import AuditRepository
from app.routers.auth import router as auth_router
from app.routers.patient import router as patient_router
from app.routers.appointment import router as appointment_router
from app.routers.consultation import router as consultation_router
from app.routers.prescription import router as prescription_router
from app.routers.notification import router as notification_router
from app.routers.audit import router as audit_router
from app.routers.analytics import router as analytics_router

# 1. Initialize Database Tables & Seed Data
Base.metadata.create_all(bind=engine)
seed_db()

# 2. FastAPI Application Metadata
app = FastAPI(
    title="🏥 MEDITRACK HEALTHCARE API",
    description="Integrated Patient Care Management System (Milestones 1, 2, 3 & 4) - Pure Python & PostgreSQL Engine",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 3. Security & CORS Middlewares
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Audit Logger Middleware
@app.middleware("http")
async def audit_logger_middleware(request: Request, call_next):
    response: Response = await call_next(request)
    
    # Audit log state modifying requests or patient requests
    path = request.url.path
    method = request.method
    if (method in ["POST", "PUT", "DELETE"] or "/patients" in path) and (200 <= response.status_code < 400):
        try:
            db = SessionLocal()
            action = f"{method} {path}"
            if "/auth/login" in path: action = "User Login"
            elif "/consultations" in path: action = "Recorded Clinical Consultation"
            elif "/prescriptions" in path: action = "Generated Digital Prescription"
            elif "/appointments" in path: action = f"{'Booked' if method == 'POST' else 'Updated'} Appointment"
            elif "/patients" in path: action = f"{method} Patient Record"

            client_ip = request.client.host if request.client else "127.0.0.1"
            AuditRepository.add_audit_log(db, {
                "userId": "ANONYMOUS",
                "userName": "System User",
                "userRole": "USER",
                "action": action,
                "method": method,
                "endpoint": path,
                "statusCode": response.status_code,
                "ip": client_ip
            })
            db.close()
        except Exception as e:
            pass

    return response

# 5. Root & Health Check Endpoints
@app.get("/", tags=["System & Health"])
def root_welcome():
    return {
        "message": "🏥 Welcome to MediTrack Integrated Patient Care Management System (Python & PostgreSQL Backend Engine)",
        "documentation": "/docs",
        "health": "/api/v1/health",
        "version": "1.0.0"
    }

@app.get("/api/v1/health", tags=["System & Health"])
def health_check():
    return {
        "status": "success",
        "service": "MediTrack Python FastAPI Engine",
        "database": settings.DATABASE_URL.split("://")[0].upper(),
        "milestones": {
            "milestone1": "Patient & Appointment Management - ACTIVE",
            "milestone2": "Consultation & Prescription Engine - ACTIVE",
            "milestone3": "JWT Security, RBAC, Notifications & Audit - ACTIVE",
            "milestone4": "Analytics, Reporting & Optimization - ACTIVE"
        }
    }

# 6. Mount Routers under /api/v1 and direct routes for frontend proxy compatibility
api_prefix = "/api/v1"
for r in [auth_router, patient_router, appointment_router, consultation_router, prescription_router, notification_router, audit_router, analytics_router]:
    app.include_router(r, prefix=api_prefix)
    app.include_router(r)

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
