import React from 'react';
import { Calendar, AlertCircle, Clock, CheckCircle, Trash2, Eye, Bell } from 'lucide-react';

const NotificationCard = ({ 
  notification, 
  onMarkRead, 
  onMarkUnread, 
  onDelete, 
  onViewDetails 
}) => {
  const getIcon = (type) => {
    switch (type) {
      case 'Appointment Reminder':
        return <Calendar size={18} />;
      case 'Prescription Alert':
        return <CheckCircle size={18} />;
      case 'Follow-Up Reminder':
        return <Clock size={18} />;
      case 'Missed Appointment':
        return <AlertCircle size={18} />;
      default:
        return <Bell size={18} />;
    }
  };

  const getIconClass = (type) => {
    switch (type) {
      case 'Appointment Reminder': return 'notif-icon-appointment';
      case 'Prescription Alert': return 'notif-icon-prescription';
      case 'Follow-Up Reminder': return 'notif-icon-followup';
      case 'Missed Appointment': return 'notif-icon-missed';
      default: return 'notif-icon-appointment';
    }
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case 'Appointment Reminder': return 'bg-primary';
      case 'Prescription Alert': return 'bg-success';
      case 'Follow-Up Reminder': return 'bg-warning text-dark';
      case 'Missed Appointment': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className={`notification-card ${!notification.isRead ? 'unread-card' : ''}`}>
      <div className={`notif-icon-circle ${getIconClass(notification.type)}`}>
        {getIcon(notification.type)}
      </div>

      <div className="notification-card-body">
        <div className="notification-card-header">
          <div className="d-flex align-items-center gap-2">
            <span className={`badge ${getBadgeClass(notification.type)}`} style={{ fontSize: '0.75rem' }}>
              {notification.type}
            </span>
            {!notification.isRead && (
              <span className="badge bg-info text-dark" style={{ fontSize: '0.7rem' }}>
                Unread
              </span>
            )}
          </div>
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>
            {notification.date} • {notification.time}
          </span>
        </div>

        <h4 className="notification-card-title">{notification.title}</h4>
        <p className="notification-card-msg">{notification.message}</p>

        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 pt-2 border-top">
          <div className="notification-card-meta">
            {notification.doctorName && (
              <span><strong>Doctor:</strong> {notification.doctorName}</span>
            )}
            {notification.patientName && (
              <span><strong>Patient:</strong> {notification.patientName}</span>
            )}
          </div>

          <div className="notification-card-actions">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
              onClick={() => onViewDetails(notification)}
            >
              <Eye size={14} />
              <span>Details</span>
            </button>

            {notification.isRead ? (
              <button
                type="button"
                className="btn btn-sm btn-outline-warning d-inline-flex align-items-center gap-1"
                onClick={() => onMarkUnread(notification.id)}
              >
                Mark Unread
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1"
                onClick={() => onMarkRead(notification.id)}
              >
                <CheckCircle size={14} />
                <span>Mark Read</span>
              </button>
            )}

            <button
              type="button"
              className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
              onClick={() => onDelete(notification.id)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
