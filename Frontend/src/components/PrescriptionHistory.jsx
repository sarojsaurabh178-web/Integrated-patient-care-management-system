import React, { useState } from 'react';
import { Pill, Eye, Printer, Inbox } from 'lucide-react';
import PrescriptionPrintModal from './PrescriptionPrintModal';

const PrescriptionHistory = ({ prescriptions, patients }) => {
  const [activeRxModal, setActiveRxModal] = useState({ isOpen: false, prescription: null });

  const handleOpenPrintModal = (rx) => {
    setActiveRxModal({ isOpen: true, prescription: rx });
  };

  const getPatientObj = (patientId) => {
    return patients.find((p) => p.id === patientId);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <Pill className="card-title-icon" size={20} />
          Prescription History ({prescriptions.length})
        </h3>
      </div>

      <div className="card-body" style={{ padding: '0.75rem' }}>
        {prescriptions.length === 0 ? (
          <div className="empty-state">
            <Inbox className="empty-state-icon" size={48} />
            <p className="font-semibold text-lg text-slate-700">No prescription records found</p>
            <p className="text-sm text-slate-500 mt-1">
              Select a patient above to generate and issue a prescription.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="patient-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Prescribing Doctor</th>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Duration</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((rx) => (
                  <tr key={rx.id || `${rx.patientId}-${rx.date}-${Math.random()}`}>
                    <td>
                      <span className="patient-id-tag">{rx.patientId}</span>
                    </td>
                    <td style={{ fontWeight: '600' }}>{rx.patientName || 'N/A'}</td>
                    <td style={{ fontWeight: '500', color: 'var(--primary-color)' }}>{rx.doctor}</td>
                    <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{rx.medicine}</td>
                    <td>{rx.dosage}</td>
                    <td>
                      <span className="apt-type-badge">{rx.duration}</span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      {rx.date}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="btn btn-icon btn-view"
                          onClick={() => handleOpenPrintModal(rx)}
                          title="View Prescription"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        <button
                          type="button"
                          className="btn btn-icon btn-primary"
                          onClick={() => handleOpenPrintModal(rx)}
                          title="Print Prescription"
                        >
                          <Printer size={14} />
                          Print
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Prescription Pad Print Modal */}
      <PrescriptionPrintModal
        isOpen={activeRxModal.isOpen}
        prescription={activeRxModal.prescription}
        patient={activeRxModal.prescription ? getPatientObj(activeRxModal.prescription.patientId) : null}
        onClose={() => setActiveRxModal({ isOpen: false, prescription: null })}
      />
    </div>
  );
};

export default PrescriptionHistory;
