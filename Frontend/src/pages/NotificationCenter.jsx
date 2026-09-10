import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import NotificationCard from '../components/NotificationCard';
import NotificationDetailsModal from '../components/NotificationDetailsModal';
import { Bell, CheckCheck, Trash2, Calendar, FileText, Clock, AlertCircle, Search, Inbox } from 'lucide-react';

import notificationService from '../services/notificationService';

const NotificationCenter = ({ 
  notifications, 
  setNotifications, 
  setActiveTab,
  onViewAppointment 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'unread', 'appointment', 'prescription', 'followup', 'missed'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalNotif, setActiveModalNotif] = useState(null);

  // Filter calculations
  const totalCount = notifications.length;
  const unreadCount = notifications.filter(n => !n.isRead && n.status !== 'Read').length;
  const appointmentCount = notifications.filter(n => n.category === 'appointment' || (n.type && n.type.includes('Appointment'))).length;
  const prescriptionCount = notifications.filter(n => n.category === 'prescription' || (n.type && n.type.includes('Prescription'))).length;
  const followupCount = notifications.filter(n => n.category === 'followup' || (n.type && n.type.includes('Follow'))).length;
  const missedCount = notifications.filter(n => n.category === 'missed' || (n.type && n.type.includes('Missed'))).length;

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
    } catch (e) {}
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true, status: 'Read' } : n));
  };

  const handleMarkUnread = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: false, status: 'Sent' } : n));
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
    } catch (e) {}
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true, status: 'Read' })));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.message.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'unread') return !n.isRead;
    if (selectedCategory === 'appointment') return n.category === 'appointment';
    if (selectedCategory === 'prescription') return n.category === 'prescription';
    if (selectedCategory === 'followup') return n.category === 'followup';
    if (selectedCategory === 'missed') return n.category === 'missed';
    return true;
  });

  return (
    <div className="notification-center-page pb-5">
      <Breadcrumb activeTab="notifications" setActiveTab={setActiveTab} />

      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 className="page-title">Notification Center</h1>
          <p className="page-subtitle">
            Real-time appointment alerts, prescription readiness, follow-up reminders, and healthcare notices.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button 
            type="button" 
            className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck size={16} />
            <span>Mark All as Read</span>
          </button>

          <button 
            type="button" 
            className="btn btn-sm btn-secondary text-danger d-inline-flex align-items-center gap-1"
            onClick={handleClearAll}
            disabled={totalCount === 0}
          >
            <Trash2 size={16} />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="notif-center-stats">
        <div className={`notif-stat-card ${selectedCategory === 'all' ? 'border-primary' : ''}`}
             onClick={() => setSelectedCategory('all')}>
          <div className="notif-icon-circle notif-icon-appointment">
            <Bell size={18} />
          </div>
          <div>
            <div className="stat-count">{totalCount}</div>
            <div className="stat-label">Total Notices</div>
          </div>
        </div>

        <div className={`notif-stat-card ${selectedCategory === 'unread' ? 'border-primary' : ''}`}
             onClick={() => setSelectedCategory('unread')}>
          <div className="notif-icon-circle notif-icon-missed">
            <Bell size={18} />
          </div>
          <div>
            <div className="stat-count">{unreadCount}</div>
            <div className="stat-label">Unread</div>
          </div>
        </div>

        <div className={`notif-stat-card ${selectedCategory === 'appointment' ? 'border-primary' : ''}`}
             onClick={() => setSelectedCategory('appointment')}>
          <div className="notif-icon-circle notif-icon-appointment">
            <Calendar size={18} />
          </div>
          <div>
            <div className="stat-count">{appointmentCount}</div>
            <div className="stat-label">Appointments</div>
          </div>
        </div>

        <div className={`notif-stat-card ${selectedCategory === 'prescription' ? 'border-primary' : ''}`}
             onClick={() => setSelectedCategory('prescription')}>
          <div className="notif-icon-circle notif-icon-prescription">
            <FileText size={18} />
          </div>
          <div>
            <div className="stat-count">{prescriptionCount}</div>
            <div className="stat-label">Prescriptions</div>
          </div>
        </div>

        <div className={`notif-stat-card ${selectedCategory === 'followup' ? 'border-primary' : ''}`}
             onClick={() => setSelectedCategory('followup')}>
          <div className="notif-icon-circle notif-icon-followup">
            <Clock size={18} />
          </div>
          <div>
            <div className="stat-count">{followupCount}</div>
            <div className="stat-label">Follow-Up</div>
          </div>
        </div>

        <div className={`notif-stat-card ${selectedCategory === 'missed' ? 'border-primary' : ''}`}
             onClick={() => setSelectedCategory('missed')}>
          <div className="notif-icon-circle notif-icon-missed">
            <AlertCircle size={18} />
          </div>
          <div>
            <div className="stat-count">{missedCount}</div>
            <div className="stat-label">Missed Slots</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
        <div className="notif-filter-tabs mb-0">
          <button 
            type="button" 
            className={`notif-filter-tab ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All ({totalCount})
          </button>
          <button 
            type="button" 
            className={`notif-filter-tab ${selectedCategory === 'unread' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button 
            type="button" 
            className={`notif-filter-tab ${selectedCategory === 'appointment' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('appointment')}
          >
            Appointments ({appointmentCount})
          </button>
          <button 
            type="button" 
            className={`notif-filter-tab ${selectedCategory === 'prescription' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('prescription')}
          >
            Prescriptions ({prescriptionCount})
          </button>
          <button 
            type="button" 
            className={`notif-filter-tab ${selectedCategory === 'followup' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('followup')}
          >
            Follow-Up ({followupCount})
          </button>
          <button 
            type="button" 
            className={`notif-filter-tab ${selectedCategory === 'missed' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('missed')}
          >
            Missed ({missedCount})
          </button>
        </div>

        <div style={{ width: '260px' }}>
          <div className="input-group input-group-sm">
            <span className="input-group-text">
              <Search size={14} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Notification Cards List */}
      <div className="notif-list-container">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <NotificationCard
              key={notif.id}
              notification={notif}
              onMarkRead={handleMarkRead}
              onMarkUnread={handleMarkUnread}
              onDelete={handleDelete}
              onViewDetails={(item) => setActiveModalNotif(item)}
            />
          ))
        ) : (
          <div className="empty-state card">
            <Inbox className="empty-state-icon" size={44} />
            <h4 className="fw-bold text-primary mb-1">No notifications matching your filter</h4>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>You are all caught up with your clinical updates.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {activeModalNotif && (
        <NotificationDetailsModal
          notification={activeModalNotif}
          onClose={() => setActiveModalNotif(null)}
          onViewAppointment={(aptId) => {
            setActiveModalNotif(null);
            onViewAppointment(aptId);
          }}
        />
      )}
    </div>
  );
};

export default NotificationCenter;
