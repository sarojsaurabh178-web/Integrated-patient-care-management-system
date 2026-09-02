import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Stethoscope, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { doctors } from '../data/mockAppointments';

const AppointmentModal = ({ 
  isOpen, 
  mode, 
  appointment, 
  nextAppointmentId, 
  patients, 
  onClose, 
  onSave 
}) => {
  if (!isOpen) return null;

  const defaultState = {
    id: nextAppointmentId,
    patientId: patients.length > 0 ? patients[0].id : '',
    patientName: patients.length > 0 ? patients[0].name : '',
    doctorId: doctors[0].id,
    doctorName: doctors[0].name,
    department: doctors[0].department,
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    type: 'General Checkup',
    status: 'Scheduled',
    reason: ''
  };

  const [formData, setFormData] = useState(defaultState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && appointment) {
      setFormData({ ...appointment });
    } else {
      setFormData({
        ...defaultState,
        id: nextAppointmentId
      });
    }
    setErrors({});
  }, [mode, appointment, nextAppointmentId, isOpen]);

  const handlePatientChange = (e) => {
    const selectedPatientId = e.target.value;
    const foundPatient = patients.find((p) => p.id === selectedPatientId);
    setFormData((prev) => ({
      ...prev,
      patientId: selectedPatientId,
      patientName: foundPatient ? foundPatient.name : ''
    }));
    if (errors.patientId) setErrors((prev) => ({ ...prev, patientId: '' }));
  };

  const handleDoctorChange = (e) => {
    const selectedDoctorId = e.target.value;
    const foundDoctor = doctors.find((d) => d.id === selectedDoctorId);
    setFormData((prev) => ({
      ...prev,
      doctorId: selectedDoctorId,
      doctorName: foundDoctor ? foundDoctor.name : '',
      department: foundDoctor ? foundDoctor.department : ''
    }));
    if (errors.doctorId) setErrors((prev) => ({ ...prev, doctorId: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patientId) newErrors.patientId = 'Please select a patient.';
    if (!formData.doctorId) newErrors.doctorId = 'Please select a doctor.';
    if (!formData.date) newErrors.date = 'Appointment date is required.';
    if (!formData.time) newErrors.time = 'Time slot is required.';
    if (!formData.reason.trim()) newErrors.reason = 'Please enter reason for visit.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Calendar className="card-title-icon" size={20} />
            <span>{mode === 'edit' ? `Edit Appointment (${formData.id})` : `Schedule New Appointment (${formData.id})`}</span>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              {/* Appointment ID */}
              <div className="form-group">
                <label className="form-label">Appointment ID</label>
                <input type="text" className="form-control" value={formData.id} readOnly />
              </div>

              {/* Select Patient */}
              <div className="form-group">
                <label className="form-label">Select Patient <span className="required-star">*</span></label>
                <select
                  name="patientId"
                  className={`form-control ${errors.patientId ? 'is-invalid' : ''}`}
                  value={formData.patientId}
                  onChange={handlePatientChange}
                >
                  <option value="">-- Choose Registered Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} - {p.name} ({p.gender}, {p.age} yrs)
                    </option>
                  ))}
                </select>
                {errors.patientId && <div className="error-message"><AlertCircle size={14} />{errors.patientId}</div>}
              </div>

              {/* Select Doctor */}
              <div className="form-group">
                <label className="form-label">Select Medical Specialist <span className="required-star">*</span></label>
                <select
                  name="doctorId"
                  className={`form-control ${errors.doctorId ? 'is-invalid' : ''}`}
                  value={formData.doctorId}
                  onChange={handleDoctorChange}
                >
                  <option value="">-- Select Specialist --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.department} - {d.room})
                    </option>
                  ))}
                </select>
                {errors.doctorId && <div className="error-message"><AlertCircle size={14} />{errors.doctorId}</div>}
              </div>

              {/* Department */}
              <div className="form-group">
                <label className="form-label">Department</label>
                <input type="text" className="form-control" value={formData.department} readOnly />
              </div>

              {/* Appointment Date */}
              <div className="form-group">
                <label className="form-label">Date <span className="required-star">*</span></label>
                <input
                  type="date"
                  name="date"
                  className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                  value={formData.date}
                  onChange={handleChange}
                />
                {errors.date && <div className="error-message"><AlertCircle size={14} />{errors.date}</div>}
              </div>

              {/* Time Slot */}
              <div className="form-group">
                <label className="form-label">Time Slot <span className="required-star">*</span></label>
                <select
                  name="time"
                  className={`form-control ${errors.time ? 'is-invalid' : ''}`}
                  value={formData.time}
                  onChange={handleChange}
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:15 AM">11:15 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
                {errors.time && <div className="error-message"><AlertCircle size={14} />{errors.time}</div>}
              </div>

              {/* Appointment Type */}
              <div className="form-group">
                <label className="form-label">Appointment Type</label>
                <select
                  name="type"
                  className="form-control"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="General Checkup">General Checkup</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              {/* Status */}
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Reason / Symptoms */}
              <div className="form-group full-width">
                <label className="form-label">Reason for Visit / Symptoms <span className="required-star">*</span></label>
                <textarea
                  name="reason"
                  className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
                  placeholder="Enter patient symptoms or primary reason for appointment..."
                  value={formData.reason}
                  onChange={handleChange}
                ></textarea>
                {errors.reason && <div className="error-message"><AlertCircle size={14} />{errors.reason}</div>}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} />
              {mode === 'edit' ? 'Update Appointment' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
