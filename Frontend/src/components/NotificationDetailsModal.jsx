import React from 'react';
import { X, Calendar, User, Stethoscope, CheckCircle2 } from 'lucide-react';

const NotificationDetailsModal = ({ 
  notification, 
  onClose, 
  onViewAppointment 
}) => {
  if (!notification) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-primary px-2 py-1">{notification.type}</span>
            <span className="text-muted" style={{ fontSize: '0.825rem' }}>{notification.id}</span>
          </div>
          <button 
            type="button" 
            className="close-btn" 
            aria-label="Close" 
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <h3 className="h5 fw-bold mb-2 text-primary">{notification.title}</h3>
          
          <div className="p-3 bg-light rounded-3 mb-4 text-secondary" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
            {notification.message}
          </div>

          <div className="row g-3 text-sm">
            <div className="col-6">
              <div className="d-flex align-items-center gap-2 text-muted mb-1" style={{ fontSize: '0.8rem' }}>
                <Calendar size={14} />
                <span>Date & Time</span>
              </div>
              <p className="fw-semibold text-primary mb-0" style={{ fontSize: '0.875rem' }}>
                {notification.date} at {notification.time}
              </p>
            </div>

            <div className="col-6">
              <div className="d-flex align-items-center gap-2 text-muted mb-1" style={{ fontSize: '0.8rem' }}>
                <CheckCircle2 size={14} />
                <span>Read Status</span>
              </div>
              <span className={`badge ${notification.isRead ? 'bg-success' : 'bg-warning'}`}>
                {notification.isRead ? 'Read' : 'Unread'}
              </span>
            </div>

            {notification.doctorName && (
              <div className="col-6">
                <div className="d-flex align-items-center gap-2 text-muted mb-1" style={{ fontSize: '0.8rem' }}>
                  <Stethoscope size={14} />
                  <span>Related Doctor</span>
                </div>
                <p className="fw-semibold text-primary mb-0" style={{ fontSize: '0.875rem' }}>
                  {notification.doctorName}
                </p>
              </div>
            )}

            {notification.patientName && (
              <div className="col-6">
                <div className="d-flex align-items-center gap-2 text-muted mb-1" style={{ fontSize: '0.8rem' }}>
                  <User size={14} />
                  <span>Related Patient</span>
                </div>
                <p className="fw-semibold text-primary mb-0" style={{ fontSize: '0.875rem' }}>
                  {notification.patientName}
                </p>
              </div>
            )}

            {notification.appointmentId && (
              <div className="col-12 mt-2 p-3 bg-primary-subtle rounded-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-primary fw-semibold" style={{ fontSize: '0.825rem' }}>
                      Associated Appointment Reference
                    </span>
                    <h5 className="mb-0 text-primary fw-bold">{notification.appointmentId}</h5>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm px-3"
                    onClick={() => {
                      onClose();
                      onViewAppointment(notification.appointmentId);
                    }}
                  >
                    View Appointment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary px-4" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailsModal;
