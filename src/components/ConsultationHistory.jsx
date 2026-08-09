import React, { useState, useMemo } from 'react';
import { History, Search, Inbox } from 'lucide-react';

const ConsultationHistory = ({ consultations }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConsultations = useMemo(() => {
    if (!searchTerm.trim()) return consultations;
    const q = searchTerm.toLowerCase().trim();
    return consultations.filter(
      (c) =>
        c.patientId.toLowerCase().includes(q) ||
        (c.patientName && c.patientName.toLowerCase().includes(q)) ||
        c.doctor.toLowerCase().includes(q) ||
        c.diagnosis.toLowerCase().includes(q) ||
        c.symptoms.toLowerCase().includes(q)
    );
  }, [consultations, searchTerm]);

  return (
    <div className="card">
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h3 className="card-title">
          <History className="card-title-icon" size={20} />
          Consultation History ({filteredConsultations.length})
        </h3>

        {/* Search Input Box */}
        <div className="search-input-wrapper" style={{ maxWidth: '320px' }}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by Patient ID, Name, Doctor, Diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card-body" style={{ padding: '0.75rem' }}>
        {filteredConsultations.length === 0 ? (
          <div className="empty-state">
            <Inbox className="empty-state-icon" size={48} />
            <p className="font-semibold text-lg text-slate-700">No consultation records found</p>
            <p className="text-sm text-slate-500 mt-1">
              Select a patient above to perform and save a new consultation.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="patient-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Attending Doctor</th>
                  <th>Symptoms</th>
                  <th>Diagnosis</th>
                  <th>Treatment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredConsultations.map((c) => (
                  <tr key={c.id || `${c.patientId}-${c.date}-${Math.random()}`}>
                    <td>
                      <span className="patient-id-tag">{c.patientId}</span>
                    </td>
                    <td style={{ fontWeight: '600' }}>{c.patientName || 'N/A'}</td>
                    <td style={{ fontWeight: '500', color: 'var(--primary-color)' }}>{c.doctor}</td>
                    <td style={{ maxWidth: '200px', fontSize: '0.85rem' }}>{c.symptoms}</td>
                    <td style={{ maxWidth: '200px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {c.diagnosis}
                    </td>
                    <td style={{ maxWidth: '220px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {c.treatment}
                    </td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      {c.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationHistory;
