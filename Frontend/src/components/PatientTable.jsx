import React from 'react';
import { Eye, Edit3, UserCheck, Inbox } from 'lucide-react';

const PatientTable = ({ patients, onViewPatient, onEditPatient }) => {
  if (patients.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <UserCheck className="card-title-icon" size={20} />
            Recently Registered Patients
          </h3>
        </div>
        <div className="card-body">
          <div className="empty-state">
            <Inbox className="empty-state-icon" size={48} />
            <p className="font-semibold text-lg text-slate-700">No patients found</p>
            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your search criteria or register a new patient above.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <UserCheck className="card-title-icon" size={20} />
          Recently Registered Patients
        </h3>
      </div>
      <div className="card-body" style={{ padding: '0.75rem' }}>
        <div className="table-responsive">
          <table className="patient-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Full Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>
                    <span className="patient-id-tag">{patient.id}</span>
                  </td>
                  <td style={{ fontWeight: '600' }}>{patient.name}</td>
                  <td>{patient.age} yrs</td>
                  <td>{patient.gender}</td>
                  <td>{patient.phone}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{patient.email}</td>
                  <td>
                    <span className="status-badge status-active">
                      ● {patient.status || 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="btn btn-icon btn-view"
                        onClick={() => onViewPatient(patient)}
                        title="View Patient Details"
                      >
                        <Eye size={14} />
                        View
                      </button>
                      <button
                        type="button"
                        className="btn btn-icon btn-edit"
                        onClick={() => onEditPatient(patient)}
                        title="Edit Patient Record"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientTable;
