# 🏥 MediTrack — Integrated Patient Care Management System

<<<<<<< HEAD
MediTrack is a web-based Integrated Patient Care Management System designed to simplify and organize healthcare management by providing a centralized platform for managing patient information, appointments, consultations, prescriptions, notifications, security, analytics, and healthcare-related activities.
=======
MediTrack is a web-based Integrated Patient Care Management System designed to make healthcare management more organized, efficient, secure, and accessible.

The system provides a centralized platform for managing patient information, appointments, consultations, prescriptions, notifications, security activities, analytics, and reports.

The project is developed progressively through four major milestones:

> **Milestone 1 → Manage**  
> **Milestone 2 → Treat**  
> **Milestone 3 → Protect & Connect**  
> **Milestone 4 → Analyze & Finalize**


## 1. Problem Statement & Scope

### 🔴 The Healthcare Problem
Traditional healthcare facilities often rely on manual paper records or fragmented software tools. This results in:
- **Disjointed Patient Records**: Difficulty retrieving medical history across departments.
- **Appointment Scheduling Conflicts**: High rate of double-booking, long wait times, and missed follow-ups.
- **Inaccurate & Slow Prescriptions**: Hand-written prescriptions leading to errors or poor legibility.
- **Lack of Auditing & Security**: Inability to track who accessed or updated confidential patient data.
- **Administrative Overhead**: High time expenditure spent managing routine patient intake and status updates.

### 🟢 How MediTrack Solves It
MediTrack digitizes the end-to-end patient care lifecycle into a unified, secure web platform:
- **Centralized Electronic Health Records (EHR)**: Instant access to patient registration, medical history, and clinical notes.
- **Smart Appointment System**: Real-time slot conflict management and status tracking (Scheduled, Completed, Cancelled).
- **Clinical Consultation & Digital Rx**: Doctor tools for symptom tracking, diagnosis recording, and structured digital prescription generation.
- **Automated Notifications & Reminders**: System-wide notifications for appointments, follow-ups, and prescription alerts.
- **Enterprise Security & Audit Logging**: Role-Based Access Control (RBAC), JWT authentication, and automatic audit logs for regulatory compliance.
- **Light & Dark Theme System**: Built-in global theme manager with `localStorage` persistence and OS preference detection for optimal visual comfort.

### 🔄 End-to-End Care Workflow
=======

