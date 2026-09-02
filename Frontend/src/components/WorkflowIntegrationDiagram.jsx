import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldAlert, Lock, BellRing, FileText } from 'lucide-react';

const WorkflowIntegrationDiagram = () => {
  const [activeWorkflow, setActiveWorkflow] = useState('appointment');

  return (
    <div className="card-rounded p-4 mb-4">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 pb-2 border-bottom">
        <div>
          <h4 className="h6 fw-bold text-dark mb-1">
            Notification & Security System Integration Workflows
          </h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.825rem' }}>
            Interactive demonstration showing how notification, authentication, audit logs, and security monitoring interlink.
          </p>
        </div>

        <div className="btn-group btn-group-sm">
          <button
            type="button"
            className={`btn ${activeWorkflow === 'appointment' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveWorkflow('appointment')}
          >
            1. Appointment Creation Flow
          </button>
          <button
            type="button"
            className={`btn ${activeWorkflow === 'failed_login' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveWorkflow('failed_login')}
          >
            2. Failed Login Security Flow
          </button>
          <button
            type="button"
            className={`btn ${activeWorkflow === 'unauthorized' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveWorkflow('unauthorized')}
          >
            3. Unauthorized Access Flow
          </button>
        </div>
      </div>

      {activeWorkflow === 'appointment' && (
        <div className="p-3 bg-light rounded-3">
          <h5 className="fw-bold text-success mb-3" style={{ fontSize: '0.925rem' }}>
            Workflow 1: Appointment Scheduling & Notification Dispatch
          </h5>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 text-center">
            <div className="p-3 bg-white border rounded shadow-sm flex-fill">
              <FileText className="text-primary mb-1" size={20} />
              <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Appointment Created</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>OPD Booking #A101</div>
            </div>
            <ArrowRight className="text-muted" size={18} />
            <div className="p-3 bg-white border rounded shadow-sm flex-fill">
              <BellRing className="text-warning mb-1" size={20} />
              <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Notification Generated</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Queued in System</div>
            </div>
            <ArrowRight className="text-muted" size={18} />
            <div className="p-3 bg-white border rounded shadow-sm flex-fill">
              <CheckCircle2 className="text-success mb-1" size={20} />
              <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Patient Reminder Sent</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Navbar Bell & SMS</div>
            </div>
            <ArrowRight className="text-muted" size={18} />
            <div className="p-3 bg-white border rounded shadow-sm flex-fill">
              <FileText className="text-info mb-1" size={20} />
              <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>User Activity Logged</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Audit Log Entry Created</div>
            </div>
          </div>
        </div>
      )}

      {activeWorkflow === 'failed_login' && (
        <div className="p-3 bg-light rounded-3">
          <h5 className="fw-bold text-danger mb-3" style={{ fontSize: '0.925rem' }}>
            Workflow 2: Failed Login & Security Alert Audit Generation
          </h5>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 text-center">
            <div className="p-3 bg-white border rounded shadow-sm flex-fill">
              <Lock className="text-danger mb-1" size={20} />
              <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Wrong Password Entered</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Invalid Password Input</div>
            </div>
            <ArrowRight className="text-muted" size={18} />
            <div className="p-3 bg-white border rounded shadow-sm flex-fill">
              <ShieldAlert className="text-danger mb-1" size={20} />
              <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Login Failed (401)</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Authentication Rejected</div>
            </div>
            <ArrowRight className="text-muted" size={18} />
            <div className="p-3 bg-white border rounded shadow-sm flex-fill">
              <ShieldAlert className="text-warning mb-1" size={20} />
              <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Security Event Created</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Severity: Warning</div>
            </div>
            <ArrowRight className="text-muted" size={18} />
            <div className="p-3 bg-white border rounded shadow-sm flex-fill">
              <FileText className="text-dark mb-1" size={20} />
              <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Audit Log Updated</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Logged in Admin Audit</div>
            </div>
          </div>
        </div>
      )}

      {activeWorkflow === 'unauthorized' && (
        <div className="p-3 bg-light rounded-3">
          <h5 className="fw-bold text-warning mb-3" style={{ fontSize: '0.925rem' }}>
            Workflow 3: Patient Cross-Record Access Denial & Security Escalation
          </h5>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 text-center">
            <div className="p-3 bg-white border rounded shadow-sm flex-fill">
              <FileText className="text-warning mb-1" size={20} />
              <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Patient Access Request</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Target: Patient P102</div>
            </div>
            <ArrowRight className="text-muted" size={18} />
            <div className="p-3 bg-white border rounded shadow-sm flex-fill">
              <Lock className="text-danger mb-1" size={20} />
              <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Authorization Failed</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Tenant Ownership Check</div>
            </div>
            <ArrowRight className="text-muted" size={18} />
            <div className="p-3 bg-white border rounded shadow-sm flex-fill">
              <ShieldAlert className="text-danger mb-1" size={20} />
              <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Access Denied (403)</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>403 Error Rendered</div>
            </div>
            <ArrowRight className="text-muted" size={18} />
            <div className="p-3 bg-white border rounded shadow-sm flex-fill">
              <ShieldAlert className="text-dark mb-1" size={20} />
              <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Security Event Logged</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Admin Dashboard Alert</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowIntegrationDiagram;
