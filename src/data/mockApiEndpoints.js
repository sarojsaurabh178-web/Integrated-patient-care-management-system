export const apiEndpoints = [
  {
    id: 'API-101',
    endpoint: '/patients',
    method: 'GET',
    category: 'Patients Management',
    purpose: 'Retrieve list of registered hospital patients with optional pagination and filter parameters.',
    requestHeader: 'Authorization: Bearer <jwt_token>\nAccept: application/json',
    requestBody: null,
    responseCode: 200,
    statusText: '200 OK',
    responseBody: JSON.stringify([
      { id: 'P101', name: 'Rahul Verma', age: 34, gender: 'Male', phone: '+91 98765 43210', bloodGroup: 'O+' },
      { id: 'P102', name: 'Priya Patel', age: 28, gender: 'Female', phone: '+91 98123 45678', bloodGroup: 'A+' }
    ], null, 2)
  },
  {
    id: 'API-102',
    endpoint: '/patients',
    method: 'POST',
    category: 'Patients Management',
    purpose: 'Register a new patient into the MediTrack care management database.',
    requestHeader: 'Authorization: Bearer <jwt_token>\nContent-Type: application/json',
    requestBody: JSON.stringify({
      fullName: 'Vikram Singh',
      age: 45,
      gender: 'Male',
      phone: '+91 99000 11223',
      address: '45 MG Road, Bengaluru',
      emergencyContact: '+91 99000 11224'
    }, null, 2),
    responseCode: 201,
    statusText: '201 Created',
    responseBody: JSON.stringify({
      status: 'success',
      message: 'Patient registered successfully.',
      data: { id: 'P103', fullName: 'Vikram Singh', createdAt: '2026-08-31T10:15:00Z' }
    }, null, 2)
  },
  {
    id: 'API-103',
    endpoint: '/patients/P101',
    method: 'PUT',
    category: 'Patients Management',
    purpose: 'Update demographic, contact, or insurance details of an existing patient.',
    requestHeader: 'Authorization: Bearer <jwt_token>\nContent-Type: application/json',
    requestBody: JSON.stringify({
      phone: '+91 98765 99999',
      address: 'Suite 404, Green Heights, Delhi',
      medicalHistoryNotes: 'Added allergy note for Penicillin.'
    }, null, 2),
    responseCode: 200,
    statusText: '200 OK',
    responseBody: JSON.stringify({
      status: 'success',
      message: 'Patient P101 records updated successfully.',
      updatedFields: ['phone', 'address', 'medicalHistoryNotes']
    }, null, 2)
  },
  {
    id: 'API-104',
    endpoint: '/patients/P101',
    method: 'DELETE',
    category: 'Patients Management',
    purpose: 'Soft-delete or archive a patient record (Administrator authorization required).',
    requestHeader: 'Authorization: Bearer <admin_jwt_token>',
    requestBody: null,
    responseCode: 200,
    statusText: '200 OK',
    responseBody: JSON.stringify({
      status: 'success',
      message: 'Patient record P101 archived successfully.'
    }, null, 2)
  },
  {
    id: 'API-105',
    endpoint: '/appointments',
    method: 'GET',
    category: 'Appointments Scheduling',
    purpose: 'Fetch scheduled, completed, or cancelled consultation appointments.',
    requestHeader: 'Authorization: Bearer <jwt_token>',
    requestBody: null,
    responseCode: 200,
    statusText: '200 OK',
    responseBody: JSON.stringify([
      { id: 'A101', patientId: 'P101', doctorId: 'D-01', doctorName: 'Dr. Ravi Sharma', date: '2026-09-01', time: '10:00 AM', status: 'Scheduled' }
    ], null, 2)
  },
  {
    id: 'API-106',
    endpoint: '/appointments',
    method: 'POST',
    category: 'Appointments Scheduling',
    purpose: 'Book a new OPD or specialist consultation appointment.',
    requestHeader: 'Authorization: Bearer <jwt_token>\nContent-Type: application/json',
    requestBody: JSON.stringify({
      patientId: 'P101',
      doctorId: 'D-01',
      department: 'Cardiology',
      date: '2026-09-01',
      time: '10:00 AM',
      type: 'Follow-Up'
    }, null, 2),
    responseCode: 201,
    statusText: '201 Created',
    responseBody: JSON.stringify({
      status: 'success',
      appointmentId: 'A101',
      message: 'Appointment scheduled with Dr. Ravi Sharma.'
    }, null, 2)
  },
  {
    id: 'API-107',
    endpoint: '/consultations',
    method: 'POST',
    category: 'Clinical OPD',
    purpose: 'Record clinical consultation summary, symptoms, diagnosis, and vitals.',
    requestHeader: 'Authorization: Bearer <doctor_jwt_token>\nContent-Type: application/json',
    requestBody: JSON.stringify({
      patientId: 'P101',
      symptoms: 'Mild chest tightness, blood pressure 140/90 mmHg',
      diagnosis: 'Primary Hypertension Stage I',
      clinicalNotes: 'Advised reduced salt intake and regular BP monitoring.'
    }, null, 2),
    responseCode: 201,
    statusText: '201 Created',
    responseBody: JSON.stringify({
      status: 'success',
      consultationId: 'C-501',
      message: 'Consultation notes successfully saved to EHR.'
    }, null, 2)
  },
  {
    id: 'API-108',
    endpoint: '/prescriptions',
    method: 'POST',
    category: 'Pharmacy & Prescriptions',
    purpose: 'Generate an electronic prescription (e-Rx) with prescribed medications and dosage.',
    requestHeader: 'Authorization: Bearer <doctor_jwt_token>\nContent-Type: application/json',
    requestBody: JSON.stringify({
      patientId: 'P101',
      medicines: [
        { name: 'Amlodipine 5mg', dosage: '1 tablet daily morning', duration: '30 Days' },
        { name: 'Aspirin 75mg', dosage: '1 tablet after dinner', duration: '30 Days' }
      ],
      instructions: 'Take after meals. Drink plenty of water.'
    }, null, 2),
    responseCode: 201,
    statusText: '201 Created',
    responseBody: JSON.stringify({
      status: 'success',
      prescriptionId: 'RX-201',
      message: 'Prescription generated and queued for pharmacy download.'
    }, null, 2)
  }
];
