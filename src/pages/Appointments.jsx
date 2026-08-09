import React, { useState, useMemo } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import { 
  Calendar, 
  Search, 
  CalendarPlus, 
  Filter, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Inbox 
} from 'lucide-react';

const Appointments = ({ 
  appointments, 
  setActiveTab, 
  onOpenNewAppointmentModal, 
  onEditAppointment,
  onUpdateStatus 
}) => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesStatus = filterStatus === 'All' || apt.status === filterStatus;
      const query = searchTerm.toLowerCase().trim();
      const matchesQuery =
        !query ||
        apt.id.toLowerCase().includes(query) ||
        apt.patientName.toLowerCase().includes(query) ||
        apt.doctorName.toLowerCase().includes(query) ||
        apt.department.toLowerCase().includes(query);

      return matchesStatus && matchesQuery;
    });
  }, [appointments, filterStatus, searchTerm]);

  return (
    <div className="appointments-page">
      <Breadcrumb activeTab="appointments" setActiveTab={setActiveTab} />

      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Appointment Scheduling</h1>
          <p className="page-subtitle">
            Schedule, track, and manage patient consultations and specialist OPD appointments.
          </p>
        </div>

        <button 
          type="button" 
          className="btn btn-primary"
          onClick={onOpenNewAppointmentModal}
        >
          <CalendarPlus size={18} />
          Book New Appointment
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
          <div className="appointment-controls-row">
            {/* Filter Status Tabs */}
            <div className="status-tab-group">
              {['All', 'Scheduled', 'Completed', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`status-tab-btn ${filterStatus === status ? 'active' : ''}`}
                  onClick={() => setFilterStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="search-input-wrapper" style={{ maxWidth: '320px' }}>
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search patient, doctor, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Data Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Calendar className="card-title-icon" size={20} />
            Appointment Directory ({filteredAppointments.length})
          </h3>
        </div>
        <div className="card-body" style={{ padding: '0.75rem' }}>
          {filteredAppointments.length === 0 ? (
            <div className="empty-state">
              <Inbox className="empty-state-icon" size={48} />
              <p className="font-semibold text-lg text-slate-700">No appointments found</p>
              <p className="text-sm text-slate-500 mt-1">
                Try selecting another status tab or book a new appointment.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="patient-table">
                <thead>
                  <tr>
                    <th>Appt ID</th>
                    <th>Patient Name</th>
                    <th>Specialist & Dept</th>
                    <th>Date & Time</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id}>
                      <td>
                        <span className="patient-id-tag">{apt.id}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{apt.patientName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{apt.patientId}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{apt.doctorName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)' }}>{apt.department}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{apt.date}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{apt.time}</div>
                      </td>
                      <td>
                        <span className="apt-type-badge">{apt.type}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${
                          apt.status === 'Completed' ? 'status-active' :
                          apt.status === 'Cancelled' ? 'status-cancelled' : 'status-pending'
                        }`}>
                          ● {apt.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="btn btn-icon btn-edit"
                            onClick={() => onEditAppointment(apt)}
                            title="Edit Appointment"
                          >
                            <Edit3 size={14} />
                            Edit
                          </button>
                          {apt.status === 'Scheduled' && (
                            <>
                              <button
                                type="button"
                                className="btn btn-icon btn-view"
                                onClick={() => onUpdateStatus(apt.id, 'Completed')}
                                title="Mark as Completed"
                              >
                                <CheckCircle2 size={14} />
                                Complete
                              </button>
                              <button
                                type="button"
                                className="btn btn-icon"
                                style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
                                onClick={() => onUpdateStatus(apt.id, 'Cancelled')}
                                title="Cancel Appointment"
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
