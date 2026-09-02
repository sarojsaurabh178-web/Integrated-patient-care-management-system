export const ROLES = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  ADMINISTRATOR: 'ADMINISTRATOR'
};

export const ROLE_DETAILS = {
  PATIENT: {
    role: 'PATIENT',
    title: 'Patient Account',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    avatar: 'RV',
    badge: 'Patient',
    permissions: [
      'View own profile',
      'Book appointment',
      'View own appointments',
      'View own prescriptions',
      'View own notifications'
    ],
    allowedTabs: [
      'dashboard',
      'my_profile',
      'appointments',
      'prescriptions',
      'notifications',
      'settings'
    ]
  },
  DOCTOR: {
    role: 'DOCTOR',
    title: 'Medical Specialist',
    name: 'Dr. Sarah Jenkins',
    email: 's.jenkins@meditrack.org',
    avatar: 'SJ',
    badge: 'Senior Medical Officer',
    permissions: [
      'View patient records',
      'Create consultation',
      'Record diagnosis',
      'Generate prescription',
      'View appointments',
      'View own notifications'
    ],
    allowedTabs: [
      'dashboard',
      'patients',
      'appointments',
      'consultation',
      'prescriptions',
      'notifications',
      'settings'
    ]
  },
  ADMINISTRATOR: {
    role: 'ADMINISTRATOR',
    title: 'System Administrator',
    name: 'System Admin',
    email: 'admin@meditrack.org',
    avatar: 'SA',
    badge: 'Super Admin',
    permissions: [
      'Manage users',
      'Manage system information',
      'Monitor appointments',
      'View audit logs',
      'View security events',
      'Configure API states & JWT visualizer'
    ],
    allowedTabs: [
      'dashboard',
      'users',
      'patients',
      'doctors',
      'appointments',
      'audit_logs',
      'security_monitoring',
      'jwt_flow',
      'api_docs',
      'notifications',
      'settings'
    ]
  }
};
