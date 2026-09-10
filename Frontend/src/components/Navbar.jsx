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
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Menu,
  X
} from 'lucide-react';
import { ROLE_DETAILS } from '../data/mockAuthUsers';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  patientCount, 
  appointmentCount,
  consultationCount,
  notifications = [],
  currentRole = 'DOCTOR',
  onSwitchRole,
  onLogout,
  theme,
  toggleTheme
}) => {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const recentNotifications = notifications.slice(0, 4);

  const roleInfo = ROLE_DETAILS[currentRole] || ROLE_DETAILS.DOCTOR;

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setShowRoleDropdown(false);
    setShowNotifDropdown(false);
  };

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
    <>
      <header className="navbar">
        <div className="navbar-left">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="navbar-toggle-btn"
            aria-label="Toggle Navigation Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo & Branding */}
          <div className="navbar-brand" onClick={() => handleTabClick('dashboard')}>
            <div className="brand-icon-wrapper">
              <Activity size={22} strokeWidth={2.5} />
            </div>
            <div className="brand-info">
              <span className="brand-title">MediTrack</span>
              <span className="brand-subtitle">Integrated Patient Care Management System</span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="navbar-nav">
            <button
              type="button"
              className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleTabClick('dashboard')}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>

            {/* DOCTOR & ADMIN Tabs */}
            {(currentRole === 'DOCTOR' || currentRole === 'ADMINISTRATOR') && (
              <button
                type="button"
                className={`nav-tab ${activeTab === 'patients' ? 'active' : ''}`}
                onClick={() => handleTabClick('patients')}
              >
                <UserPlus size={16} />
                <span>{currentRole === 'ADMINISTRATOR' ? 'Users & Patients' : 'Registration'}</span>
                <span className="nav-badge">{patientCount}</span>
              </button>
            )}

            {/* Appointments Tab */}
            <button
              type="button"
              className={`nav-tab ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => handleTabClick('appointments')}
            >
              <Calendar size={16} />
              <span>Appointments</span>
              <span className="nav-badge">{appointmentCount}</span>
            </button>

            {/* Consultation & Rx Tab */}
            {(currentRole === 'DOCTOR' || currentRole === 'PATIENT') && (
              <button
                type="button"
                className={`nav-tab ${activeTab === 'consultation' ? 'active' : ''}`}
                onClick={() => handleTabClick('consultation')}
              >
                <FileText size={16} />
                <span>Consultation</span>
                <span className="nav-badge nav-badge-accent">{consultationCount}</span>
              </button>
            )}

            {/* Notifications Tab */}
            <button
              type="button"
              className={`nav-tab ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => handleTabClick('notifications')}
            >
              <Bell size={16} />
              <span>Notifications</span>
              {unreadCount > 0 && <span className="nav-badge bg-danger text-white">{unreadCount}</span>}
            </button>

            {/* ADMINISTRATOR Specific Tabs */}
            {currentRole === 'ADMINISTRATOR' && (
              <>
                <button
                  type="button"
                  className={`nav-tab ${activeTab === 'audit_logs' ? 'active' : ''}`}
                  onClick={() => handleTabClick('audit_logs')}
                >
                  <FileSpreadsheet size={16} />
                  <span>Audit Logs</span>
                </button>

                <button
                  type="button"
                  className={`nav-tab ${activeTab === 'security_monitoring' ? 'active' : ''}`}
                  onClick={() => handleTabClick('security_monitoring')}
                >
                  <ShieldCheck size={16} />
                  <span>Security</span>
                </button>

                <button
                  type="button"
                  className={`nav-tab ${activeTab === 'api_docs' ? 'active' : ''}`}
                  onClick={() => handleTabClick('api_docs')}
                >
                  <Code size={16} />
                  <span>APIs</span>
                </button>

                <button
                  type="button"
                  className={`nav-tab ${activeTab === 'jwt_flow' ? 'active' : ''}`}
                  onClick={() => handleTabClick('jwt_flow')}
                >
                  <Lock size={16} />
                  <span>JWT</span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Right Side: Role Selector, Theme Toggle, Bell, User Profile */}
        <div className="navbar-user">
          {/* Demo Role Selector */}
          <div className="role-switcher-dropdown">
            <button
              type="button"
              className="role-switcher-btn"
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowNotifDropdown(false);
              }}
            >
              <Users size={14} />
              <span>Role: <strong>{currentRole}</strong></span>
              <ChevronDown size={13} />
            </button>

            {showRoleDropdown && (
              <div className="role-dropdown-menu">
                <div className="role-dropdown-header">Select Demo Role</div>
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
                    <div className="text-muted" style={{ fontSize: '0.725rem' }}>Rahul Verma (View records)</div>
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
                    <div className="text-muted" style={{ fontSize: '0.725rem' }}>System Admin (Security & Audits)</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Theme Mode Toggle Button */}
          <div className="navbar-theme-toggle">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>

          {/* Notification Bell Dropdown */}
          <div className="nav-bell-wrapper">
            <button 
              type="button"
              className="nav-bell-btn" 
              aria-label="Notifications"
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowRoleDropdown(false);
              }}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="nav-bell-badge">{unreadCount}</span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="notification-dropdown">
                <div className="notif-dropdown-header">
                  <h4 className="notif-dropdown-title">
                    <Bell size={16} className="text-primary" />
                    <span>Notifications</span>
                  </h4>
                  <span className="badge bg-primary">
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
                          handleTabClick('notifications');
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
                      handleTabClick('notifications');
                    }}
                  >
                    View All Notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="user-profile">
            <div className="user-avatar">{roleInfo.avatar}</div>
            <div className="user-details">
              <span className="user-name">{roleInfo.name}</span>
              <span className="user-role">{roleInfo.badge}</span>
            </div>
            <button
              type="button"
              className="btn-link text-danger ms-1 p-0"
              title="Sign Out"
              onClick={onLogout}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Responsive Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setMobileMenuOpen(false)} />
          <aside className="navbar-mobile-drawer open">
            <div className="drawer-header">
              <div className="navbar-brand" onClick={() => handleTabClick('dashboard')}>
                <div className="brand-icon-wrapper">
                  <Activity size={20} strokeWidth={2.5} />
                </div>
                <div className="brand-info">
                  <span className="brand-title">MediTrack</span>
                </div>
              </div>
              <button 
                type="button" 
                className="close-btn" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close Drawer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="drawer-nav">
              <button
                type="button"
                className={`drawer-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleTabClick('dashboard')}
              >
                <div className="d-flex align-items-center gap-2">
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </div>
              </button>

              {(currentRole === 'DOCTOR' || currentRole === 'ADMINISTRATOR') && (
                <button
                  type="button"
                  className={`drawer-nav-item ${activeTab === 'patients' ? 'active' : ''}`}
                  onClick={() => handleTabClick('patients')}
                >
                  <div className="d-flex align-items-center gap-2">
                    <UserPlus size={18} />
                    <span>{currentRole === 'ADMINISTRATOR' ? 'Users & Patients' : 'Patient Registration'}</span>
                  </div>
                  <span className="nav-badge">{patientCount}</span>
                </button>
              )}

              <button
                type="button"
                className={`drawer-nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
                onClick={() => handleTabClick('appointments')}
              >
                <div className="d-flex align-items-center gap-2">
                  <Calendar size={18} />
                  <span>Appointments</span>
                </div>
                <span className="nav-badge">{appointmentCount}</span>
              </button>

              {(currentRole === 'DOCTOR' || currentRole === 'PATIENT') && (
                <button
                  type="button"
                  className={`drawer-nav-item ${activeTab === 'consultation' ? 'active' : ''}`}
                  onClick={() => handleTabClick('consultation')}
                >
                  <div className="d-flex align-items-center gap-2">
                    <FileText size={18} />
                    <span>Consultation & Rx</span>
                  </div>
                  <span className="nav-badge nav-badge-accent">{consultationCount}</span>
                </button>
              )}

              <button
                type="button"
                className={`drawer-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => handleTabClick('notifications')}
              >
                <div className="d-flex align-items-center gap-2">
                  <Bell size={18} />
                  <span>Notifications</span>
                </div>
                {unreadCount > 0 && <span className="nav-badge bg-danger text-white">{unreadCount}</span>}
              </button>

              {currentRole === 'ADMINISTRATOR' && (
                <>
                  <button
                    type="button"
                    className={`drawer-nav-item ${activeTab === 'audit_logs' ? 'active' : ''}`}
                    onClick={() => handleTabClick('audit_logs')}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <FileSpreadsheet size={18} />
                      <span>Audit Logs</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`drawer-nav-item ${activeTab === 'security_monitoring' ? 'active' : ''}`}
                    onClick={() => handleTabClick('security_monitoring')}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <ShieldCheck size={18} />
                      <span>Security Monitoring</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`drawer-nav-item ${activeTab === 'api_docs' ? 'active' : ''}`}
                    onClick={() => handleTabClick('api_docs')}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <Code size={18} />
                      <span>REST API Docs</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`drawer-nav-item ${activeTab === 'jwt_flow' ? 'active' : ''}`}
                    onClick={() => handleTabClick('jwt_flow')}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <Lock size={18} />
                      <span>JWT Auth Flow</span>
                    </div>
                  </button>
                </>
              )}
            </div>

            {/* Mobile Drawer Bottom User Info */}
            <div className="pt-3 border-top mt-auto">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="user-avatar">{roleInfo.avatar}</div>
                  <div>
                    <div className="fw-bold" style={{ fontSize: '0.85rem' }}>{roleInfo.name}</div>
                    <div className="text-muted" style={{ fontSize: '0.725rem' }}>{roleInfo.badge}</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={onLogout}
                >
                  <LogOut size={14} />
                </button>
              </div>

              <div className="d-flex align-items-center justify-content-between p-2 bg-light rounded-3">
                <span className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Theme</span>
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default Navbar;
