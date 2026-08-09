import React from 'react';
import { X, Printer, Activity, Pill } from 'lucide-react';

const PrescriptionPrintModal = ({ isOpen, prescription, patient, onClose }) => {
  if (!isOpen || !prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content rx-print-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header no-print">
          <div className="modal-title">
            <Pill className="card-title-icon" size={20} />
            <span>Prescription Preview ({prescription.id || 'Rx'})</span>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Printable Hospital Rx Pad */}
        <div className="modal-body rx-pad-body">
          <div className="rx-hospital-header">
            <div className="rx-brand">
              <Activity size={28} className="rx-logo" />
              <div>
                <h2>MediTrack Healthcare Center</h2>
                <p>Integrated Patient Care & Clinical Services</p>
              </div>
            </div>
            <div className="rx-doctor-info">
              <h3>{prescription.doctor}</h3>
              <p>Senior Medical Specialist</p>
              <p>Reg No: MED-884920</p>
            </div>
          </div>

          <hr className="rx-divider" />

          {/* Patient Details Bar */}
          <div className="rx-patient-bar">
            <div className="rx-meta">
              <strong>Patient ID:</strong> {prescription.patientId}
            </div>
            <div className="rx-meta">
              <strong>Name:</strong> {prescription.patientName || (patient ? patient.name : 'N/A')}
            </div>
            <div className="rx-meta">
              <strong>Age/Gender:</strong> {patient ? `${patient.age} Yrs / ${patient.gender}` : 'N/A'}
            </div>
            <div className="rx-meta">
              <strong>Date:</strong> {prescription.date}
            </div>
          </div>

          <div className="rx-symbol">Rx</div>

          {/* Prescription Content Table */}
          <table className="rx-table">
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Dosage & Frequency</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 700, fontSize: '1rem' }}>{prescription.medicine}</td>
                <td>{prescription.dosage}</td>
                <td>{prescription.duration}</td>
              </tr>
            </tbody>
          </table>

          {prescription.notes && (
            <div className="rx-notes-box">
              <strong>Special Advice / Instructions:</strong>
              <p>{prescription.notes}</p>
            </div>
          )}

          <div className="rx-footer-stamp">
            <div className="rx-signature-line">
              <p>Authorized Signature</p>
              <strong>{prescription.doctor}</strong>
            </div>
          </div>
        </div>

        <div className="modal-footer no-print">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Print Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPrintModal;
