import React from 'react';
import { ShieldX, AlertCircle, Inbox, RefreshCw, Home } from 'lucide-react';

export const LoadingSkeleton = ({ count = 3, height = '60px' }) => {
  return (
    <div className="d-flex flex-column gap-3 w-100">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-box" style={{ height, width: '100%' }} />
      ))}
    </div>
  );
};

export const EmptyState = ({ 
  title = 'No Records Found', 
  message = 'There are currently no items to display.',
  onAction,
  actionLabel = 'Refresh Data'
}) => {
  return (
    <div className="text-center py-5 px-3 bg-white rounded-3 border">
      <div className="d-inline-flex p-3 rounded-circle bg-light text-muted mb-3">
        <Inbox size={36} />
      </div>
      <h4 className="h6 fw-bold text-dark mb-1">{title}</h4>
      <p className="text-muted mb-3" style={{ fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto' }}>
        {message}
      </p>
      {onAction && (
        <button type="button" className="btn btn-sm btn-outline-primary" onClick={onAction}>
          <RefreshCw size={14} className="me-1" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const ErrorState = ({ 
  title = 'Something Went Wrong', 
  message = 'An unexpected error occurred while communicating with the server.',
  onRetry
}) => {
  return (
    <div className="text-center py-5 px-3 bg-danger-subtle rounded-3 border border-danger-subtle">
      <div className="d-inline-flex p-3 rounded-circle bg-danger text-white mb-3">
        <AlertCircle size={36} />
      </div>
      <h4 className="h5 fw-bold text-danger mb-1">{title}</h4>
      <p className="text-danger-emphasis mb-3" style={{ fontSize: '0.9rem', maxWidth: '450px', margin: '0 auto' }}>
        {message}
      </p>
      {onRetry && (
        <button type="button" className="btn btn-danger btn-sm px-4" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export const AccessDeniedComponent = ({ onReturnDashboard }) => {
  return (
    <div className="error-page-container">
      <div className="d-inline-flex p-3 rounded-circle bg-danger-subtle text-danger mb-3">
        <ShieldX size={48} />
      </div>
      <div className="error-code-badge text-danger">403</div>
      <h2 className="error-page-title">Access Denied</h2>
      <p className="error-page-desc">
        You do not have permission to access this resource. Your role does not possess the required scopes for this feature.
      </p>
      <button 
        type="button" 
        className="btn btn-primary px-4 py-2 d-inline-flex align-items-center gap-2"
        onClick={onReturnDashboard}
      >
        <Home size={18} />
        <span>Return to Dashboard</span>
      </button>
    </div>
  );
};
