import React from 'react';
import { Activity, Bell, LayoutDashboard, UserPlus, Calendar, FileText } from 'lucide-react';

const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  patientCount, 
  appointmentCount,
  consultationCount 
}) => {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon-wrapper">
            <Activity size={24} strokeWidth={2.5} />
          </div>
          <div className="brand-info">
            <span className="brand-title">MediTrack</span>
            <span className="brand-subtitle">Integrated Patient Care Management System</span>
          </div>
        </div>

        {/* Primary Navigation Bar */}
        <nav className="navbar-nav">
          <button
            type="button"
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={17} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className={`nav-tab ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            <UserPlus size={17} />
            <span>Patient Registration</span>
            <span className="nav-badge">{patientCount}</span>
          </button>

          <button
            type="button"
            className={`nav-tab ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <Calendar size={17} />
            <span>Appointments</span>
            <span className="nav-badge">{appointmentCount}</span>
          </button>

          <button
            type="button"
            className={`nav-tab ${activeTab === 'consultation' ? 'active' : ''}`}
            onClick={() => setActiveTab('consultation')}
          >
            <FileText size={17} />
            <span>Consultation & Prescription</span>
            <span className="nav-badge nav-badge-accent">{consultationCount}</span>
          </button>
        </nav>
      </div>

      <div className="navbar-user">
        <button className="notification-badge" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>

        <div className="user-profile">
          <div className="user-avatar">SJ</div>
          <div className="user-details">
            <span className="user-name">Dr. Sarah Jenkins</span>
            <span className="user-role">Senior Medical Officer</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
