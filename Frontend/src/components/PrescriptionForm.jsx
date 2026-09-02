import React, { useState } from 'react';
import { Pill, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

const doctorsList = [
  'Dr. Priya Sharma',
  'Dr. Amit Verma',
  'Dr. Neha Singh',
  'Dr. Ananya Roy',
  'Dr. Rajesh Kumar',
  'Dr. Vikram Malhotra'
];

const PrescriptionForm = ({ selectedPatient, onGeneratePrescription }) => {
  const [formData, setFormData] = useState({
    doctor: doctorsList[0],
    medicine: '',
    dosage: '',
    duration: '',
    notes: ''
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
      newErrors.doctor = 'Please select doctor.';
    }

    if (!formData.medicine.trim()) {
      newErrors.medicine = 'Medicine name is required.';
    }

    if (!formData.dosage.trim()) {
      newErrors.dosage = 'Dosage is required (e.g. 500 mg).';
    }

    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required (e.g. 5 days).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onGeneratePrescription({
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        doctor: formData.doctor,
        medicine: formData.medicine.trim(),
        dosage: formData.dosage.trim(),
        duration: formData.duration.trim(),
        notes: formData.notes.trim(),
        date: new Date().toISOString().split('T')[0]
      });

      // Clear input fields
      setFormData((prev) => ({
        ...prev,
        medicine: '',
        dosage: '',
        duration: '',
        notes: ''
      }));
      setErrors({});
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <Pill className="card-title-icon" size={20} />
          Generate Patient Prescription
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
              <label className="form-label" htmlFor="rxPatientId">
                Patient ID
              </label>
              <input
                type="text"
                id="rxPatientId"
                className="form-control"
                value={selectedPatient ? `${selectedPatient.id} (${selectedPatient.name})` : 'No patient selected'}
                readOnly
              />
            </div>

            {/* 2. Doctor */}
            <div className="form-group">
              <label className="form-label" htmlFor="rxDoctor">
                Prescribing Doctor <span className="required-star">*</span>
              </label>
              <select
                id="rxDoctor"
                name="doctor"
                className={`form-control ${errors.doctor ? 'is-invalid' : ''}`}
                value={formData.doctor}
                onChange={handleChange}
              >
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

            {/* 3. Medicine Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="medicine">
                Medicine Name <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="medicine"
                name="medicine"
                className={`form-control ${errors.medicine ? 'is-invalid' : ''}`}
                placeholder="Enter medicine name (e.g. Paracetamol 500mg)"
                value={formData.medicine}
                onChange={handleChange}
              />
              {errors.medicine && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{errors.medicine}</span>
                </div>
              )}
            </div>

            {/* 4. Dosage */}
            <div className="form-group">
              <label className="form-label" htmlFor="dosage">
                Dosage <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="dosage"
                name="dosage"
                className={`form-control ${errors.dosage ? 'is-invalid' : ''}`}
                placeholder="Example: 500 mg / 1 tablet twice daily"
                value={formData.dosage}
                onChange={handleChange}
              />
              {errors.dosage && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{errors.dosage}</span>
                </div>
              )}
            </div>

            {/* 5. Duration */}
            <div className="form-group">
              <label className="form-label" htmlFor="duration">
                Duration <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
                placeholder="Example: 5 days"
                value={formData.duration}
                onChange={handleChange}
              />
              {errors.duration && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{errors.duration}</span>
                </div>
              )}
            </div>

            {/* 6. Special Advice / Notes */}
            <div className="form-group">
              <label className="form-label" htmlFor="notes">
                Diet / Special Instructions
              </label>
              <input
                type="text"
                id="notes"
                name="notes"
                className="form-control"
                placeholder="Example: Take after food with warm water"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={!selectedPatient}>
              <CheckCircle2 size={16} />
              Generate Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionForm;
