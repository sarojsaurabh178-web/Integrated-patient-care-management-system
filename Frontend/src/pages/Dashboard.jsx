import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import { 
  Users, 
  Calendar, 
  Clock, 
  Stethoscope, 
  UserPlus, 
  CalendarPlus, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { doctors } from '../data/mockAppointments';

const Dashboard = ({ 
  patients, 
  appointments, 
  setActiveTab, 
  onOpenNewAppointmentModal 
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const todayAppointments = appointments.filter((apt) => apt.date === todayStr || apt.status === 'Scheduled');
  const scheduledCount = appointments.filter((apt) => apt.status === 'Scheduled').length;
  const onDutyDoctorsCount = doctors.filter((doc) => doc.status === 'On Duty').length;

  return (
    <div className="dashboard-page">
      <Breadcrumb activeTab="dashboard" setActiveTab={setActiveTab} />

      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Executive Healthcare Dashboard</h1>
        <p className="page-subtitle">
          Real-time patient care metrics, appointment scheduling overview, and medical staff status.
        </p>
      </div>

      {/* Metric Stat Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-blue">
            <Users size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Patients</span>
            <span className="stat-value">{patients.length}</span>
            <span className="stat-trend trend-up">↑ 12% growth this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-sky">
            <Calendar size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Scheduled Consultations</span>
            <span className="stat-value">{scheduledCount}</span>
            <span className="stat-trend">Active Queue</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-indigo">
            <Clock size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Today's Appointments</span>
            <span className="stat-value">{todayAppointments.length}</span>
            <span className="stat-trend trend-neutral">5 pending for afternoon</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-green">
            <Stethoscope size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Doctors On Duty</span>
            <span className="stat-value">{onDutyDoctorsCount} / {doctors.length}</span>
            <span className="stat-trend trend-up">All key OPDs active</span>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts Banner */}
      <div className="quick-actions-card">
        <div className="quick-actions-header">
          <h3>Quick Healthcare Actions</h3>
          <p>Streamline care management workflows</p>
        </div>
        <div className="quick-actions-btns">
          <button 
            type="button" 
            className="action-btn action-primary"
            onClick={() => setActiveTab('patients')}
          >
            <UserPlus size={18} />
            <span>Register New Patient</span>
            <ArrowRight size={16} />
          </button>

          <button 
            type="button" 
            className="action-btn action-secondary"
            onClick={onOpenNewAppointmentModal}
          >
            <CalendarPlus size={18} />
            <span>Book Appointment</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Two Column Grid: Today's Appointments & Doctor Roster */}
      <div className="dashboard-split-grid">
        {/* Column 1: Today's Appointments Queue */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Calendar className="card-title-icon" size={20} />
              Upcoming & Active Appointments
            </h3>
            <button 
              className="btn-link"
              onClick={() => setActiveTab('appointments')}
              style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
            >
              View All ({appointments.length})
            </button>
          </div>
          <div className="card-body" style={{ padding: '0.5rem 1rem' }}>
            <ul className="appointment-list-widget">
              {todayAppointments.slice(0, 4).map((apt) => (
                <li key={apt.id} className="apt-widget-item">
                  <div className="apt-widget-time">
                    <span className="apt-time">{apt.time}</span>
                    <span className="apt-date">{apt.date}</span>
                  </div>
                  <div className="apt-widget-details">
                    <div className="apt-patient-name">{apt.patientName} <span className="patient-id-tag">{apt.patientId}</span></div>
                    <div className="apt-doctor-name">{apt.doctorName} • {apt.department}</div>
                  </div>
                  <div className="apt-widget-status">
                    <span className={`status-badge ${apt.status === 'Completed' ? 'status-active' : 'status-pending'}`}>
                      {apt.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Column 2: Medical Specialists On Duty */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Stethoscope className="card-title-icon" size={20} />
              Medical Specialists & OPD Status
            </h3>
          </div>
          <div className="card-body" style={{ padding: '0.5rem 1rem' }}>
            <ul className="doctor-list-widget">
              {doctors.map((doc) => (
                <li key={doc.id} className="doctor-widget-item">
                  <div className="doctor-avatar">
                    {doc.name.split(' ').slice(1).map(n => n[0]).join('')}
                  </div>
                  <div className="doctor-details">
                    <span className="doctor-name">{doc.name}</span>
                    <span className="doctor-dept">{doc.department} • {doc.room}</span>
                  </div>
                  <span className={`doc-status-tag ${doc.status === 'On Duty' ? 'doc-duty' : 'doc-busy'}`}>
                    ● {doc.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
