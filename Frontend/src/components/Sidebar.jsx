import React from 'react';
import { 
  Activity, 
  LayoutDashboard, 
  UserPlus, 
  Calendar, 
  FileText, 
  Bell, 
  FileSpreadsheet, 
  ShieldCheck, 
  Code, 
  Lock, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Users, 
  LogOut, 
  Stethoscope,
  Sparkles,
  ExternalLink,
  MapPin,
  Building2,
  HeartPulse,
  Bed,
  UserCheck
} from 'lucide-react';
import { ROLE_DETAILS } from '../data/mockAuthUsers';
import ThemeToggle from './ThemeToggle';

const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  patientCount = 0, 
  appointmentCount = 0,
  consultationCount = 0,
  notifications = [],
  currentRole = 'DOCTOR',
  onSwitchRole,
  isCollapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
  onLogout,
  theme,
  toggleTheme
}) => {
  const unreadCount = notifications.filter(n => !n.isRead && n.status !== 'Read').length;
  const roleInfo = ROLE_DETAILS[currentRole] || ROLE_DETAILS.DOCTOR;

  const handleNavClick = (tab) => {
    if (tab === 'my_profile') {
      setActiveTab(currentRole === 'PATIENT' ? 'patient_profile' : 'doctor_profile');
    } else {
      setActiveTab(tab);
    }
    if (onCloseMobile) onCloseMobile();
  };

  const isProfileActive = activeTab === 'patient_profile' || activeTab === 'doctor_profile';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Main Left Sidebar */}
      <aside 
        className={`app-sidebar ${isCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
        aria-label="Main Navigation Sidebar"
      >
        {/* 1. Sidebar Brand Header - No (x) button as requested */}
        <div className="sidebar-brand-header">
          <div 
            className="sidebar-brand" 
            onClick={() => handleNavClick('dashboard')}
            title="CareHub / MediTrack - Healthcare Management System"
          >
            <div className="brand-glyph-box">
              <Activity size={22} className="text-white" strokeWidth={2.6} />
            </div>
            {!isCollapsed && (
              <div className="brand-text-block">
                <div className="d-flex align-items-center gap-1">
                  <span className="brand-name">CareHub</span>
                  <span className="brand-tag-badge">MediTrack</span>
                </div>
                <span className="brand-subtext">Clinical Care System</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Scrollable Navigation Section */}
        <div className="sidebar-nav-container">
          {/* GROUP 1: CLINICAL CARE */}
          <div className="nav-group-section">
            {!isCollapsed && <span className="nav-group-title">Clinical Care</span>}
            
            <nav className="sidebar-nav" aria-label="Clinical Navigation">
              {/* Dashboard */}
              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNavClick('dashboard')}
                title="Executive Healthcare Dashboard"
              >
                <span className="nav-item-icon"><LayoutDashboard size={19} /></span>
                {!isCollapsed && <span className="nav-item-label">Dashboard</span>}
              </button>

              {/* Patient Registration (Doctor & Admin) */}
              {(currentRole === 'DOCTOR' || currentRole === 'ADMINISTRATOR') && (
                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'patients' ? 'active' : ''}`}
                  onClick={() => handleNavClick('patients')}
                  title="Patient Registration & Directory"
                >
                  <span className="nav-item-icon"><UserPlus size={19} /></span>
                  {!isCollapsed && (
                    <>
                      <span className="nav-item-label">Patient Registration</span>
                      {patientCount > 0 && <span className="sidebar-badge">{patientCount}</span>}
                    </>
                  )}
                </button>
              )}

              {/* Patient Profile */}
              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'patient_profile' ? 'active' : ''}`}
                onClick={() => handleNavClick('patient_profile')}
                title={currentRole === 'PATIENT' ? 'My Patient Profile (EHR)' : 'Patient Profile (EHR)'}
              >
                <span className="nav-item-icon"><User size={19} /></span>
                {!isCollapsed && (
                  <span className="nav-item-label">
                    {currentRole === 'PATIENT' ? 'My Health Profile' : 'Patient Profile'}
                  </span>
                )}
              </button>

              {/* Appointments */}
              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
                onClick={() => handleNavClick('appointments')}
                title="Appointments & Scheduling"
              >
                <span className="nav-item-icon"><Calendar size={19} /></span>
                {!isCollapsed && (
                  <>
                    <span className="nav-item-label">Appointments</span>
                    {appointmentCount > 0 && <span className="sidebar-badge">{appointmentCount}</span>}
                  </>
                )}
              </button>

              {/* Clinical Consultation & Prescriptions (Doctor & Patient) */}
              {(currentRole === 'DOCTOR' || currentRole === 'PATIENT') && (
                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'consultation' ? 'active' : ''}`}
                  onClick={() => handleNavClick('consultation')}
                  title="Clinical Consultations & Prescriptions"
                >
                  <span className="nav-item-icon"><FileText size={19} /></span>
                  {!isCollapsed && (
                    <>
                      <span className="nav-item-label">Consultation &amp; Rx</span>
                      {consultationCount > 0 && (
                        <span className="sidebar-badge badge-accent">{consultationCount}</span>
                      )}
                    </>
                  )}
                </button>
              )}

              {/* Notifications */}
              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => handleNavClick('notifications')}
                title="Notification Center & Alerts"
              >
                <span className="nav-item-icon"><Bell size={19} /></span>
                {!isCollapsed && (
                  <>
                    <span className="nav-item-label">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="sidebar-badge badge-danger">{unreadCount}</span>
                    )}
                  </>
                )}
              </button>
            </nav>
          </div>

          {/* GROUP 2: HOSPITAL MANAGEMENT */}
          <div className="nav-group-section mt-3">
            {!isCollapsed && <span className="nav-group-title">Hospital Management</span>}
            
            <nav className="sidebar-nav" aria-label="Hospital Management Navigation">
              {/* Doctor Profile */}
              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'doctor_profile' ? 'active' : ''}`}
                onClick={() => handleNavClick('doctor_profile')}
                title={currentRole === 'DOCTOR' ? 'My Doctor Profile & Schedule' : 'Doctor Profile & Directory'}
              >
                <span className="nav-item-icon"><Stethoscope size={19} /></span>
                {!isCollapsed && (
                  <span className="nav-item-label">
                    {currentRole === 'DOCTOR' ? 'Doctor Profile' : 'Doctor Directory'}
                  </span>
                )}
              </button>

              {/* Hospital Information & Beds */}
              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'hospital_info' ? 'active' : ''}`}
                onClick={() => handleNavClick('hospital_info')}
                title="Hospital Information & Live Bed Telemetry"
              >
                <span className="nav-item-icon"><Building2 size={19} /></span>
                {!isCollapsed && (
                  <>
                    <span className="nav-item-label">Hospital Info &amp; Beds</span>
                    <span className="sidebar-badge badge-live">Live</span>
                  </>
                )}
              </button>

              {/* Nearby Hospitals Locator */}
              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'nearby_hospitals' ? 'active' : ''}`}
                onClick={() => handleNavClick('nearby_hospitals')}
                title="Nearby Hospitals Locator & Interactive Map"
              >
                <span className="nav-item-icon"><MapPin size={19} /></span>
                {!isCollapsed && <span className="nav-item-label">Nearby Hospitals</span>}
              </button>
            </nav>
          </div>

          {/* GROUP 3: ADMINISTRATOR SYSTEM TOOLS (Admin Only) */}
          {currentRole === 'ADMINISTRATOR' && (
            <div className="nav-group-section mt-3">
              {!isCollapsed && <span className="nav-group-title">System &amp; Security</span>}
              <nav className="sidebar-nav" aria-label="Admin Navigation">
                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'audit_logs' ? 'active' : ''}`}
                  onClick={() => handleNavClick('audit_logs')}
                  title="System Audit Logging & Trail"
                >
                  <span className="nav-item-icon"><FileSpreadsheet size={19} /></span>
                  {!isCollapsed && <span className="nav-item-label">Audit Logs</span>}
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'security_monitoring' ? 'active' : ''}`}
                  onClick={() => handleNavClick('security_monitoring')}
                  title="Security Events & Threat Monitoring"
                >
                  <span className="nav-item-icon"><ShieldCheck size={19} /></span>
                  {!isCollapsed && <span className="nav-item-label">Security</span>}
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'api_docs' ? 'active' : ''}`}
                  onClick={() => handleNavClick('api_docs')}
                  title="Interactive REST API Documentation"
                >
                  <span className="nav-item-icon"><Code size={19} /></span>
                  {!isCollapsed && <span className="nav-item-label">REST APIs</span>}
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'jwt_flow' ? 'active' : ''}`}
                  onClick={() => handleNavClick('jwt_flow')}
                  title="JWT Authentication Architecture & Inspection"
                >
                  <span className="nav-item-icon"><Lock size={19} /></span>
                  {!isCollapsed && <span className="nav-item-label">JWT Flow</span>}
                </button>
              </nav>
            </div>
          )}

          {/* GROUP 4: ACCOUNT */}
          <div className="nav-group-section mt-3">
            {!isCollapsed && <span className="nav-group-title">Account</span>}
            <nav className="sidebar-nav" aria-label="Account Navigation">
              {/* My Profile */}
              <button
                type="button"
                className={`sidebar-nav-item ${isProfileActive ? 'active' : ''}`}
                onClick={() => handleNavClick('my_profile')}
                title="View My Profile"
              >
                <span className="nav-item-icon"><UserCheck size={19} /></span>
                {!isCollapsed && <span className="nav-item-label">My Profile</span>}
              </button>

              {/* Logout */}
              <button
                type="button"
                className="sidebar-nav-item text-danger"
                onClick={onLogout}
                title="Logout of current session"
              >
                <span className="nav-item-icon"><LogOut size={19} /></span>
                {!isCollapsed && <span className="nav-item-label">Logout</span>}
              </button>
            </nav>
          </div>
        </div>

        {/* 3. Sidebar Footer: Role Status, User Profile & Collapse Toggle */}
        <div className="sidebar-footer">
          {/* User Profile Card */}
          <div 
            className="sidebar-user-card"
            onClick={() => handleNavClick('my_profile')}
            style={{ cursor: 'pointer' }}
            title="Click to view profile"
          >
            <div className="sidebar-user-avatar">
              {roleInfo?.avatar || (currentRole === 'DOCTOR' ? 'SJ' : currentRole === 'PATIENT' ? 'RV' : 'SA')}
            </div>
            {!isCollapsed && (
              <div className="sidebar-user-info">
                <span className="sidebar-user-name" title={roleInfo?.name || currentRole}>
                  {roleInfo?.name || (currentRole === 'DOCTOR' ? 'Dr. Sarah Jenkins' : currentRole === 'PATIENT' ? 'Rahul Verma' : 'System Admin')}
                </span>
                <span className={`sidebar-role-pill role-${currentRole.toLowerCase()}`}>
                  {currentRole}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse / Expand Button */}
          <div className="sidebar-actions-row">
            <button
              type="button"
              className="sidebar-collapse-toggle-btn d-none d-lg-flex"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight size={17} /> : (
                <>
                  <ChevronLeft size={17} />
                  <span>Collapse Menu</span>
                </>
              )}
            </button>

            {/* Logout Shortcut */}
            <button
              type="button"
              className="sidebar-logout-icon-btn"
              onClick={onLogout}
              aria-label="Logout"
              title="Logout of session"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
