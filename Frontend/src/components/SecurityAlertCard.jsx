import React from 'react';
import { ShieldAlert, CheckCircle2, Eye, XCircle } from 'lucide-react';

const SecurityAlertCard = ({ alert, onDismiss, onMarkReviewed, onViewDetails }) => {
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'Critical':
        return <span className="severity-badge severity-critical">Critical Security Event</span>;
      case 'Warning':
        return <span className="severity-badge severity-warning">Warning Event</span>;
      default:
        return <span className="severity-badge severity-normal">Normal Activity</span>;
    }
  };

  return (
    <div className={`security-alert-card ${alert.severity === 'Warning' ? 'warning' : ''}`}>
      <div className="d-flex align-items-start gap-3">
        <div className="p-2 rounded-circle bg-danger-subtle text-danger">
          <ShieldAlert size={22} />
        </div>
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            {getSeverityBadge(alert.severity)}
            <span className="text-muted" style={{ fontSize: '0.775rem' }}>{alert.timestamp}</span>
          </div>
          <h5 className="fw-bold mb-1 text-dark" style={{ fontSize: '0.975rem' }}>{alert.title}</h5>
          <p className="text-secondary mb-0" style={{ fontSize: '0.85rem' }}>{alert.description}</p>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2">
        <button 
          type="button" 
          className="btn btn-sm btn-outline-primary"
          onClick={() => onViewDetails(alert)}
        >
          <Eye size={14} className="me-1" />
          Details
        </button>
        <button 
          type="button" 
          className="btn btn-sm btn-outline-success"
          onClick={() => onMarkReviewed(alert.id)}
        >
          <CheckCircle2 size={14} className="me-1" />
          Reviewed
        </button>
        <button 
          type="button" 
          className="btn btn-sm btn-outline-secondary"
          onClick={() => onDismiss(alert.id)}
        >
          <XCircle size={14} />
        </button>
      </div>
    </div>
  );
};

export default SecurityAlertCard;
