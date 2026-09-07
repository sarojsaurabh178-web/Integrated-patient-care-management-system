# 🏥 MEDITRACK - Integrated Patient Care Management System (Backend API)

MediTrack is a scalable, modular, and enterprise-grade Node.js/Express RESTful backend system built according to **Milestones 1, 2, 3, and 4** project specifications.

---

## 📐 Overall Project Journey & Milestones Mapping

```
                    MEDITRACK BACKEND
                        │
        ┌───────────────┼────────────────┐
        │               │                │
   MILESTONE 1     MILESTONE 2      MILESTONE 3
   Foundation      Doctor Module    Security + APIs
   • Patients      • Consultations  • JWT Auth & RBAC
   • Appointments  • Prescriptions  • REST API Engine
                   • History Logs   • Notifications
                                    • Audit Logging
        │               │                │
        └───────────────┼────────────────┘
                        │
                   MILESTONE 4
              Analytics + Testing
           + Optimization & Deployment
```

---

## 🚀 Key Features by Milestone

### 🟢 Milestone 1: Foundation (Patient & Appointment Management)
- **Patient Registration & Demographics**: Register, search, filter, and maintain patient profiles.
- **Appointment Scheduling**: OPD and specialist appointment booking with doctor schedule conflict prevention.

### 🟢 Milestone 2: Consultation & Prescription Management
- **Consultation Engine**: Record clinical symptoms, observations, diagnosis, laboratory results, vitals, and treatment plans.
- **Digital e-Prescriptions**: Generate digital prescriptions detailing medicine names, exact dosage, treatment duration, and medication instructions.
- **Complete EHR Treatment History**: Preserves chronological visit history per patient across multiple consultations.
- **Role-Based Access Control (RBAC)**: Strict permission separation for `Patient`, `Doctor`, and `Admin` users.

### 🟡 Milestone 3: Notifications, Security & APIs
- **JWT Authentication**: Secure token-based authentication (`/api/v1/auth/login`) with bcrypt password hashing.
- **Authorization & RBAC Enforcement**: Role validation middleware restricting doctor actions (recording diagnoses, issuing prescriptions) from patient accounts.
- **Notification Subsystem**: Multi-channel alerts (SMS, Email, In-App) for appointment reminders, prescription alerts, follow-up reminders, and missed appointment notices.
- **Audit Logging**: Enterprise audit trail capturing `USER`, `ACTION`, `ENDPOINT`, `IP`, and `TIMESTAMP` for compliance.
- **Security Event Monitoring**: Automated detection of invalid token access, failed login brute-force attempts, and unauthorized privilege escalation.

### 🔴 Milestone 4: Analytics, Testing & Optimization
- **Executive Dashboard Metrics**: Real-time KPI aggregation including total patients, today's appointments, completed vs. cancelled rates, patient demographics (age groups 0–18, 19–40, 41–60, 60+), doctor consultation volume, and weekly visit trends.
- **Structured Report Exports**: Support for exporting operational reports in **CSV** and **PDF/HTML** formats.
- **Scheduling Workflow Optimization**: In-memory O(1) indexed lookup for doctor availability slot validation.
- **Automated Integration Test Suite**: Complete automated testing covering auth flows, patient records, conflict checks, and analytics.

---

## 🛠️ Technology Stack & Architecture

- **Runtime**: Node.js v25+ (ES Modules)
- **Framework**: Express.js
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + Password Hashing (`bcryptjs`)
- **Security**: CORS headers, security headers, rate limiting, audit logger
- **Architecture**: Layered Architecture (Routes → Middlewares → Controllers → Services → Repositories → Seed Data Models)

---

## 📁 Repository Directory Structure

```
Backend/
├── .env.example                # Environment variables template
├── .env                        # Local configuration
├── package.json                # Dependencies and scripts
├── server.js                   # Application entry point
├── src/
│   ├── app.js                  # Express app initialization & middleware stack
│   ├── config/
│   │   └── env.js              # Environment configuration loader
│   ├── controllers/            # HTTP request controllers
│   │   ├── analytics.controller.js
│   │   ├── appointment.controller.js
│   │   ├── audit.controller.js
│   │   ├── auth.controller.js
│   │   ├── consultation.controller.js
│   │   ├── notification.controller.js
│   │   ├── patient.controller.js
│   │   └── prescription.controller.js
│   ├── middlewares/            # Auth, RBAC, Audit, Security & Error handlers
│   │   ├── audit.middleware.js
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── security.middleware.js
│   ├── repositories/           # Abstracted data access repository layer
│   │   ├── appointment.repository.js
│   │   ├── auditLog.repository.js
│   │   ├── consultation.repository.js
│   │   ├── notification.repository.js
│   │   ├── patient.repository.js
│   │   ├── prescription.repository.js
│   │   └── user.repository.js
│   ├── routes/                 # REST API router modules
│   │   ├── analytics.routes.js
│   │   ├── appointment.routes.js
│   │   ├── audit.routes.js
│   │   ├── auth.routes.js
│   │   ├── consultation.routes.js
│   │   ├── index.js
│   │   ├── notification.routes.js
│   │   ├── patient.routes.js
│   │   └── prescription.routes.js
│   ├── seeders/
│   │   └── seedData.js         # Pre-populated realistic hospital dataset
│   ├── services/               # Core business logic layer
│   │   ├── analytics.service.js
│   │   ├── appointment.service.js
│   │   ├── audit.service.js
│   │   ├── auth.service.js
│   │   ├── consultation.service.js
│   │   ├── notification.service.js
│   │   ├── patient.service.js
│   │   └── prescription.service.js
│   └── utils/                  # JWT, Logger & Report Exporters
│       ├── jwt.util.js
│       ├── logger.util.js
│       └── reportGenerator.util.js
└── tests/                      # Automated Integration & Unit Tests
    ├── analytics.test.js
    ├── appointment.test.js
    ├── auth.test.js
    └── patient.test.js
```