1. [Problem Statement & Scope](#-problem-statement--scope)
2. [Key Features](#-key-features)
3. [System Architecture](#-system-architecture)
4. [Technology Stack](#-technology-stack)
5. [User Roles & Access Control Matrix](#-user-roles--access-control-matrix)
6. [Database Foundation](#-database-foundation)
7. [Project Structure](#-project-structure)
8. [Quick Start Guide](#-quick-start-guide)
9. [API Reference](#-api-reference)
10. [Testing & Validation](#-testing--validation)
11. [Performance Optimizations](#-performance-optimizations)
12. [Security Considerations](#-security-considerations)
13. [Current System Limitations](#-current-system-limitations)
14. [Academic / Project Note](#-academic--project-note)
15. [Documentation Index](#-documentation-index)

---

# 🎯 Problem Statement & Scope

## Problem Statement

Traditional healthcare environments may rely on paper-based records and manual appointment management.

This can create several problems:

- Patient records may be lost or damaged.
- Searching for patient information can take significant time.
- Appointment scheduling may be handled manually.
- Doctors may not have quick access to previous medical history.
- Duplicate patient records may be created.
- Managing a large number of patients becomes difficult.
- Communication between patients, doctors, and hospital staff can be inefficient.

MediTrack aims to address these problems through a centralized digital healthcare management system.

## Scope

The system covers the complete patient-care workflow:
>>>>>>> 73f69d08bae58da16d7508183c148e9eba8b7bc6

```text
Patient Registration
        ↓
<<<<<<< HEAD
Patient Profile & Medical History
        ↓
Appointment Scheduling & Slot Allocation
        ↓
Clinical Consultation
        ↓
Diagnosis & Treatment Plan
        ↓
Digital Prescription Generation
        ↓
Automated System Notifications
        ↓
Security Monitoring & Audit Logging
        ↓
Executive Analytics & Reports
```

---

## 2. Key Features

MediTrack is structured into four core development milestones:

### 📑 MILESTONE 1 — MANAGE (Patient & Appointment Management)
- ✅ **Patient Registration**: Capture demographic data, blood group, emergency contact details, and medical alerts.
- ✅ **Patient Profile Management**: Centralized records with instant search, status filtering, and edit capabilities.
- ✅ **Medical History Tracking**: Complete history of past conditions, allergies, and ongoing treatments.
- ✅ **Interactive Appointment Scheduling**: Date and time slot selector with doctor mapping.
- ✅ **Doctor Selection & Duty Status**: Filter doctors by specialization, OPD availability, and duty status.
- ✅ **Slot Availability & Conflict Guard**: Prevents double-booking doctor slots.
- ✅ **Appointment History & Status Pipeline**: Track appointments across `Scheduled`, `Completed`, and `Cancelled` states.

### 🩺 MILESTONE 2 — TREAT (Consultation & Prescription Engine)
- ✅ **Clinical Consultation Form**: Record chief symptoms, clinical observations, diagnosis, and lab recommendations.
- ✅ **Structured Treatment Plan**: Define dosage, medication frequency, duration, and special clinical instructions.
- ✅ **Digital Prescription Generator**: Instant generation of structured prescriptions linked to patient records.
- ✅ **Prescription History & Print Preview**: Modal view formatted for digital printing or archive.
- ✅ **Diagnosis Tracking**: Quick lookup of diagnosis notes across historical visits.

### 🛡️ MILESTONE 3 — PROTECT & CONNECT (Security, APIs & Notifications)
- ✅ **Role-Based Access Control (RBAC)**: Enforced permission boundaries across `PATIENT`, `DOCTOR`, and `ADMINISTRATOR` roles.
- ✅ **JWT Authentication Architecture**: Secure bearer token token issuance and decoding.
- ✅ **RESTful API Engine**: Standardized REST endpoints built with FastAPI and OpenAPI/Swagger specs.
- ✅ **Notification Center**: Real-time alert feed for appointment reminders, prescription alerts, and follow-ups.
- ✅ **Audit Logging System**: Automatic tracking of system actions, HTTP methods, IP addresses, and timestamps.
- ✅ **Security Monitoring Dashboard**: Threat log, suspicious login detection, and alert management.
- ✅ **Global Light & Dark Theme System**: Reusable theme toggle button in Navbar with `localStorage` persistence and smooth visual transitions.

### 📊 MILESTONE 4 — ANALYZE & FINALIZE (Analytics, Testing & Documentation)
- ✅ **Executive Dashboard**: KPI stat cards for total patients, active consultations, doctor availability, and daily queues.
- ✅ **Interactive Analytics Summary**: Categorized metrics and resource utilization graphs.
- ✅ **API Documentation Page**: Interactive Swagger UI (`/docs`) and ReDoc (`/redoc`) integration.
- ✅ **JWT Flow Visualization**: Graphical step-by-step breakdown of token validation and role permissions.
- ✅ **Custom Error Pages**: Styled 401 Unauthorized, 403 Forbidden, 404 Not Found, and 500 Server Error pages.
- 🚧 **CSV / PDF Report Export**: In Progress (Frontend download action mock ready, server-side PDF renderer planned).
- ⏳ **Real-Time WebSocket Push**: Planned for future release.

#### Feature Status Summary
- ✅ **Completed**: 90%
- 🚧 **In Progress**: 5%
- ⏳ **Planned**: 5%

---

## 3. System Architecture

MediTrack follows a clean, decoupled 3-tier architecture:

```text
┌─────────────────────────────────────────────────────────────┐
│                    User Browser / Client                    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Frontend Layer (React 18 + Vite)                │
│  - Single Page Application (SPA)                            │
│  - Vanilla CSS Design System with Theme Variables           │
│  - Lucide React Icons & Responsive Components               │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP REST Requests (JSON)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Backend Layer (Python FastAPI Engine)           │
│  - API Routers (/api/v1/auth, /patients, /appointments, ...) │
│  - Audit Logging Middleware & Security Headers              │
│  - PyJWT Authentication & Passlib Bcrypt Hashing            │
└──────────────────────────────┬──────────────────────────────┘
                               │ SQLAlchemy ORM
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Database Storage Layer                    │
│  - SQLite (Local Dev Default: meditrack.db)                 │
│  - PostgreSQL Support (Production Ready via psycopg2)       │
└─────────────────────────────────────────────────────────────┘
```

### Layer Breakdown
1. **Frontend (React 18 + Vite)**: Modern user interface providing state-driven views, client-side routing, theme switching, interactive modal overlays, and toast notifications.
2. **Backend (Python FastAPI Engine)**: High-performance async Python backend executing business logic, input validation via Pydantic schemas, authentication, and audit middleware.
3. **REST API Interface**: Standardized JSON-over-HTTP communications exposed at `/api/v1` with full OpenAPI/Swagger interactive documentation.
4. **Database Storage**: Relational data model driven by SQLAlchemy ORM, configured for SQLite during local development and scalable to PostgreSQL.
5. **Security Layer**: JWT authentication bearer tokens, role checks, password hashing via bcrypt, and automated audit logging.

---

## 4. Technology Stack

### Frontend
- **Framework**: React 18.3 (JavaScript / JSX)
- **Build Tool**: Vite 5.4
- **Icons**: Lucide React (`lucide-react`)
- **Styling**: Vanilla CSS with CSS Custom Properties (Theme system supporting Light Mode and Dark Mode)

### Backend
- **Framework**: Python 3.10+ / FastAPI 0.111+
- **ASGI Server**: Uvicorn 0.30+
- **Data Validation**: Pydantic 2.7+
- **ORM**: SQLAlchemy 2.0+

### Database
- **Primary Database**: SQLite (`meditrack.db` for local dev)
- **Production Adapter**: PostgreSQL support via `psycopg2-binary`

### APIs & Security
- **API Standard**: RESTful JSON APIs (`/api/v1`)
- **Authentication**: JSON Web Tokens (`pyjwt`)
- **Password Security**: Passlib with Bcrypt
- **CORS & Headers**: FastAPI CORSMiddleware + Custom SecurityHeadersMiddleware

### Development & Testing Tools
- **Version Control**: Git & GitHub
- **Testing Framework**: Pytest (`pytest`), HTTPX (`httpx`)
- **Documentation**: Swagger UI (`/docs`), ReDoc (`/redoc`)
- **Editor**: VS Code

---

## 5. User Roles & Access Control Matrix

MediTrack strictly enforces Role-Based Access Control (RBAC) across three distinct user roles:

| Module / Feature | Patient | Doctor | Administrator |
| :--- | :---: | :---: | :---: |
| **View Dashboard** | ✅ | ✅ | ✅ |
| **Register & Manage Patients** | ❌ | ✅ | ✅ |
| **View Own Patient Profile** | ✅ | ✅ | ✅ |
| **Book Appointment** | ✅ | ✅ | ✅ |
| **Update Appointment Status** | ❌ | ✅ | ✅ |
| **Record Clinical Consultation** | ❌ | ✅ | ✅ |
| **Generate Digital Prescription** | ❌ | ✅ | ❌ |
| **View Own Prescriptions** | ✅ | ✅ | ✅ |
| **View System Audit Logs** | ❌ | ❌ | ✅ |
| **Security Monitoring & Threat Logs** | ❌ | ❌ | ✅ |
| **REST API Documentation & JWT Flow** | ❌ | ❌ | ✅ |

---

## 6. Database Foundation

The database schema is designed using SQLAlchemy relational models:

| Entity / Model | Database Table | Purpose |
| :--- | :--- | :--- |
| **User** | `users` | Stores authentication credentials, hashed passwords, roles (`PATIENT`, `DOCTOR`, `ADMINISTRATOR`), and profile info. |
| **Patient** | `patients` | Stores patient demographics, contact details, blood group, medical alert tags, and emergency contact. |
| **Doctor** | `doctors` | Stores doctor specializations, OPD schedule, room assignment, and duty status (`On Duty`, `In Surgery`, `Off Duty`). |
| **Appointment** | `appointments` | Stores scheduled slots, mapped patient and doctor IDs, department, appointment date/time, and status (`Scheduled`, `Completed`, `Cancelled`). |
| **Consultation** | `consultations` | Stores clinical encounter records: symptoms, physical observations, diagnosis, lab tests, and clinical notes. |
| **Prescription** | `prescriptions` | Stores digital medication orders: drug names, dosage, frequency, duration, and doctor signatures. |
| **Notification** | `notifications` | Stores system alerts for patients and staff (reminders, prescription updates, missed visits). |
| **AuditLog** | `audit_logs` | Audit trail recording user actions, HTTP methods, target endpoints, response codes, and client IP addresses. |
| **SecurityEvent** | `security_events` | Logs security events such as failed login attempts, unauthorized access tries, and token expirations. |

---

## 7. Project Structure

```text
MediSync/
├── Backend/
│   ├── app/
│   │   ├── config.py              # Application settings & environment loader
│   │   ├── database.py            # SQLAlchemy engine, session, & Base definition
│   │   ├── middlewares/           # Security headers & auth verification middlewares
│   │   ├── models/                # SQLAlchemy database models (user, patient, appointment, etc.)
│   │   ├── repositories/          # Data access layer / repository pattern handlers
│   │   ├── routers/               # FastAPI route definitions (/auth, /patients, /appointments, etc.)
│   │   ├── schemas/               # Pydantic request & response validation schemas
│   │   ├── seeders/               # Database seeder scripts for initial mock data
│   │   ├── services/              # Business logic layer
│   │   └── utils/                 # Security, JWT, & hashing utility helper functions
│   ├── tests/                     # Pytest suite (unit & integration tests)
│   ├── .env.example               # Environment variable configuration template
│   ├── main.py                    # FastAPI entrypoint application
│   ├── meditrack.db               # SQLite database instance
│   ├── README.md                  # Backend specific documentation
│   └── requirements.txt           # Python dependency manifest
├── Frontend/
│   ├── public/                    # Static assets & web icons
│   ├── src/
│   │   ├── assets/                # Visual branding & image assets
│   │   ├── components/            # Reusable UI components (Navbar, ThemeToggle, Modals, Tables)
│   │   ├── data/                  # Initial state datasets & demo mock data
│   │   ├── hooks/                 # React custom hooks (useTheme for theme management)
│   │   ├── pages/                 # Full view pages (Dashboard, Patients, Appointments, Security, etc.)
│   │   ├── styles/                # CSS design system (theme.css, patientRegistration.css, milestone3.css)
│   │   ├── App.jsx                # Main application component & layout state
│   │   └── main.jsx               # React DOM root mounting script
│   ├── index.html                 # Main HTML document template
│   ├── package.json               # Node.js dependencies & npm scripts
│   └── vite.config.js             # Vite development server configuration
├── .gitignore                     # Git exclusion rules
└── README.md                      # Primary repository README documentation
```

---

## 8. Quick Start Guide

### Prerequisites
- **Node.js**: v18.0 or higher
- **Python**: v3.10 or higher
- **Git**: installed on system

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/sarojsaurabh178-web/Integrated-patient-care-management-system.git
cd Integrated-patient-care-management-system
```

---

### Step 2: Run the Frontend (React + Vite)
```bash
# Navigate to Frontend directory
cd Frontend

# Install Node dependencies
npm install

# Start Vite local development server
npm run dev
```
The frontend will launch at `http://localhost:5173`.

---

### Step 3: Run the Backend (Python FastAPI)
Open a new terminal window:
```bash
# Navigate to Backend directory
cd Backend

# Create a virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run FastAPI server via main.py or Uvicorn
python main.py
```
The backend API server will run at `http://127.0.0.1:8000`.
- **Interactive Swagger Documentation**: `http://127.0.0.1:8000/docs`
- **ReDoc Documentation**: `http://127.0.0.1:8000/redoc`

---

## 9. API Reference

All backend endpoints are prefixed under `/api/v1`:

### 🔐 Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/auth/login` | Authenticate user & issue JWT bearer token | No |
| `GET` | `/api/v1/auth/me` | Fetch current user session details | Yes |

### 🩺 Patients (`/api/v1/patients`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/patients` | Get list of patients (supports search & filter) | Yes |
| `POST` | `/api/v1/patients` | Register new patient record | Yes |
| `GET` | `/api/v1/patients/{id}` | Get patient profile details | Yes |
| `PUT` | `/api/v1/patients/{id}` | Update patient record | Yes |
| `DELETE` | `/api/v1/patients/{id}` | Archive / delete patient record | Yes |
| `GET` | `/api/v1/patients/{id}/history` | Get medical & treatment history | Yes |

### 📅 Appointments (`/api/v1/appointments`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/appointments` | Get scheduled/completed/cancelled appointments | Yes |
| `POST` | `/api/v1/appointments` | Book new appointment (with slot check) | Yes |
| `GET` | `/api/v1/appointments/{id}` | Get appointment details | Yes |
| `PUT` | `/api/v1/appointments/{id}` | Update appointment status | Yes |
| `DELETE` | `/api/v1/appointments/{id}` | Cancel appointment | Yes |

### 📋 Consultations & Prescriptions (`/api/v1/consultations` & `/api/v1/prescriptions`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/consultations` | List recorded clinical consultations | Yes |
| `POST` | `/api/v1/consultations` | Record diagnosis & treatment plan | Yes |
| `GET` | `/api/v1/prescriptions` | List generated prescriptions | Yes |
| `POST` | `/api/v1/prescriptions` | Issue new digital prescription | Yes |

### 🛡️ Security & Audits (`/api/v1/audit`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/audit/logs` | Fetch system action audit trail | Yes (Admin) |
| `GET` | `/api/v1/audit/security-events` | Fetch security threat events | Yes (Admin) |

### 📊 Analytics (`/api/v1/analytics`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/analytics/summary` | Get aggregated clinical statistics | Yes |

---

## 10. Testing & Validation

### Automated Testing Approach
- **Backend Unit & Integration Tests**: Implemented using `pytest` and FastAPI's `TestClient` (`httpx`).
- **Endpoint Tests**: Validates status codes, JSON response schemas, and authentication error responses.

To run the backend test suite:
```bash
cd Backend
pytest
```

### Manual & UI Validation Workflow
1. **Theme Verification**: Toggle theme via Navbar switch. Confirm immediate color scheme change and `localStorage` persistence upon browser refresh.
2. **Registration to Consultation Flow**:
   - Register patient -> Book appointment -> Select patient in Consultation tab -> Enter symptoms & diagnosis -> Generate prescription -> Verify notification auto-creation & audit log record.

---

## 11. Performance Optimizations

- **Vite Fast Module Bundling**: Instant HMR and optimized production JavaScript/CSS chunking.
- **CSS Custom Property Design Tokens**: Single-file theme switching without duplicating stylesheets or adding heavy CSS libraries.
- **Efficient Indexing & Database Queries**: SQLAlchemy relational indexes on frequently queried foreign keys (`patient_id`, `doctor_id`, `appointment_date`).
- **Client-Side State Filtering**: Instant search and status filtering for patients and appointments without unnecessary server roundtrips.

---

## 12. Security Considerations

- **JSON Web Token (JWT) Security**: Standardized token validation with secret signature checks and expiration windows.
- **Bcrypt Password Hashing**: Passlib hashing ensures passwords are never stored in plaintext.
- **Role-Based Access Guarding**: Both client-side UI navigation guards and backend router dependency checks block unauthorized access.
- **Automated HTTP Audit Logger Middleware**: Captures state-changing requests (POST, PUT, DELETE) and records timestamp, action, and client IP.
- **HTTP Security Headers Middleware**: Sets protective browser security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`).

---

## 13. Current System Limitations

- **Local Development Database**: Configured by default to SQLite (`meditrack.db`) for zero-setup execution. Production deployments require configuring PostgreSQL in `.env`.
- **Real-Time Push Notifications**: Notifications are currently polled/event-driven via state updates; full WebSocket push server is planned.
- **Export Capabilities**: CSV/PDF report download triggers mock file downloads in the demo UI. Server-side PDF binary generation engine is planned for future extension.

---

## 14. Academic / Project Note

MediTrack is developed as an academic and internship demonstration project for **Infosys Internship**.

It demonstrates key enterprise web application principles:
- Digitization of complex domain workflows (Healthcare EHR)
- Clean separation of concerns (Frontend React SPA vs Python FastAPI Backend)
- Security architecture (JWT, RBAC, Audit trails)
- User experience & visual design (Custom CSS token system, Light & Dark themes)
- Comprehensive REST API design & automated documentation

> [!NOTE]
> *This project is intended for educational and demonstration purposes and should not be considered a production-ready clinical system without appropriate healthcare regulatory, HIPAA/GDPR privacy compliance, and medical domain validation.*

---

## 15. Documentation Index & Project Journey

```text
MILESTONE 1 — MANAGE
Patient Registration + Appointment Scheduling
        ↓
MILESTONE 2 — TREAT
Clinical Consultation + Prescription Engine
        ↓
MILESTONE 3 — PROTECT & CONNECT
JWT Security + REST APIs + Notifications + Audit Logs + Light/Dark Themes
        ↓
MILESTONE 4 — ANALYZE & FINALIZE
Analytics Dashboards + Testing + Optimization + Deployment Docs
```

### 📋 Project Milestone Status Table

| Milestone | Functional Focus | Implementation Status |
| :--- | :--- | :---: |
| **Milestone 1** | Patient & Appointment Management | ✅ Completed |
| **Milestone 2** | Consultation & Prescription Engine | ✅ Completed |
| **Milestone 3** | Security, REST APIs, Notifications, Audit Logs & Theme System | ✅ Completed |
| **Milestone 4** | Executive Analytics, Testing & Documentation | ✅ Completed |
| **Backend Engine** | Python FastAPI & SQLAlchemy ORM Database Engine | ✅ Completed |
| **Database** | SQLite Dev Database & PostgreSQL Adapter | ✅ Completed |

---

## 👨‍💻 Author

**Saurabh Saroj**  
*MediTrack – Integrated Patient Care Management System*  
*Infosys Internship Project*
=======
Patient Profile
        ↓
Appointment Scheduling
        ↓
Doctor Consultation
        ↓
Diagnosis & Treatment
        ↓
Prescription
        ↓
Notifications
        ↓
Security & Audit Logs
        ↓
Analytics & Reports

