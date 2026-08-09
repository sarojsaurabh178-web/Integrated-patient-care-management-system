import React, { useState, useEffect } from 'react';
import { Stethoscope, CheckCircle2, AlertCircle } from 'lucide-react';

const doctorsList = [
  'Dr. Priya Sharma',
  'Dr. Amit Verma',
  'Dr. Neha Singh',
  'Dr. Ananya Roy',
  'Dr. Rajesh Kumar',
  'Dr. Vikram Malhotra'
];

const ConsultationForm = ({ selectedPatient, onSaveConsultation }) => {
  const [formData, setFormData] = useState({
    doctor: '',
    symptoms: '',
    diagnosis: '',
    treatment: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedPatient) {
      newErrors.patient = 'Please select a patient first.';
    }

    if (!formData.doctor) {
      newErrors.doctor = 'Please select attending doctor.';
    }

    if (!formData.symptoms.trim()) {
      newErrors.symptoms = 'Symptoms are required.';
    }

    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = 'Diagnosis is required.';
    }

    if (!formData.treatment.trim()) {
      newErrors.treatment = 'Recommended treatment is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSaveConsultation({
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        doctor: formData.doctor,
        symptoms: formData.symptoms.trim(),
        diagnosis: formData.diagnosis.trim(),
        treatment: formData.treatment.trim(),
        date: new Date().toISOString().split('T')[0]
      });

      // Reset form fields
      setFormData({
        doctor: '',
        symptoms: '',
        diagnosis: '',
        treatment: ''
      });
      setErrors({});
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <Stethoscope className="card-title-icon" size={20} />
          Patient Consultation Form
        </h3>
      </div>

      <div className="card-body">
        {errors.patient && (
          <div className="error-message" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
            <AlertCircle size={16} />
            <span>{errors.patient}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            {/* 1. Patient ID (Read-only) */}
            <div className="form-group">
              <label className="form-label" htmlFor="patientId">
                Patient ID
              </label>
              <input
                type="text"
                id="patientId"
                className="form-control"
                value={selectedPatient ? `${selectedPatient.id} (${selectedPatient.name})` : 'No patient selected'}
                readOnly
              />
            </div>

            {/* 2. Doctor Dropdown */}
            <div className="form-group">
              <label className="form-label" htmlFor="doctor">
                Attending Doctor <span className="required-star">*</span>
              </label>
              <select
                id="doctor"
                name="doctor"
                className={`form-control ${errors.doctor ? 'is-invalid' : ''}`}
                value={formData.doctor}
                onChange={handleChange}
              >
                <option value="">-- Select Doctor --</option>
                {doctorsList.map((doc) => (
                  <option key={doc} value={doc}>
                    {doc}
                  </option>
                ))}
              </select>
              {errors.doctor && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{errors.doctor}</span>
                </div>
              )}
            </div>

            {/* 3. Symptoms */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="symptoms">
                Symptoms <span className="required-star">*</span>
              </label>
              <textarea
                id="symptoms"
                name="symptoms"
                className={`form-control ${errors.symptoms ? 'is-invalid' : ''}`}
                placeholder="Enter patient's symptoms..."
                value={formData.symptoms}
                onChange={handleChange}
              ></textarea>
              {errors.symptoms && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{errors.symptoms}</span>
                </div>
              )}
            </div>

            {/* 4. Diagnosis */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="diagnosis">
                Diagnosis <span className="required-star">*</span>
              </label>
              <textarea
                id="diagnosis"
                name="diagnosis"
                className={`form-control ${errors.diagnosis ? 'is-invalid' : ''}`}
                placeholder="Enter diagnosis..."
                value={formData.diagnosis}
                onChange={handleChange}
              ></textarea>
              {errors.diagnosis && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{errors.diagnosis}</span>
                </div>
              )}
            </div>

            {/* 5. Treatment */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="treatment">
                Recommended Treatment <span className="required-star">*</span>
              </label>
              <textarea
                id="treatment"
                name="treatment"
                className={`form-control ${errors.treatment ? 'is-invalid' : ''}`}
                placeholder="Enter recommended treatment..."
                value={formData.treatment}
                onChange={handleChange}
              ></textarea>
              {errors.treatment && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{errors.treatment}</span>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={!selectedPatient}>
              <CheckCircle2 size={16} />
              Save Consultation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsultationForm;
