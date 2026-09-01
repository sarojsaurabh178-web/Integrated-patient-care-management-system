export const initialSecurityEvents = [
  {
    id: 'SEC-4001',
    user: 'Rahul Verma',
    event: 'Failed Login',
    date: '2026-08-31',
    time: '10:20 AM',
    ipAddress: '157.48.201.99',
    status: 'Failed',
    severity: 'Warning',
    category: 'Authentication',
    details: '3 consecutive incorrect password attempts for user rahul@meditrack.org.'
  },
  {
    id: 'SEC-4002',
    user: 'Unknown User',
    event: 'Unauthorized Patient Record Access',
    date: '2026-08-31',
    time: '10:25 AM',
    ipAddress: '185.220.101.5',
    status: 'Blocked',
    severity: 'Critical',
    category: 'Authorization',
    details: 'Direct URL invocation of GET /api/v1/patients/P102 without valid JWT scopes.'
  },
  {
    id: 'SEC-4003',
    user: 'Dr. Ravi Sharma',
    event: 'Successful Login',
    date: '2026-08-31',
    time: '10:30 AM',
    ipAddress: '192.168.1.45',
    status: 'Success',
    severity: 'Normal',
    category: 'Authentication',
    details: 'Multi-factor authenticated session initialized from trusted hospital IP.'
  },
  {
    id: 'SEC-4004',
    user: 'System Bot',
    event: 'Invalid Token Signature Detected',
    date: '2026-08-31',
    time: '11:15 AM',
    ipAddress: '45.33.21.90',
    status: 'Rejected',
    severity: 'Critical',
    category: 'JWT Validation',
    details: 'Forged JWT Bearer token presented with tampered HMAC-SHA256 signature.'
  },
  {
    id: 'SEC-4005',
    user: 'Ananya Gupta',
    event: 'Password Reset Request',
    date: '2026-08-31',
    time: '11:40 AM',
    ipAddress: '122.176.40.12',
    status: 'Sent',
    severity: 'Normal',
    category: 'Account Recovery',
    details: 'Reset token generated and transmitted via registered email link.'
  },
  {
    id: 'SEC-4006',
    user: 'Unknown User',
    event: 'Brute Force Rate Limit Triggered',
    date: '2026-08-31',
    time: '12:00 PM',
    ipAddress: '185.220.101.5',
    status: 'Rate Limited',
    severity: 'Critical',
    category: 'DDOS / Attack',
    details: 'Exceeded 50 HTTP POST requests/min to /api/v1/auth/login. IP temporarily blacklisted.'
  }
];

export const initialSecurityAlerts = [
  {
    id: 'ALT-501',
    title: 'Multiple failed login attempts detected.',
    description: 'Account "rahul@meditrack.org" triggered 3 failed password attempts within 2 minutes.',
    severity: 'Warning',
    timestamp: '10:20 AM Today',
    status: 'Active',
    ip: '157.48.201.99'
  },
  {
    id: 'ALT-502',
    title: 'Unauthorized access attempt blocked.',
    description: 'IP 185.220.101.5 attempted direct resource extraction on restricted endpoint /patients/P102.',
    severity: 'Critical',
    timestamp: '10:25 AM Today',
    status: 'Active',
    ip: '185.220.101.5'
  },
  {
    id: 'ALT-503',
    title: 'Invalid authentication token detected.',
    description: 'Tampered JWT Bearer header received from host node 45.33.21.90 during REST request.',
    severity: 'Critical',
    timestamp: '11:15 AM Today',
    status: 'Active',
    ip: '45.33.21.90'
  },
  {
    id: 'ALT-504',
    title: 'Patient attempted to access another patient\'s record.',
    description: 'User "Rahul Verma" (Role: PATIENT) attempted cross-tenant record navigation to Patient P102.',
    severity: 'Warning',
    timestamp: '12:25 PM Today',
    status: 'Active',
    ip: '157.48.201.99'
  }
];
