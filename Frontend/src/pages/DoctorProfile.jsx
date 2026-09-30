import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Phone,
  Mail,
  Award,
  Calendar,
  Clock,
  Activity,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Save,
  X,
  UserCheck,
  Building2,
  DollarSign,
  Briefcase,
  Search,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import doctorService from '../services/doctorService';

const DUTY_STATUS_OPTIONS = [
  { value: 'On Duty', label: '🟢 On Duty', color: 'success' },
  { value: 'In Consultation', label: '🟡 In Consultation', color: 'warning' },
  { value: 'Off Duty', label: '⚪ Off Duty', color: 'secondary' },
  { value: 'Emergency Call', label: '🔴 Emergency Call', color: 'danger' }
];

const DoctorProfile = ({
  currentRole = 'DOCTOR',
  appointments = [],
  setActiveTab,
  setToast
}) => {
  const [doctorsList, setDoctorsList] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('D-04'); // Dr. Sarah Jenkins default
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Fetch all doctors for switcher (or single doctor)
  const fetchDoctors = async () => {
    try {
      const list = await doctorService.getDoctors();
      setDoctorsList(list);
      // If current role is doctor, select D-04 or matching ID
      const initialId = (list.find(d => d.id === 'D-04') || list[0])?.id || 'D-04';
      setSelectedDoctorId(initialId);
    } catch (err) {
      console.error('Error fetching doctors list:', err);
    }
  };

  const fetchDoctorProfile = async (id) => {
    setLoading(true);
    try {
      const data = await doctorService.getDoctorById(id);
      setDoctorData(data);
      setEditForm({
        name: data.name,
        email: data.email || '',
        phone: data.phone || '',
        specialization: data.specialization || '',
        qualifications: data.qualifications || '',
        experienceYears: data.experienceYears || 5,
        department: data.department || '',
        consultationFee: data.consultationFee || '₹800',
        workingDays: data.workingDays || 'Monday - Friday',
        workingHours: data.workingHours || '09:00 AM - 04:00 PM',
        dutyStatus: data.dutyStatus || 'On Duty',
        bio: data.bio || ''
      });
    } catch (err) {
      console.error('Error fetching doctor details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctorId) {
      fetchDoctorProfile(selectedDoctorId);
    }
  }, [selectedDoctorId]);

  // Quick Duty Status change (one click for Doctor / Admin)
  const handleQuickDutyChange = async (newStatus) => {
    if (!doctorData) return;
    try {
      const res = await doctorService.updateDoctor(doctorData.id, { dutyStatus: newStatus });
      setDoctorData(prev => ({ ...prev, dutyStatus: newStatus }));
      setEditForm(prev => ({ ...prev, dutyStatus: newStatus }));
      if (setToast) {
        setToast({
          type: 'success',
          message: `Duty status updated to "${newStatus}".`
        });
      }
    } catch (err) {
      console.error('Error updating duty status:', err);
    }
  };

  // Save Full Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        specialization: editForm.specialization,
        qualifications: editForm.qualifications,
        experienceYears: parseInt(editForm.experienceYears, 10),
        department: editForm.department,
        consultationFee: editForm.consultationFee,
        workingDays: editForm.workingDays,
        workingHours: editForm.workingHours,
        dutyStatus: editForm.dutyStatus,
        bio: editForm.bio
      };

      const res = await doctorService.updateDoctor(doctorData.id, payload);
      if (res?.doctor) {
        setDoctorData(res.doctor);
      } else {
        setDoctorData(prev => ({ ...prev, ...payload }));
      }
      setIsEditing(false);
      if (setToast) {
        setToast({
          type: 'success',
          message: `Doctor profile for ${editForm.name} saved successfully.`
        });
      }
    } catch (err) {
      console.error('Error saving doctor profile:', err);
      alert('Failed to save doctor profile changes.');
    } finally {
      setSaving(false);
    }
  };

  // Assigned appointments from live system
  const assignedAppointments = doctorData?.assignedAppointments || appointments.filter(
    a => a.doctorId === doctorData?.id || (a.doctorName && a.doctorName.includes(doctorData?.name))
  );

  if (loading) {
    return (
      <div className="profile-loading-state">
        <RefreshCw size={36} className="spin-animation text-primary" />
        <p>Loading Doctor profile and clinical availability...</p>
      </div>
    );
  }

  if (!doctorData) {
    return (
      <div className="profile-error-state">
        <AlertCircle size={36} className="text-danger" />
        <h3>Doctor Profile Not Found</h3>
        <button type="button" className="btn btn-primary" onClick={fetchDoctors}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="doctor-profile-page">
      {/* 1. Header Card with Duty Status & Actions */}
      <div className="profile-header-card doctor-header">
        <div className="header-meta-row">
          <div className="doctor-avatar-box">
            <span className="avatar-initials">
              {doctorData.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </span>
          </div>

          <div className="patient-main-info">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h1 className="patient-name-title">{doctorData.name}</h1>
              <span className="doctor-id-badge">ID: {doctorData.id}</span>
              <span className="badge-dept">{doctorData.department}</span>
              <span className={`duty-pill ${doctorData.dutyStatus.toLowerCase().replace(' ', '-')}`}>
                <span className="duty-dot" />
                {doctorData.dutyStatus}
              </span>
            </div>
            <p className="patient-submeta">
              <span>{doctorData.specialization}</span> • <span>{doctorData.qualifications}</span> • <span>{doctorData.experienceYears} Years Experience</span>
            </p>
          </div>

          {/* Controls: Switch doctor (Admin) & Edit */}
          <div className="header-actions-group">
            {currentRole === 'ADMINISTRATOR' && doctorsList.length > 1 && (
              <div className="patient-selector-wrapper">
                <label htmlFor="doctor-select-dropdown" className="selector-label">
                  <Search size={13} /> Select Doctor:
                </label>
                <select
                  id="doctor-select-dropdown"
                  className="patient-select-control"
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                >
                  {doctorsList.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.id} - {d.name} ({d.department})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(currentRole === 'DOCTOR' || currentRole === 'ADMINISTRATOR') && (
              !isEditing ? (
                <button
                  type="button"
                  className="btn-edit-profile"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 size={15} />
                  <span>Edit Schedule &amp; Bio</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-cancel-edit"
                  onClick={() => setIsEditing(false)}
                >
                  <X size={15} />
                  <span>Cancel</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Quick Duty Status Switcher Bar (Doctor / Admin) */}
        {(currentRole === 'DOCTOR' || currentRole === 'ADMINISTRATOR') && (
          <div className="quick-duty-bar">
            <span className="quick-duty-label">Quick Update Duty Status:</span>
            <div className="duty-options-pills">
              {DUTY_STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`duty-option-btn ${doctorData.dutyStatus === opt.value ? 'active' : ''}`}
                  onClick={() => handleQuickDutyChange(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Edit Profile Form (When Active) */}
      {isEditing && (
        <form className="edit-profile-card" onSubmit={handleSaveProfile}>
          <div className="edit-card-header">
            <h3><Edit3 size={17} /> Edit Doctor Credentials &amp; Schedule</h3>
            <span className="note-text">Updates will be saved directly to the database.</span>
          </div>

          <div className="edit-form-grid">
            <div className="form-group">
              <label>Doctor Name *</label>
              <input
                type="text"
                className="form-control"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Phone Contact</label>
              <input
                type="text"
                className="form-control"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Official Email</label>
              <input
                type="email"
                className="form-control"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                className="form-control"
                value={editForm.department}
                onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Specialization Details</label>
              <input
                type="text"
                className="form-control"
                value={editForm.specialization}
                onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Qualifications</label>
              <input
                type="text"
                className="form-control"
                value={editForm.qualifications}
                onChange={(e) => setEditForm({ ...editForm, qualifications: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Experience (Years)</label>
              <input
                type="number"
                className="form-control"
                value={editForm.experienceYears}
                onChange={(e) => setEditForm({ ...editForm, experienceYears: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Consultation Fee</label>
              <input
                type="text"
                className="form-control"
                value={editForm.consultationFee}
                onChange={(e) => setEditForm({ ...editForm, consultationFee: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Working Days</label>
              <input
                type="text"
                className="form-control"
                value={editForm.workingDays}
                onChange={(e) => setEditForm({ ...editForm, workingDays: e.target.value })}
                placeholder="e.g. Monday - Friday"
              />
            </div>

            <div className="form-group">
              <label>Working Hours</label>
              <input
                type="text"
                className="form-control"
                value={editForm.workingHours}
                onChange={(e) => setEditForm({ ...editForm, workingHours: e.target.value })}
                placeholder="e.g. 09:00 AM - 04:00 PM"
              />
            </div>

            <div className="form-group full-width">
              <label>Professional Biography</label>
              <textarea
                className="form-control"
                rows="3"
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
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
              <span>{saving ? 'Updating...' : 'Save Changes'}</span>
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

      {/* 3. Details Cards Grid */}
      <div className="profile-details-grid">
        {/* Left Column: Schedule, Availability, Fee */}
        <div className="profile-column">
          <div className="profile-card">
            <div className="card-header-styled">
              <Calendar size={18} className="text-primary" />
              <h3>Consultation Availability &amp; Hours</h3>
            </div>
            <div className="card-body-styled">
              <div className="info-row">
                <span className="info-label"><Calendar size={14} /> Working Days</span>
                <span className="info-value font-weight-bold">{doctorData.workingDays}</span>
              </div>
              <div className="info-row">
                <span className="info-label"><Clock size={14} /> Working Hours</span>
                <span className="info-value font-weight-bold">{doctorData.workingHours}</span>
              </div>
              <div className="info-row">
                <span className="info-label"><DollarSign size={14} /> Consultation Fee</span>
                <span className="info-value text-success font-weight-bold">{doctorData.consultationFee}</span>
              </div>
              <div className="info-row">
                <span className="info-label"><Activity size={14} /> Current Duty</span>
                <span className="info-value">
                  <span className={`duty-pill-inline ${doctorData.dutyStatus.toLowerCase().replace(' ', '-')}`}>
                    {doctorData.dutyStatus}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="profile-card">
            <div className="card-header-styled">
              <Phone size={18} className="text-success" />
              <h3>Hospital Desk &amp; Contact</h3>
            </div>
            <div className="card-body-styled">
              <div className="info-row">
                <span className="info-label"><Phone size={14} /> Contact Phone</span>
                <span className="info-value">{doctorData.phone || '+91 11 4123 9000 (Ext 401)'}</span>
              </div>
              <div className="info-row">
                <span className="info-label"><Mail size={14} /> Hospital Email</span>
                <span className="info-value">{doctorData.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label"><Building2 size={14} /> Department</span>
                <span className="info-value">{doctorData.department} Wing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Qualifications, Experience, Bio */}
        <div className="profile-column">
          <div className="profile-card">
            <div className="card-header-styled">
              <Award size={18} className="text-warning" />
              <h3>Credentials &amp; Qualifications</h3>
            </div>
            <div className="card-body-styled">
              <div className="info-row">
                <span className="info-label">Academic Degrees</span>
                <span className="info-value font-weight-bold">{doctorData.qualifications}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Clinical Experience</span>
                <span className="info-value">{doctorData.experienceYears} Years Clinical Practice</span>
              </div>
              <div className="info-row">
                <span className="info-label">Specialization</span>
                <span className="info-value">{doctorData.specialization}</span>
              </div>
            </div>
          </div>

          {/* Professional Biography */}
          <div className="profile-card">
            <div className="card-header-styled">
              <Briefcase size={18} className="text-info" />
              <h3>Professional Profile &amp; Clinical Focus</h3>
            </div>
            <div className="card-body-styled">
              <p className="medical-history-p">
                {doctorData.bio || 'Senior medical consultant specializing in advanced patient care and clinical evaluations.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Assigned Appointments Schedule */}
      <div className="profile-encounters-card">
        <div className="encounters-header">
          <div className="encounters-title">
            <Calendar size={18} className="text-primary" />
            <h3>Assigned Appointments Queue ({assignedAppointments.length})</h3>
          </div>
          <button
            type="button"
            className="btn-book-more"
            onClick={() => setActiveTab('appointments')}
          >
            <span>Open Appointments Desk</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {assignedAppointments.length > 0 ? (
          <div className="encounters-table-responsive">
            <table className="table encounters-table">
              <thead>
                <tr>
                  <th>Appointment ID</th>
                  <th>Patient Name</th>
                  <th>Date &amp; Time</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Clinical Reason</th>
                </tr>
              </thead>
              <tbody>
                {assignedAppointments.map((apt) => (
                  <tr key={apt.id}>
                    <td><strong>{apt.id}</strong></td>
                    <td>{apt.patientName}</td>
                    <td>{apt.date} • {apt.time}</td>
                    <td>{apt.type}</td>
                    <td>
                      <span className={`status-pill ${apt.status.toLowerCase()}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="reason-cell">{apt.reason || 'General Consultation'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-encounters-box">
            <Clock size={28} className="text-muted" />
            <p>No appointments currently assigned to this doctor.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;
