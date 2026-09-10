import React, { useState } from 'react';
import { ArrowRight, ArrowDown, ShieldCheck, Key, Lock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const JwtFlowDiagram = () => {
  const [authStatus, setAuthStatus] = useState('Authenticated'); // 'Authenticated', 'Unauthenticated'
  const [tokenStatus, setTokenStatus] = useState('Valid'); // 'Valid', 'Expired', 'Tampered'
  const [sessionStatus, setSessionStatus] = useState('Active'); // 'Active', 'Terminated'

  const toggleAuth = () => {
    if (authStatus === 'Authenticated') {
      setAuthStatus('Unauthenticated');
      setTokenStatus('Expired');
      setSessionStatus('Terminated');
    } else {
      setAuthStatus('Authenticated');
      setTokenStatus('Valid');
      setSessionStatus('Active');
    }
  };

  const renderArrow = () => (
    <div className="jwt-step-arrow">
      <ArrowRight size={20} className="jwt-arrow-desktop" />
      <ArrowDown size={20} className="jwt-arrow-mobile" />
    </div>
  );

  return (
    <div className="jwt-flow-container">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 pb-3 border-bottom">
        <div>
          <h3 className="h5 fw-bold text-primary mb-1">JWT Authentication Flow Architecture</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
            Visual representation of token issuance, verification, and role header protection for Python Flask REST integration.
          </p>
        </div>
        <button 
          type="button" 
          className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1"
          onClick={toggleAuth}
        >
          <RefreshCw size={14} />
          Toggle Live Demo State
        </button>
      </div>

      {/* Live System Status Banner */}
      <div className="d-flex flex-wrap gap-4 my-3 p-3 bg-light rounded-3 align-items-center justify-content-around">
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 500 }}>
            Authentication Status:
          </span>
          <span className={`status-pill ${authStatus === 'Authenticated' ? 'status-pill-success' : 'status-pill-danger'}`}>
            ● {authStatus}
          </span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 500 }}>
            Token Status:
          </span>
          <span className={`status-pill ${tokenStatus === 'Valid' ? 'status-pill-success' : 'status-pill-warning'}`}>
            ● {tokenStatus}
          </span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 500 }}>
            Session:
          </span>
          <span className={`status-pill ${sessionStatus === 'Active' ? 'status-pill-success' : 'status-pill-danger'}`}>
            ● {sessionStatus}
          </span>
        </div>
      </div>

      {/* Step Flow Nodes */}
      <div className="jwt-flow-steps">
        <div className="jwt-step-box">
          <div className="fw-bold text-primary mb-1" style={{ fontSize: '0.85rem' }}>STEP 1</div>
          <div className="fw-semibold text-primary" style={{ fontSize: '0.9rem' }}>Username + Password</div>
          <div className="text-muted" style={{ fontSize: '0.75rem' }}>POST /api/v1/auth/login</div>
        </div>

        {renderArrow()}

        <div className="jwt-step-box">
          <div className="fw-bold text-primary mb-1" style={{ fontSize: '0.85rem' }}>STEP 2</div>
          <div className="fw-semibold text-primary" style={{ fontSize: '0.9rem' }}>Backend Verification</div>
          <div className="text-muted" style={{ fontSize: '0.75rem' }}>Password hash match check</div>
        </div>

        {renderArrow()}

        <div className="jwt-step-box">
          <div className="fw-bold text-primary mb-1" style={{ fontSize: '0.85rem' }}>STEP 3</div>
          <div className="fw-semibold text-primary" style={{ fontSize: '0.9rem' }}>Login Successful</div>
          <div className="text-muted" style={{ fontSize: '0.75rem' }}>HTTP 200 Response</div>
        </div>

        {renderArrow()}

        <div className="jwt-step-box active-step">
          <div className="fw-bold mb-1" style={{ fontSize: '0.85rem' }}>STEP 4</div>
          <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>JWT Token Issued</div>
          <div style={{ fontSize: '0.75rem' }}>HMAC-SHA256 Bearer Token</div>
        </div>

        {renderArrow()}

        <div className="jwt-step-box">
          <div className="fw-bold text-primary mb-1" style={{ fontSize: '0.85rem' }}>STEP 5</div>
          <div className="fw-semibold text-primary" style={{ fontSize: '0.9rem' }}>Protected Request</div>
          <div className="text-muted" style={{ fontSize: '0.75rem' }}>Authorization: Bearer &lt;jwt&gt;</div>
        </div>

        {renderArrow()}

        <div className="jwt-step-box">
          <div className="fw-bold text-primary mb-1" style={{ fontSize: '0.85rem' }}>STEP 6</div>
          <div className="fw-semibold text-primary" style={{ fontSize: '0.9rem' }}>Token Verification</div>
          <div className="text-muted" style={{ fontSize: '0.75rem' }}>Role & Scope Check</div>
        </div>
      </div>

      {/* Code Snippet Token Preview */}
      <div className="mt-4 p-3 bg-light rounded-3">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="fw-bold text-primary" style={{ fontSize: '0.85rem' }}>
            Simulated Decoded JWT Payload:
          </span>
          <span className="badge bg-secondary" style={{ fontSize: '0.75rem' }}>
            Algorithm: HS256
          </span>
        </div>
        <div className="api-code-block">
{`{
  "sub": "USR-88219",
  "name": "Dr. Sarah Jenkins",
  "role": "DOCTOR",
  "permissions": ["read:patient", "write:consultation", "create:prescription"],
  "iat": ${Math.floor(Date.now() / 1000)},
  "exp": ${Math.floor(Date.now() / 1000) + 3600},
  "iss": "https://api.meditrack.org/auth"
}`}
        </div>
      </div>
    </div>
  );
};

export default JwtFlowDiagram;
