import React from 'react';
import { UserCheck, X, Phone, Mail, MapPin } from 'lucide-react';

const PatientSummary = ({ selectedPatient, onClearSelection }) => {
  if (!selectedPatient) return null;

  return (
    <div className="card selected-patient-summary-card">
      <div className="summary-header">
        <div className="summary-title-wrapper">
          <span className="selected-patient-badge">
            <UserCheck size={15} /> Selected Patient
          </span>
          <h3 className="summary-patient-name">{selectedPatient.name}</h3>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-icon"
          onClick={onClearSelection}
          title="Change Selected Patient"
        >
          <X size={14} /> Change Patient
        </button>
      </div>

      <div className="summary-body">
        <div className="summary-meta-grid">
          <div className="meta-item">
            <span className="meta-label">Patient ID</span>
            <span className="patient-id-tag">{selectedPatient.id}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Age & Gender</span>
            <span className="meta-val">{selectedPatient.age} Yrs • {selectedPatient.gender}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Phone Number</span>
            <span className="meta-val">📞 {selectedPatient.phone}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Email Address</span>
            <span className="meta-val">{selectedPatient.email || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSummary;
