import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import AuditLogTable from '../components/AuditLogTable';
import { ShieldCheck, FileSpreadsheet, Download } from 'lucide-react';

const AuditLogsPage = ({ auditLogs, setActiveTab }) => {
  const handleExportCSV = () => {
    alert('Simulated Audit Log CSV Export: Data exported for compliance archive.');
  };

  return (
    <div className="audit-logs-page pb-5">
      <Breadcrumb activeTab="audit_logs" setActiveTab={setActiveTab} />

      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Audit Logs</h1>
          <p className="text-muted mb-0">
            Immutable system audit trail tracking user interactions, EHR record views, and authorization decisions.
          </p>
        </div>

        <button 
          type="button" 
          className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
          onClick={handleExportCSV}
        >
          <Download size={16} />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* Main Filterable Audit Table */}
      <AuditLogTable logs={auditLogs} />
    </div>
  );
};

export default AuditLogsPage;
