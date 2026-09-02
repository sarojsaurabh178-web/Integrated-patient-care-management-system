import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import JwtFlowDiagram from '../components/JwtFlowDiagram';
import { ShieldCheck, Key, Code, Lock, Server, Cpu } from 'lucide-react';

const JwtAuthFlowPage = ({ setActiveTab }) => {
  return (
    <div className="jwt-page pb-5">
      <Breadcrumb activeTab="jwt_flow" setActiveTab={setActiveTab} />

      <div className="mb-4">
        <h1 className="h3 fw-bold text-dark mb-1">JWT Authentication & Developer Security Spec</h1>
        <p className="text-muted mb-0">
          Architectural overview of JSON Web Token (JWT) token lifecycle, authorization headers, and stateless session security.
        </p>
      </div>

      {/* Main Flow Visualizer */}
      <JwtFlowDiagram />

      {/* Security Architecture Cards */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card-rounded p-4 h-100">
            <div className="p-3 bg-primary-subtle text-primary rounded-circle d-inline-flex mb-3">
              <Key size={24} />
            </div>
            <h4 className="h6 fw-bold text-dark mb-2">Stateless JWT Bearer Header</h4>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
              Clients present the JWT in the HTTP Authorization header as <code>Authorization: Bearer &lt;token&gt;</code>. Eliminates database session lookups on every Flask REST request.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card-rounded p-4 h-100">
            <div className="p-3 bg-success-subtle text-success rounded-circle d-inline-flex mb-3">
              <ShieldCheck size={24} />
            </div>
            <h4 className="h6 fw-bold text-dark mb-2">Cryptographic HMAC Signature</h4>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
              Tokens are signed with <code>HMAC-SHA256</code> secret key. Tampered payloads or modified roles trigger instant signature verification failures and HTTP 401 Unauthorized codes.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card-rounded p-4 h-100">
            <div className="p-3 bg-warning-subtle text-warning-emphasis rounded-circle d-inline-flex mb-3">
              <Lock size={24} />
            </div>
            <h4 className="h6 fw-bold text-dark mb-2">Role-Based Scope Claims</h4>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
              Claims specify user permissions (<code>PATIENT</code>, <code>DOCTOR</code>, <code>ADMINISTRATOR</code>). Flask endpoints enforce role decorators before executing business logic.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JwtAuthFlowPage;
