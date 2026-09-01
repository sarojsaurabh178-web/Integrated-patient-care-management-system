import React, { useState } from 'react';
import { Play, CheckCircle2, AlertTriangle, RefreshCw, Lock, ShieldOff, ServerCrash, FileQuestion } from 'lucide-react';

const ApiDemoCard = ({ api }) => {
  const [activeState, setActiveState] = useState('200'); // '200', 'loading', '401', '403', '404', '500'
  const [isSimulating, setIsSimulating] = useState(false);

  const getMethodBadgeClass = (method) => {
    switch (method) {
      case 'GET': return 'method-get';
      case 'POST': return 'method-post';
      case 'PUT': return 'method-put';
      case 'DELETE': return 'method-delete';
      default: return 'method-get';
    }
  };

  const handleSimulateRequest = (stateKey) => {
    setIsSimulating(true);
    setActiveState('loading');
    setTimeout(() => {
      setActiveState(stateKey);
      setIsSimulating(false);
    }, 600);
  };

  const getResponseContent = () => {
    switch (activeState) {
      case 'loading':
        return {
          code: '...',
          status: 'Sending Request...',
          badgeClass: 'bg-warning text-dark',
          body: '// Request sent to Flask server...\n// Waiting for response headers...'
        };
      case '200':
        return {
          code: api.responseCode || 200,
          status: api.statusText || '200 OK',
          badgeClass: 'bg-success',
          body: api.responseBody
        };
      case '401':
        return {
          code: 401,
          status: '401 Unauthorized',
          badgeClass: 'bg-danger',
          body: JSON.stringify({
            error: 'Unauthorized',
            message: 'Missing or expired JWT Bearer token. Please log in again.'
          }, null, 2)
        };
      case '403':
        return {
          code: 403,
          status: '403 Forbidden',
          badgeClass: 'bg-danger',
          body: JSON.stringify({
            error: 'Forbidden',
            message: 'User role does not possess permissions to access this endpoint.'
          }, null, 2)
        };
      case '404':
        return {
          code: 404,
          status: '404 Not Found',
          badgeClass: 'bg-warning text-dark',
          body: JSON.stringify({
            error: 'Not Found',
            message: `Resource at ${api.endpoint} does not exist.`
          }, null, 2)
        };
      case '500':
        return {
          code: 500,
          status: '500 Server Error',
          badgeClass: 'bg-danger',
          body: JSON.stringify({
            error: 'Internal Server Error',
            message: 'Database connection failed or unhandled server exception.'
          }, null, 2)
        };
      default:
        return {
          code: 200,
          status: '200 OK',
          badgeClass: 'bg-success',
          body: api.responseBody
        };
    }
  };

  const currentResp = getResponseContent();

  return (
    <div className="api-card">
      <div className="api-card-header">
        <div className="d-flex align-items-center gap-3">
          <span className={`http-method-badge ${getMethodBadgeClass(api.method)}`}>
            {api.method}
          </span>
          <span className="fw-bold text-dark font-monospace" style={{ fontSize: '1rem' }}>
            {api.endpoint}
          </span>
        </div>
        <span className="badge bg-light text-muted border">
          {api.category}
        </span>
      </div>

      <div className="p-3">
        <p className="text-secondary mb-3" style={{ fontSize: '0.875rem' }}>
          <strong>Purpose:</strong> {api.purpose}
        </p>

        {/* State Toggle Buttons */}
        <div className="d-flex align-items-center gap-2 flex-wrap mb-3 p-2 bg-light rounded">
          <span className="text-muted fw-semibold me-2" style={{ fontSize: '0.75rem' }}>
            Simulate REST State:
          </span>
          <button 
            type="button" 
            className={`btn btn-xs ${activeState === '200' ? 'btn-success' : 'btn-outline-success'}`}
            style={{ fontSize: '0.75rem', padding: '2px 8px' }}
            onClick={() => handleSimulateRequest('200')}
          >
            200 / 201 Success
          </button>
          <button 
            type="button" 
            className={`btn btn-xs ${activeState === '401' ? 'btn-danger' : 'btn-outline-danger'}`}
            style={{ fontSize: '0.75rem', padding: '2px 8px' }}
            onClick={() => handleSimulateRequest('401')}
          >
            401 Unauthorized
          </button>
          <button 
            type="button" 
            className={`btn btn-xs ${activeState === '403' ? 'btn-danger' : 'btn-outline-danger'}`}
            style={{ fontSize: '0.75rem', padding: '2px 8px' }}
            onClick={() => handleSimulateRequest('403')}
          >
            403 Forbidden
          </button>
          <button 
            type="button" 
            className={`btn btn-xs ${activeState === '404' ? 'btn-warning' : 'btn-outline-warning'}`}
            style={{ fontSize: '0.75rem', padding: '2px 8px' }}
            onClick={() => handleSimulateRequest('404')}
          >
            404 Not Found
          </button>
          <button 
            type="button" 
            className={`btn btn-xs ${activeState === '500' ? 'btn-dark' : 'btn-outline-dark'}`}
            style={{ fontSize: '0.75rem', padding: '2px 8px' }}
            onClick={() => handleSimulateRequest('500')}
          >
            500 Server Error
          </button>
        </div>

        {/* Request & Response Split */}
        <div className="row g-3">
          <div className="col-md-6">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="text-muted fw-semibold" style={{ fontSize: '0.775rem' }}>HTTP REQUEST</span>
            </div>
            {api.requestHeader && (
              <div className="mb-2">
                <span className="text-muted" style={{ fontSize: '0.725rem' }}>Headers:</span>
                <pre className="api-code-block m-0 p-2" style={{ fontSize: '0.75rem' }}>
                  {api.requestHeader}
                </pre>
              </div>
            )}
            {api.requestBody ? (
              <div>
                <span className="text-muted" style={{ fontSize: '0.725rem' }}>Request Payload (JSON):</span>
                <pre className="api-code-block m-0 p-2">
                  {api.requestBody}
                </pre>
              </div>
            ) : (
              <div className="p-3 bg-light rounded text-center text-muted" style={{ fontSize: '0.8rem' }}>
                No request body required for this method.
              </div>
            )}
          </div>

          <div className="col-md-6">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="text-muted fw-semibold" style={{ fontSize: '0.775rem' }}>HTTP RESPONSE</span>
              <span className={`badge ${currentResp.badgeClass}`}>
                {currentResp.status}
              </span>
            </div>
            <pre className="api-code-block m-0 p-2" style={{ minHeight: '140px' }}>
              {currentResp.body}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDemoCard;
