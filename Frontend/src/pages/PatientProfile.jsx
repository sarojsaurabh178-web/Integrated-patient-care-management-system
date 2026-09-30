import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  Shield,
  Calendar,
  AlertCircle,
  Edit3,
  Save,
  X,
  CheckCircle2,
  Clock,
  Activity,
  FileText,
  Pill,
  ShieldAlert,
  ChevronRight,
  Download,
  Search,
  RefreshCw
} from 'lucide-react';
import patientService from '../services/patientService';

const PatientProfile = ({
  currentRole = 'PATIENT',
  patients = [],
  appointments = [],
  prescriptions = [],
  consultations = [],
  setActiveTab,
  setToast
}) => {
  // If role is PATIENT, always pin to their own profile (P101). Otherwise let Doctor/Admin select a patient.
  const defaultPatientId = currentRole === 'PATIENT' ? 'P101' : (patients[0]?.id || 'P101');
  const [selectedPatientId, setSelectedPatientId] = useState(defaultPatientId);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  // Sync selected patient on role change
  useEffect(() => {
    if (currentRole === 'PATIENT') {
      setSelectedPatientId('P101');
    }
  }, [currentRole]);

  // Fetch patient profile from backend
  const fetchPatientProfile = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await patientService.getPatientById(id);
      setPatientData(data);
      setEditForm({
        name: data.fullName || data.name,
        age: data.age,
        gender: data.gender,
        phone: data.phone,
        email: data.email || '',
        address: data.address || '',
        emergencyContact: data.emergencyContact || '',
        bloodGroup: data.bloodGroup || 'O+',
        allergies: data.allergies || '',
        currentMedications: data.currentMedications || '',
        insuranceProvider: data.insuranceProvider || '',
        insurancePolicyNumber: data.insurancePolicyNumber || '',
        medicalHistoryNotes: data.medicalHistoryNotes || ''
      });
    } catch (err) {
      console.error('Error fetching patient profile:', err);
      setError('Failed to load patient record from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPatientId) {
      fetchPatientProfile(selectedPatientId);
    }
  }, [selectedPatientId]);

  // Validation
  const validateForm = () => {
    const errors = {};
    if (!editForm.name || !editForm.name.trim()) errors.name = 'Patient name is required.';
    if (!editForm.phone || !editForm.phone.trim()) errors.phone = 'Phone number is required.';
    if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (editForm.age && (isNaN(editForm.age) || editForm.age < 0 || editForm.age > 130)) {
      errors.age = 'Valid age between 0 and 130 is required.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save updates to actual database
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        fullName: editForm.name,
        name: editForm.name,
        age: parseInt(editForm.age, 10),
        gender: editForm.gender,
        phone: editForm.phone,
        email: editForm.email,
        address: editForm.address,
        emergencyContact: editForm.emergencyContact,
        bloodGroup: editForm.bloodGroup,
        allergies: editForm.allergies,
        currentMedications: editForm.currentMedications,
        insuranceProvider: editForm.insuranceProvider,
        insurancePolicyNumber: editForm.insurancePolicyNumber,
        medicalHistoryNotes: editForm.medicalHistoryNotes
      };

      const updated = await patientService.updatePatient(selectedPatientId, payload);
      setPatientData(updated);
      setIsEditing(false);
      if (setToast) {
        setToast({
          type: 'success',
          message: `Patient profile for ${updated.name || updated.fullName} updated in database.`
        });
      }
    } catch (err) {
      console.error('Error updating patient profile:', err);
      alert('Failed to update patient profile. Please verify your inputs.');
    } finally {
      setSaving(false);
    }
  };

  // Associated Appointments for this patient
  const patientAppointments = appointments.filter(
    a => a.patientId === selectedPatientId || a.patientName === patientData?.name
  );

  // Associated Prescriptions for this patient
  const patientPrescriptions = prescriptions.filter(
    rx => rx.patientId === selectedPatientId || rx.patientName === patientData?.name
  );

  // Associated Consultations
  const patientConsultations = consultations.filter(
    c => c.patientId === selectedPatientId || c.patientName === patientData?.name
  );

  if (loading) {
    return (
      <div className="profile-loading-state">
        <RefreshCw size={36} className="spin-animation text-primary" />
        <p>Loading EHR patient profile from PostgreSQL database...</p>
      </div>
    );
  }

  if (error || !patientData) {
    return (
      <div className="profile-error-state">
        <AlertCircle size={36} className="text-danger" />
        <h3>Unable to Load Patient Record</h3>
        <p>{error || 'Patient not found in active database registry.'}</p>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => fetchPatientProfile(selectedPatientId)}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="patient-profile-page">
      {/* 1. Header with Patient Selector (if Doctor/Admin) & Actions */}
      <div className="profile-header-card">
        <div className="header-meta-row">
          <div className="patient-avatar-badge">
            <span className="avatar-initials">
              {patientData.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'PT'}
            </span>
          </div>

          <div className="patient-main-info">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h1 className="patient-name-title">{patientData.fullName || patientData.name}</h1>
              <span className="patient-id-badge">ID: {patientData.id}</span>
              <span className="blood-group-badge">🩸 {patientData.bloodGroup || 'O+'}</span>
              <span className="ehr-status-pill">Active EHR</span>
            </div>
            <p className="patient-submeta">
              <span>{patientData.age} Years Old</span> • <span>{patientData.gender}</span> • <span>Reg: {patientData.createdAt ? new Date(patientData.createdAt).toLocaleDateString() : '2026-09-01'}</span>
            </p>
          </div>

          {/* Role specific controls: Patient Selector for Doctor/Admin, Edit Button */}
          <div className="header-actions-group">
            {currentRole !== 'PATIENT' && (
              <div className="patient-selector-wrapper">
                <label htmlFor="select-patient-dropdown" className="selector-label">
                  <Search size={13} /> Switch Patient:
                </label>
                <select
                  id="select-patient-dropdown"
                  className="patient-select-control"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.id} - {p.name || p.fullName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!isEditing ? (
              <button
                type="button"
                className="btn-edit-profile"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 size={15} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn-cancel-edit"
                onClick={() => {
                  setIsEditing(false);
                  setValidationErrors({});
                }}
              >
                <X size={15} />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Inline Edit Form Modal / Block (When in Edit Mode) */}
      {isEditing && (
        <form className="edit-profile-card" onSubmit={handleSaveProfile}>
          <div className="edit-card-header">
            <h3><Edit3 size={17} /> Edit Patient Record</h3>
            <span className="note-text">Updates will be saved directly to the database.</span>
          </div>

          <div className="edit-form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
              {validationErrors.name && <div className="field-error">{validationErrors.name}</div>}
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="text"
                className={`form-control ${validationErrors.phone ? 'is-invalid' : ''}`}
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
              {validationErrors.phone && <div className="field-error">{validationErrors.phone}</div>}
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="patient@example.com"
              />
              {validationErrors.email && <div className="field-error">{validationErrors.email}</div>}
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                className={`form-control ${validationErrors.age ? 'is-invalid' : ''}`}
                value={editForm.age}
                onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
              />
              {validationErrors.age && <div className="field-error">{validationErrors.age}</div>}
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                className="form-control"
                value={editForm.gender}
                onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Blood Group</label>
              <select
                className="form-control"
                value={editForm.bloodGroup}
                onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Residential Address</label>
              <input
                type="text"
                className="form-control"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Emergency Contact Person & Phone</label>
              <input
                type="text"
                className="form-control"
                value={editForm.emergencyContact}
                onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })}
                placeholder="+91 98765 00000"
              />
            </div>

            <div className="form-group">
              <label>Allergies & Contraindications</label>
              <input
                type="text"
                className="form-control"
                value={editForm.allergies}
                onChange={(e) => setEditForm({ ...editForm, allergies: e.target.value })}
                placeholder="e.g. Penicillin, Sulfa drugs, Pollen"
              />
            </div>

            <div className="form-group full-width">
              <label>Current Medications</label>
              <input
                type="text"
                className="form-control"
                value={editForm.currentMedications}
                onChange={(e) => setEditForm({ ...editForm, currentMedications: e.target.value })}
                placeholder="e.g. Amlodipine 5mg (Daily), Aspirin 75mg"
              />
            </div>

            <div className="form-group">
              <label>Insurance Provider</label>
              <input
                type="text"
                className="form-control"
                value={editForm.insuranceProvider}
                onChange={(e) => setEditForm({ ...editForm, insuranceProvider: e.target.value })}
                placeholder="e.g. Star Health Comprehensive Care"
              />
            </div>

            <div className="form-group">
              <label>Insurance Policy / Member Number</label>
              <input
                type="text"
                className="form-control"
                value={editForm.insurancePolicyNumber}
                onChange={(e) => setEditForm({ ...editForm, insurancePolicyNumber: e.target.value })}
                placeholder="e.g. SH-98214309"
              />
            </div>

            <div className="form-group full-width">
              <label>Medical History & Clinical Notes</label>
              <textarea
                className="form-control"
                rows="3"
                value={editForm.medicalHistoryNotes}
                onChange={(e) => setEditForm({ ...editForm, medicalHistoryNotes: e.target.value })}
              />
            </div>
          </div>

          <div className="edit-form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? <RefreshCw size={15} className="spin-animation" /> : <Save size={15} />}
              <span>{saving ? 'Saving to Database...' : 'Save Patient Profile'}</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* 3. Main Profile Cards Grid */}
      <div className="profile-details-grid">
        {/* Left Column: Demographics, Contact, Insurance */}
        <div className="profile-column">
          {/* Contact & Demographics Card */}
          <div className="profile-card">
            <div className="card-header-styled">
              <User size={18} className="text-primary" />
              <h3>Contact &amp; Demographics</h3>
            </div>
            <div className="card-body-styled">
              <div className="info-row">
                <span className="info-label"><Phone size={14} /> Phone</span>
                <span className="info-value">{patientData.phone || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="info-label"><Mail size={14} /> Email</span>
                <span className="info-value">{patientData.email || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label"><MapPin size={14} /> Residential Address</span>
                <span className="info-value address">{patientData.address || 'N/A'}</span>
              </div>
              <div className="info-row highlight-emergency">
                <span className="info-label"><AlertCircle size={14} className="text-danger" /> Emergency Contact</span>
                <span className="info-value emergency">{patientData.emergencyContact || 'Not recorded'}</span>
              </div>
            </div>
          </div>

          {/* Insurance Details Card */}
          <div className="profile-card">
            <div className="card-header-styled">
              <Shield size={18} className="text-success" />
              <h3>Healthcare Insurance &amp; Policy</h3>
            </div>
            <div className="card-body-styled">
              <div className="info-row">
                <span className="info-label">Insurance Provider</span>
                <span className="info-value font-weight-bold">
                  {patientData.insuranceProvider || 'No Insurance Linked'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Policy / Member Number</span>
                <span className="info-value code-pill">
                  {patientData.insurancePolicyNumber || 'N/A'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Coverage Status</span>
                <span className="coverage-badge active">
                  <CheckCircle2 size={13} /> Active Verified Coverage
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clinical History, Allergies, Medications */}
        <div className="profile-column">
          {/* Clinical Alert & Allergies Card */}
          <div className="profile-card">
            <div className="card-header-styled">
              <ShieldAlert size={18} className="text-warning" />
              <h3>Allergies &amp; Clinical Warnings</h3>
            </div>
            <div className="card-body-styled">
              {patientData.allergies ? (
                <div className="allergies-tags-list">
                  {patientData.allergies.split(',').map((alg, idx) => (
                    <span key={idx} className="allergy-tag">
                      ⚠️ {alg.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="empty-subtext text-success">
                  <CheckCircle2 size={14} /> No known drug allergies or adverse reactions on file.
                </p>
              )}
            </div>
          </div>

          {/* Current Medications Card */}
          <div className="profile-card">
            <div className="card-header-styled">
              <Pill size={18} className="text-info" />
              <h3>Current Prescribed Medications</h3>
            </div>
            <div className="card-body-styled">
              {patientData.currentMedications ? (
                <div className="medications-block">
                  <p className="medications-text">{patientData.currentMedications}</p>
                </div>
              ) : (
                <p className="empty-subtext">No active long-term medications recorded.</p>
              )}
            </div>
          </div>

          {/* Medical History Notes Card */}
          <div className="profile-card">
            <div className="card-header-styled">
              <HeartPulse size={18} className="text-primary" />
              <h3>Medical History &amp; Chronic Notes</h3>
            </div>
            <div className="card-body-styled">
              <p className="medical-history-p">
                {patientData.medicalHistoryNotes || 'No chronic health conditions documented.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Patient Appointment & Clinical Encounter History */}
      <div className="profile-encounters-card">
        <div className="encounters-header">
          <div className="encounters-title">
            <Calendar size={18} className="text-primary" />
            <h3>Appointment &amp; Consultation History ({patientAppointments.length})</h3>
          </div>
          <button
            type="button"
            className="btn-book-more"
            onClick={() => setActiveTab('appointments')}
          >
            <span>Book / Manage Appointments</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {patientAppointments.length > 0 ? (
          <div className="encounters-table-responsive">
            <table className="table encounters-table">
              <thead>
                <tr>
                  <th>Appointment ID</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Date &amp; Time</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {patientAppointments.map((apt) => (
                  <tr key={apt.id}>
                    <td><strong>{apt.id}</strong></td>
                    <td>{apt.doctorName}</td>
                    <td><span className="badge-dept">{apt.department}</span></td>
                    <td>{apt.date} • {apt.time}</td>
                    <td>{apt.type}</td>
                    <td>
                      <span className={`status-pill ${apt.status.toLowerCase()}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="reason-cell">{apt.reason || 'Routine consultation'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-encounters-box">
            <Clock size={28} className="text-muted" />
            <p>No past appointments found for this patient.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;
