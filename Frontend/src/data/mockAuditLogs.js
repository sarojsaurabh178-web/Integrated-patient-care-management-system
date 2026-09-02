export const initialAuditLogs = [
  {
    id: 'LOG-8001',
    user: 'Dr. Ravi Sharma',
    role: 'Doctor',
    action: 'Viewed Patient',
    resource: 'P101 - Rahul Verma',
    timestamp: '2026-08-31 10:30 AM',
    ipAddress: '192.168.1.45',
    status: 'Success',
    details: 'Accessed EHR medical history and vital charts.'
  },
  {
    id: 'LOG-8002',
    user: 'Dr. Ravi Sharma',
    role: 'Doctor',
    action: 'Added Diagnosis',
    resource: 'P101 - Rahul Verma',
    timestamp: '2026-08-31 10:35 AM',
    ipAddress: '192.168.1.45',
    status: 'Success',
    details: 'Recorded diagnosis: Primary Hypertension (ICD-10 I10).'
  },
  {
    id: 'LOG-8003',
    user: 'System Admin',
    role: 'Administrator',
    action: 'Updated Patient',
    resource: 'P101 - Rahul Verma',
    timestamp: '2026-08-31 11:00 AM',
    ipAddress: '10.0.0.12',
    status: 'Success',
    details: 'Updated insurance provider details and contact phone number.'
  },
  {
    id: 'LOG-8004',
    user: 'Rahul Verma',
    role: 'Patient',
    action: 'Booked Appointment',
    resource: 'A101 - Cardiology OPD',
    timestamp: '2026-08-31 11:20 AM',
    ipAddress: '157.48.201.99',
    status: 'Success',
    details: 'Self-scheduled OPD slot with Dr. Ravi Sharma.'
  },
  {
    id: 'LOG-8005',
    user: 'Dr. Sarah Jenkins',
    role: 'Doctor',
    action: 'Generated Prescription',
    resource: 'RX-202 - Priya Patel',
    timestamp: '2026-08-31 11:45 AM',
    ipAddress: '192.168.1.52',
    status: 'Success',
    details: 'Issued prescription for Metformin 500mg (BD) x 30 days.'
  },
  {
    id: 'LOG-8006',
    user: 'Unknown User',
    role: 'Guest',
    action: 'Failed Login Attempt',
    resource: '/auth/login',
    timestamp: '2026-08-31 12:05 PM',
    ipAddress: '185.220.101.5',
    status: 'Failed',
    details: 'Invalid credentials provided for username "admin_root".'
  },
  {
    id: 'LOG-8007',
    user: 'Rahul Verma',
    role: 'Patient',
    action: 'Attempted Restricted View',
    resource: 'P102 - Priya Patel',
    timestamp: '2026-08-31 12:25 PM',
    ipAddress: '157.48.201.99',
    status: 'Denied',
    details: 'HTTP 403 Forbidden: Patient attempted to inspect another patient record.'
  },
  {
    id: 'LOG-8008',
    user: 'System Admin',
    role: 'Administrator',
    action: 'Modified User Role',
    resource: 'User: dr_anita',
    timestamp: '2026-08-31 01:10 PM',
    ipAddress: '10.0.0.12',
    status: 'Success',
    details: 'Granted Senior Clinical Specialist permissions.'
  }
];