---

## 🔑 Pre-Configured Demo Credentials

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `adminpassword123` | Full system access, audit logs, user management |
| **Doctor** | `dr.ravi` | `doctorpassword123` | Consultations, prescriptions, EHR records |
| **Doctor** | `dr.priya` | `doctorpassword123` | Consultations, prescriptions, EHR records |
| **Patient** | `rahul` | `patientpassword123` | Personal profile, appointment booking, view own prescriptions |

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required | Allowed Roles |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate user & receive JWT token | No | Public |
| `POST` | `/api/v1/auth/register` | Register a new user account | No | Public |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile | Yes | All Roles |

### 🩺 Patients (`/api/v1/patients`)
| Method | Endpoint | Description | Auth Required | Allowed Roles |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/patients` | Get list of patients (supports search & filter) | Yes | All Roles |
| `POST` | `/api/v1/patients` | Register new patient record | Yes | Admin, Doctor |
| `GET` | `/api/v1/patients/:id` | Get patient profile details | Yes | All Roles |
| `PUT` | `/api/v1/patients/:id` | Update patient record | Yes | Admin, Doctor |
| `DELETE` | `/api/v1/patients/:id` | Soft-delete / Archive patient record | Yes | Admin |
| `GET` | `/api/v1/patients/:id/history` | Get complete treatment & consultation history | Yes | All Roles |

### 📅 Appointments (`/api/v1/appointments`)
| Method | Endpoint | Description | Auth Required | Allowed Roles |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/appointments` | Get scheduled/completed/cancelled appointments | Yes | All Roles |
| `POST` | `/api/v1/appointments` | Book new appointment (with conflict check) | Yes | All Roles |
| `GET` | `/api/v1/appointments/:id` | Get appointment details | Yes | All Roles |
| `PUT` | `/api/v1/appointments/:id` | Update appointment status | Yes | Admin, Doctor |
| `DELETE` | `/api/v1/appointments/:id` | Cancel appointment | Yes | All Roles |

### 📋 Consultations (`/api/v1/consultations`)
| Method | Endpoint | Description | Auth Required | Allowed Roles |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/consultations` | List all recorded consultations | Yes | All Roles |
| `POST` | `/api/v1/consultations` | Record symptoms, diagnosis, and treatment plan | Yes | Doctor, Admin |
| `GET` | `/api/v1/consultations/:id` | Get consultation record details | Yes | All Roles |
| `GET` | `/api/v1/consultations/patient/:patientId` | Get consultations for specific patient | Yes | All Roles |

### 💊 Prescriptions (`/api/v1/prescriptions`)
| Method | Endpoint | Description | Auth Required | Allowed Roles |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/prescriptions` | List electronic prescriptions | Yes | All Roles |
| `POST` | `/api/v1/prescriptions` | Generate digital e-Prescription | Yes | Doctor, Admin |
| `GET` | `/api/v1/prescriptions/:id` | Get prescription details | Yes | All Roles |
| `GET` | `/api/v1/prescriptions/patient/:patientId` | Get prescriptions for specific patient | Yes | All Roles |

### 🔔 Notifications (`/api/v1/notifications`)
| Method | Endpoint | Description | Auth Required | Allowed Roles |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/notifications` | Get system notifications | Yes | All Roles |
| `POST` | `/api/v1/notifications/send` | Trigger appointment/prescription reminder | Yes | Doctor, Admin |
| `PUT` | `/api/v1/notifications/:id/read` | Mark notification as read | Yes | All Roles |

### 🛡️ Audit & Security (`/api/v1/audit`)
| Method | Endpoint | Description | Auth Required | Allowed Roles |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/audit/logs` | Retrieve enterprise audit trail | Yes | Admin |
| `GET` | `/api/v1/audit/security-events` | Retrieve security monitoring alerts | Yes | Admin |

### 📊 Analytics & Reports (`/api/v1/analytics`)
| Method | Endpoint | Description | Auth Required | Allowed Roles |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/analytics/dashboard` | Aggregated executive KPIs & charts data | Yes | Doctor, Admin |
| `GET` | `/api/v1/analytics/reports/csv` | Export operational report in CSV format | Yes | Doctor, Admin |
| `GET` | `/api/v1/analytics/reports/pdf` | Generate operational report in HTML/PDF format | Yes | Doctor, Admin |

---

## 💻 Quick Start & Installation

1. **Navigate to the Backend Directory**:
   ```bash
   cd Backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=meditrack_super_secret_jwt_key_2026_production
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=*
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Run Automated Test Suite**:
   ```bash
   npm test
   ```

6. **Verify API Health**:
   Open `http://localhost:5000/api/v1/health` in your browser.

---

## 🚢 Production Deployment Guide

1. **Environment Setup**: Set `NODE_ENV=production` and configure a strong `JWT_SECRET` in environment variables.
2. **Reverse Proxy (Nginx/Cloudflare)**: Route incoming HTTPS traffic to port `5000`.
3. **Process Manager**: Run using PM2 for multi-core scaling and automatic restarts:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "meditrack-api" -i max
   ```
