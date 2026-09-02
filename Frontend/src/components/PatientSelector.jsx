import React, { useState, useMemo } from 'react';
import { Search, UserCheck, AlertTriangle, UserX, CheckCircle } from 'lucide-react';

const PatientSelector = ({ patients, selectedPatient, onSelectPatient }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients;
    const q = searchQuery.toLowerCase().trim();
    return patients.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q)
    );
  }, [patients, searchQuery]);

  const isSearchActive = searchQuery.trim().length > 0;
  const isNotFound = isSearchActive && filteredPatients.length === 0;

  return (
    <div className="card" style={{ marginBottom: '1.75rem' }}>
      <div className="card-header">
        <h3 className="card-title">
          <UserCheck className="card-title-icon" size={20} />
          Select Patient for Consultation
        </h3>
        <span className="patient-count-badge">
          {patients.length} Registered Patients
        </span>
      </div>

      <div className="card-body">
        {/* Search Input Box */}
        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">Search Registered Patient</label>
          <div className="search-input-wrapper" style={{ maxWidth: '100%' }}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by Patient ID or patient name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Patient Not Found Warning Banner */}
        {isNotFound && (
          <div className="patient-not-found-alert">
            <UserX size={20} className="not-found-icon" />
            <div>
              <h4 className="not-found-title">Patient Not Found</h4>
              <p className="not-found-desc">
                No patient record matches "<strong>{searchQuery}</strong>". A patient must be registered in Module 1 before initiating consultation or issuing a prescription.
              </p>
            </div>
          </div>
        )}

        {/* Patient Quick Selector Cards Grid */}
        {!isNotFound && (
          <div className="patient-selector-grid">
            {filteredPatients.slice(0, 6).map((patient) => {
              const isSelected = selectedPatient && selectedPatient.id === patient.id;
              return (
                <div
                  key={patient.id}
                  className={`patient-select-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectPatient(patient)}
                >
                  <div className="select-card-header">
                    <span className="patient-id-tag">{patient.id}</span>
                    {isSelected && (
                      <span className="selected-indicator">
                        <CheckCircle size={14} /> Selected
                      </span>
                    )}
                  </div>
                  <h4 className="select-patient-name">{patient.name}</h4>
                  <div className="select-patient-meta">
                    <span>{patient.gender}, {patient.age} yrs</span>
                    <span>📞 {patient.phone}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientSelector;
