import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, MapPin, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

const PatientModal = ({ isOpen, mode, patient, onClose, onSave }) => {
  if (!isOpen || !patient) return null;

  const [editForm, setEditForm] = useState({ ...patient });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setEditForm({ ...patient });
    setErrors({});
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateEditForm = () => {
    const newErrors = {};

    if (!editForm.name.trim()) newErrors.name = 'Full name is required.';
    if (!editForm.age && editForm.age !== 0) newErrors.age = 'Age is required.';
    else {
      const ageNum = Number(editForm.age);
      if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) newErrors.age = 'Age must be 1-120.';
    }

    if (!editForm.gender) newErrors.gender = 'Gender is required.';
    if (!editForm.dob) newErrors.dob = 'Date of birth is required.';

    if (!editForm.phone.trim()) newErrors.phone = 'Phone number is required.';
    else if (!/^[6-9]\d{9}$/.test(editForm.phone.trim())) {
      newErrors.phone = 'Invalid 10-digit mobile number.';
    }

    if (!editForm.email.trim()) newErrors.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email.trim())) {
      newErrors.email = 'Invalid email address format.';
    }

    if (!editForm.address.trim()) newErrors.address = 'Address is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (validateEditForm()) {
      onSave({
        ...editForm,
        age: parseInt(editForm.age, 10)
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <span className="patient-id-tag">{patient.id}</span>
            <span>{mode === 'view' ? 'Patient Medical Record' : 'Edit Patient Record'}</span>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {mode === 'view' ? (
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Full Name</span>
                <span className="detail-value" style={{ fontWeight: 600 }}>{patient.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Age & Gender</span>
                <span className="detail-value">{patient.age} yrs • {patient.gender}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date of Birth</span>
                <span className="detail-value">{patient.dob}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Registration Date</span>
                <span className="detail-value">{patient.registeredAt || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone Number</span>
                <span className="detail-value">{patient.phone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email Address</span>
                <span className="detail-value">{patient.email}</span>
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">Residential Address</span>
                <span className="detail-value">{patient.address}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Patient ID</label>
                  <input type="text" className="form-control" value={editForm.id} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={editForm.name}
                    onChange={handleChange}
                  />
                  {errors.name && <div className="error-message"><AlertCircle size={14} />{errors.name}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Age *</label>
                  <input
                    type="number"
                    name="age"
                    className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                    value={editForm.age}
                    onChange={handleChange}
                  />
                  {errors.age && <div className="error-message"><AlertCircle size={14} />{errors.age}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Gender *</label>
                  <select
                    name="gender"
                    className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                    value={editForm.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <div className="error-message"><AlertCircle size={14} />{errors.gender}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth *</label>
                  <input
                    type="date"
                    name="dob"
                    className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
                    value={editForm.dob}
                    onChange={handleChange}
                  />
                  {errors.dob && <div className="error-message"><AlertCircle size={14} />{errors.dob}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    maxLength="10"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    value={editForm.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && <div className="error-message"><AlertCircle size={14} />{errors.phone}</div>}
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={editForm.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="error-message"><AlertCircle size={14} />{errors.email}</div>}
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Residential Address *</label>
                  <textarea
                    name="address"
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    value={editForm.address}
                    onChange={handleChange}
                  ></textarea>
                  {errors.address && <div className="error-message"><AlertCircle size={14} />{errors.address}</div>}
                </div>
              </div>
              <div className="modal-footer" style={{ padding: '1rem 0 0 0', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} /> Save Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {mode === 'view' && (
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientModal;
