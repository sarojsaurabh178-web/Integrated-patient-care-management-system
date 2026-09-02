import React, { useState } from 'react';
import { 
  Activity, 
  Bell, 
  LayoutDashboard, 
  UserPlus, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  FileSpreadsheet, 
  Code, 
  Lock, 
  ChevronDown,
  User,
  Users,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { ROLE_DETAILS } from '../data/mockAuthUsers';

const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  patientCount, 
  appointmentCount,
  consultationCount,
  notifications = [],
  currentRole = 'DOCTOR',
  onSwitchRole,
  onLogout
}) => {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const recentNotifications = notifications.slice(0, 4);

  const roleInfo = ROLE_DETAILS[currentRole] || ROLE_DETAILS.DOCTOR;

  const getNotifIcon = (type) => {
    switch (type) {
      case 'Appointment Reminder': return <Calendar size={14} />;
      case 'Prescription Alert': return <CheckCircle2 size={14} />;
      case 'Follow-Up Reminder': return <Clock size={14} />;
      case 'Missed Appointment': return <AlertCircle size={14} />;
      default: return <Bell size={14} />;
    }
  };

  return (
    <header className="navbar" style={{ position: 'relative' }}>
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

        {/* Primary Dynamic Navigation Bar based on Role */}
        <nav className="navbar-nav">
          <button
            type="button"
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={17} />
            <span>Dashboard</span>
          </button>

          {/* DOCTOR & ADMIN Tabs */}
          {(currentRole === 'DOCTOR' || currentRole === 'ADMINISTRATOR') && (
            <button
              type="button"
              className={`nav-tab ${activeTab === 'patients' ? 'active' : ''}`}
              onClick={() => setActiveTab('patients')}
            >
              <UserPlus size={17} />
              <span>{currentRole === 'ADMINISTRATOR' ? 'Users & Patients' : 'Patient Registration'}</span>
              <span className="nav-badge">{patientCount}</span>
            </button>
          )}

          {/* PATIENT, DOCTOR & ADMIN Appointments Tab */}
          <button
            type="button"
            className={`nav-tab ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <Calendar size={17} />
            <span>Appointments</span>
            <span className="nav-badge">{appointmentCount}</span>
          </button>

          {/* DOCTOR & PATIENT Consultation Tab */}
          {(currentRole === 'DOCTOR' || currentRole === 'PATIENT') && (
            <button
              type="button"
              className={`nav-tab ${activeTab === 'consultation' ? 'active' : ''}`}
              onClick={() => setActiveTab('consultation')}
            >
              <FileText size={17} />
              <span>Consultation & Rx</span>
              <span className="nav-badge nav-badge-accent">{consultationCount}</span>
            </button>
          )}

          {/* ADMINISTRATOR Specific Security & Audit Tabs */}
          {currentRole === 'ADMINISTRATOR' && (
            <>
              <button
                type="button"
                className={`nav-tab ${activeTab === 'audit_logs' ? 'active' : ''}`}
                onClick={() => setActiveTab('audit_logs')}
              >
                <FileSpreadsheet size={17} />
                <span>Audit Logs</span>
              </button>

              <button
                type="button"
                className={`nav-tab ${activeTab === 'security_monitoring' ? 'active' : ''}`}
                onClick={() => setActiveTab('security_monitoring')}
              >
                <ShieldCheck size={17} />
                <span>Security Monitoring</span>
              </button>

              <button
                type="button"
                className={`nav-tab ${activeTab === 'api_docs' ? 'active' : ''}`}
                onClick={() => setActiveTab('api_docs')}
              >
                <Code size={17} />
                <span>REST API Docs</span>
              </button>

              <button
                type="button"
                className={`nav-tab ${activeTab === 'jwt_flow' ? 'active' : ''}`}
                onClick={() => setActiveTab('jwt_flow')}
              >
                <Lock size={17} />
                <span>JWT Flow</span>
              </button>
            </>
          )}

          {/* Notification Center Link for all roles */}
          <button
            type="button"
            className={`nav-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={17} />
            <span>Notifications</span>
            {unreadCount > 0 && <span className="nav-badge bg-danger text-white">{unreadCount}</span>}
          </button>
        </nav>
      </div>

      <div className="navbar-user">
        {/* Role Switcher Selector Dropdown */}
        <div className="role-switcher-dropdown ms-2">
          <button
            type="button"
            className="role-switcher-btn"
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowNotifDropdown(false);
            }}
          >
            <Users size={15} />
            <span>Demo Role: <strong>{currentRole}</strong></span>
            <ChevronDown size={14} />
          </button>

          {showRoleDropdown && (
            <div className="role-dropdown-menu">
              <div className="role-dropdown-header">Select Frontend Demo Role</div>
              <button
                type="button"
                className={`role-dropdown-item ${currentRole === 'PATIENT' ? 'active' : ''}`}
                onClick={() => {
                  onSwitchRole('PATIENT');
                  setShowRoleDropdown(false);
                }}
              >
                <User size={16} className="text-primary" />
                <div>
                  <div className="fw-semibold">PATIENT</div>
                  <div className="text-muted" style={{ fontSize: '0.725rem' }}>Rahul Verma (View own records)</div>
                </div>
              </button>

              <button
                type="button"
                className={`role-dropdown-item ${currentRole === 'DOCTOR' ? 'active' : ''}`}
                onClick={() => {
                  onSwitchRole('DOCTOR');
                  setShowRoleDropdown(false);
                }}
              >
                <FileText size={16} className="text-success" />
                <div>
                  <div className="fw-semibold">DOCTOR</div>
                  <div className="text-muted" style={{ fontSize: '0.725rem' }}>Dr. Sarah Jenkins (OPD & Rx)</div>
                </div>
              </button>

              <button
                type="button"
                className={`role-dropdown-item ${currentRole === 'ADMINISTRATOR' ? 'active' : ''}`}
                onClick={() => {
                  onSwitchRole('ADMINISTRATOR');
                  setShowRoleDropdown(false);
                }}
              >
                <ShieldCheck size={16} className="text-danger" />
                <div>
                  <div className="fw-semibold">ADMINISTRATOR</div>
                  <div className="text-muted" style={{ fontSize: '0.725rem' }}>System Admin (Audits & Security)</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell Icon & Dropdown */}
        <div className="nav-bell-wrapper ms-2">
          <button 
            type="button"
            className="nav-bell-btn" 
            aria-label="Notifications"
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              setShowRoleDropdown(false);
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="nav-bell-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="notification-dropdown">
              <div className="notif-dropdown-header">
                <h4 className="notif-dropdown-title">
                  <Bell size={18} className="text-primary" />
                  <span>Notifications</span>
                </h4>
                <span className="badge bg-primary rounded-pill">
                  {unreadCount} Unread
                </span>
              </div>

              <ul className="notif-dropdown-list">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map(notif => (
                    <li
                      key={notif.id}
                      className={`notif-dropdown-item ${!notif.isRead ? 'unread' : ''}`}
                      onClick={() => {
                        setShowNotifDropdown(false);
                        setActiveTab('notifications');
                      }}
                    >
                      <div className="notif-icon-circle notif-icon-appointment">
                        {getNotifIcon(notif.type)}
                      </div>
                      <div className="notif-content-preview">
                        <div className="notif-item-title">{notif.title}</div>
                        <div className="notif-item-msg">{notif.message}</div>
                        <div className="notif-item-time">{notif.date} • {notif.time}</div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="p-4 text-center text-muted" style={{ fontSize: '0.85rem' }}>
                    No notifications available.
                  </li>
                )}
              </ul>

              <div className="notif-dropdown-footer">
                <button
                  type="button"
                  className="btn-view-all-notifs"
                  onClick={() => {
                    setShowNotifDropdown(false);
                    setActiveTab('notifications');
                  }}
                >
                  View All Notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="user-profile ms-2">
          <div className="user-avatar">{roleInfo.avatar}</div>
          <div className="user-details">
            <span className="user-name">{roleInfo.name}</span>
            <span className="user-role">{roleInfo.badge}</span>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-link text-danger ms-2 p-0"
            title="Sign Out / Switch Auth"
            onClick={onLogout}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
