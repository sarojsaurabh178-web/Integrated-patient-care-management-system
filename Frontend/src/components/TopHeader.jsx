import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  ChevronDown, 
  User, 
  Users, 
  FileText, 
  LogOut, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { ROLE_DETAILS } from '../data/mockAuthUsers';
import ThemeToggle from './ThemeToggle';

const TopHeader = ({ 
  activeTab, 
  setActiveTab, 
  currentRole = 'DOCTOR', 
  onSwitchRole, 
  onToggleSidebar,
  onOpenMobileSidebar, 
  notifications = [], 
  onLogout, 
  theme, 
  toggleTheme 
}) => {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead && n.status !== 'Read').length;
  const recentNotifications = notifications.slice(0, 4);
  const roleInfo = ROLE_DETAILS[currentRole] || ROLE_DETAILS.DOCTOR;

  const getPageTitle = (tab) => {
    switch (tab) {
      case 'dashboard': return 'Executive Healthcare Dashboard';
      case 'patients': return currentRole === 'ADMINISTRATOR' ? 'Hospital Staff & Patient Registry' : 'Patient Registration';
      case 'patient_profile': return 'Electronic Health Record (EHR) Patient Profile';
      case 'doctor_profile': return 'Doctor Profile & Clinical Availability';
      case 'hospital_info': return 'Hospital Information & Bed Capacity Telemetry';
      case 'nearby_hospitals': return 'Nearby Hospitals & Emergency Locator';
      case 'appointments': return 'Clinical Appointment Scheduling';
      case 'consultation': return 'Clinical Consultations & Digital Prescriptions';
      case 'notifications': return 'System Notifications & Clinical Alerts';
      case 'audit_logs': return 'Security Audit Logs & Telemetry';
      case 'security_monitoring': return 'System Threat & Access Monitoring';
      case 'api_docs': return 'REST API Integration Center';
      case 'jwt_flow': return 'JWT Role-Based Security Inspector';
      default: return 'Healthcare Management System';
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'Appointment Reminder': return <Calendar size={14} className="text-primary" />;
      case 'Prescription Alert': return <CheckCircle2 size={14} className="text-success" />;
      case 'Follow-Up Reminder': return <Clock size={14} className="text-warning" />;
      case 'Missed Appointment': return <AlertCircle size={14} className="text-danger" />;
      default: return <Bell size={14} className="text-info" />;
    }
  };

  return (
    <header className="top-header-bar">
      <div className="top-header-left">
        {/* Universal Hamburger Toggle (Expands/Collapses on Desktop, Slides out on Mobile) */}
        <button
          type="button"
          id="btn-toggle-sidebar"
          className="top-header-menu-btn"
          onClick={onToggleSidebar || onOpenMobileSidebar}
          aria-label="Toggle Navigation Sidebar"
          title="Toggle Navigation Sidebar (Collapse / Expand)"
        >
          <Menu size={20} />
        </button>

        {/* Current Active Page Title & Health Status */}
        <div className="top-header-page-meta">
          <h2 className="top-header-title">{getPageTitle(activeTab)}</h2>
          <div className="top-header-status-indicator d-none d-sm-flex">
            <span className="live-pulse-dot" />
            <span>PostgreSQL Synchronized</span>
          </div>
        </div>
      </div>

      {/* Right Utility Actions */}
      <div className="top-header-right">
        {/* 1. Demo Role Switcher Dropdown */}
        <div className="header-dropdown-wrapper">
          <button
            type="button"
            className="header-role-btn"
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowNotifDropdown(false);
            }}
            aria-expanded={showRoleDropdown}
            aria-label="Switch Role"
          >
            <Users size={14} className="text-primary" />
            <span className="d-none d-md-inline">Role: <strong>{currentRole}</strong></span>
            <span className="d-md-none"><strong>{currentRole}</strong></span>
            <ChevronDown size={13} className={`chevron-transition ${showRoleDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showRoleDropdown && (
            <div className="header-dropdown-menu role-menu">
              <div className="dropdown-menu-header">Select Clinical Role</div>
              
              <button
                type="button"
                className={`dropdown-menu-item ${currentRole === 'PATIENT' ? 'active' : ''}`}
                onClick={() => {
                  onSwitchRole('PATIENT');
                  setShowRoleDropdown(false);
                }}
              >
                <div className="dropdown-item-icon patient">
                  <User size={16} />
                </div>
                <div>
                  <div className="dropdown-item-title">PATIENT</div>
                  <div className="dropdown-item-desc">Rahul Verma (View medical records)</div>
                </div>
              </button>

              <button
                type="button"
                className={`dropdown-menu-item ${currentRole === 'DOCTOR' ? 'active' : ''}`}
                onClick={() => {
                  onSwitchRole('DOCTOR');
                  setShowRoleDropdown(false);
                }}
              >
                <div className="dropdown-item-icon doctor">
                  <FileText size={16} />
                </div>
                <div>
                  <div className="dropdown-item-title">DOCTOR</div>
                  <div className="dropdown-item-desc">Dr. Sarah Jenkins (OPD & Rx)</div>
                </div>
              </button>

              <button
                type="button"
                className={`dropdown-menu-item ${currentRole === 'ADMINISTRATOR' ? 'active' : ''}`}
                onClick={() => {
                  onSwitchRole('ADMINISTRATOR');
                  setShowRoleDropdown(false);
                }}
              >
                <div className="dropdown-item-icon admin">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <div className="dropdown-item-title">ADMINISTRATOR</div>
                  <div className="dropdown-item-desc">Full system audits & analytics</div>
                </div>
              </button>

              <div className="dropdown-divider my-1" style={{ borderTop: '1px solid var(--border-color)' }} />
              
              <button
                type="button"
                className="dropdown-menu-item"
                onClick={() => {
                  setActiveTab(currentRole === 'PATIENT' ? 'patient_profile' : 'doctor_profile');
                  setShowRoleDropdown(false);
                }}
              >
                <div className="dropdown-item-icon patient">
                  <User size={16} />
                </div>
                <div>
                  <div className="dropdown-item-title">View My Profile</div>
                  <div className="dropdown-item-desc">Open {currentRole === 'PATIENT' ? 'Patient EHR' : 'Doctor Schedule'}</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* 2. Notification Bell Dropdown */}
        <div className="header-dropdown-wrapper">
          <button
            type="button"
            className="header-icon-btn notif-btn"
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              setShowRoleDropdown(false);
            }}
            aria-label="View notifications"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notif-badge-count">{unreadCount}</span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="header-dropdown-menu notif-menu">
              <div className="dropdown-menu-header d-flex justify-content-between align-items-center">
                <span>Recent Notifications</span>
                <span className="badge bg-primary text-white" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                  {unreadCount} Unread
                </span>
              </div>

              <div className="notif-dropdown-list">
                {recentNotifications.length === 0 ? (
                  <div className="p-3 text-center text-muted" style={{ fontSize: '0.8rem' }}>
                    No recent notifications
                  </div>
                ) : (
                  recentNotifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`notif-dropdown-item ${!n.isRead ? 'unread' : ''}`}
                      onClick={() => {
                        setActiveTab('notifications');
                        setShowNotifDropdown(false);
                      }}
                    >
                      <div className="notif-item-icon">
                        {getNotifIcon(n.type)}
                      </div>
                      <div className="notif-item-body">
                        <div className="notif-item-title">{n.title || n.type}</div>
                        <div className="notif-item-msg">{n.message}</div>
                        <div className="notif-item-time">{n.date || 'Recent'}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="dropdown-menu-footer">
                <button
                  type="button"
                  className="btn-view-all-notifs"
                  onClick={() => {
                    setActiveTab('notifications');
                    setShowNotifDropdown(false);
                  }}
                >
                  View All Notifications Center
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Theme Toggle */}
        {theme && toggleTheme && (
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        )}

        {/* 4. Quick Logout Button */}
        <button
          type="button"
          className="header-logout-btn"
          onClick={onLogout}
          title="Sign out of system"
          aria-label="Sign out"
        >
          <LogOut size={16} />
          <span className="d-none d-md-inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default TopHeader;
