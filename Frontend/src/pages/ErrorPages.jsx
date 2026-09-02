import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import { ShieldX, Lock, FileQuestion, ServerCrash, Home } from 'lucide-react';

const ErrorPages = ({ setActiveTab }) => {
  const [activeErrorCode, setActiveErrorCode] = useState('403'); // '401', '403', '404', '500'

  const getErrorContent = () => {
    switch (activeErrorCode) {
      case '401':
        return {
          code: '401',
          title: 'Unauthorized Access',
          message: 'Authentication is required to access this resource.',
          explanation: 'Your JWT session has expired or valid Bearer credentials were not provided. Please sign in to re-authenticate.',
          icon: <Lock size={48} className="text-warning" />,
          colorClass: 'text-warning'
        };
      case '403':
        return {
          code: '403',
          title: 'Access Denied',
          message: 'You do not have permission to access this resource.',
          explanation: 'Your role scope does not grant privilege to view or edit this resource. Please contact system admin if you believe this is an error.',
          icon: <ShieldX size={48} className="text-danger" />,
          colorClass: 'text-danger'
        };
      case '404':
        return {
          code: '404',
          title: 'Page / Resource Not Found',
          message: 'The requested route or medical record does not exist.',
          explanation: 'The URL path may be mistyped or the requested patient ID or appointment record has been archived.',
          icon: <FileQuestion size={48} className="text-primary" />,
          colorClass: 'text-primary'
        };
      case '500':
        return {
          code: '500',
          title: 'Internal Server Error',
          message: 'An unexpected exception occurred on the application server.',
          explanation: 'The Flask REST service or database connection timed out. Telemetry logs have recorded this incident.',
          icon: <ServerCrash size={48} className="text-dark" />,
          colorClass: 'text-dark'
        };
      default:
        return {
          code: '403',
          title: 'Access Denied',
          message: 'You do not have permission to access this resource.',
          explanation: 'Your role scope does not grant privilege to view or edit this resource.',
          icon: <ShieldX size={48} className="text-danger" />,
          colorClass: 'text-danger'
        };
    }
  };

  const err = getErrorContent();

  return (
    <div className="error-pages-wrapper pb-5">
      <Breadcrumb activeTab="error_pages" setActiveTab={setActiveTab} />

      {/* Switcher Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <span className="text-muted fw-semibold" style={{ fontSize: '0.875rem' }}>
          PREVIEW SYSTEM ERROR PAGES:
        </span>
        <div className="btn-group">
          <button
            type="button"
            className={`btn btn-sm ${activeErrorCode === '401' ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={() => setActiveErrorCode('401')}
          >
            401 Unauthorized
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeErrorCode === '403' ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => setActiveErrorCode('403')}
          >
            403 Forbidden
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeErrorCode === '404' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveErrorCode('404')}
          >
            404 Not Found
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeErrorCode === '500' ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => setActiveErrorCode('500')}
          >
            500 Server Error
          </button>
        </div>
      </div>

      {/* Render Error Page */}
      <div className="error-page-container bg-white rounded-3 border p-5 shadow-sm">
        <div className="mb-3">{err.icon}</div>
        <div className={`error-code-badge ${err.colorClass}`}>{err.code}</div>
        <h2 className="error-page-title">{err.title}</h2>
        <p className="fw-semibold text-secondary mb-2" style={{ fontSize: '1.05rem' }}>
          "{err.message}"
        </p>
        <p className="error-page-desc">{err.explanation}</p>

        <button
          type="button"
          className="btn btn-primary px-4 py-2 d-inline-flex align-items-center gap-2"
          onClick={() => setActiveTab('dashboard')}
        >
          <Home size={18} />
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default ErrorPages;
