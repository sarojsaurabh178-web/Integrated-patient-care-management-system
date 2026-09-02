import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import SecurityEventTable from '../components/SecurityEventTable';
import SecurityAlertCard from '../components/SecurityAlertCard';
import WorkflowIntegrationDiagram from '../components/WorkflowIntegrationDiagram';
import { 
  ShieldAlert, 
  Lock, 
  UserX, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  TrendingUp,
  Filter,
  BarChart2,
  PieChart
} from 'lucide-react';

const SecurityMonitoring = ({ 
  securityEvents, 
  securityAlerts, 
  setSecurityAlerts, 
  setActiveTab 
}) => {
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState('ALL');
  const [activeTabSubView, setActiveTabSubView] = useState('overview'); // 'overview', 'alerts', 'workflows'

  const totalEventsCount = securityEvents.length;
  const failedLoginsCount = securityEvents.filter(e => e.event === 'Failed Login').length;
  const unauthorizedCount = securityEvents.filter(e => e.event.includes('Unauthorized')).length;
  const successfulLoginsCount = securityEvents.filter(e => e.event === 'Successful Login').length;
  const suspiciousCount = securityEvents.filter(e => e.severity === 'Critical').length;

  const filteredEvents = securityEvents.filter(evt => {
    if (selectedSeverityFilter === 'ALL') return true;
    return evt.severity === selectedSeverityFilter;
  });

  const handleDismissAlert = (id) => {
    setSecurityAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleMarkReviewed = (id) => {
    setSecurityAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Reviewed' } : a));
  };

  const handleViewAlertDetails = (alert) => {
    alert(`Security Event Detail:\n\nTitle: ${alert.title}\nDescription: ${alert.description}\nSeverity: ${alert.severity}\nIP: ${alert.ip}`);
  };

  return (
    <div className="security-monitoring-page pb-5">
      <Breadcrumb activeTab="security_monitoring" setActiveTab={setActiveTab} />

      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Security Monitoring & Threat Dashboard</h1>
          <p className="text-muted mb-0">
            Real-time audit telemetry, unauthorized intrusion detection, and active threat response.
          </p>
        </div>

        <div className="btn-group">
          <button
            type="button"
            className={`btn btn-sm ${activeTabSubView === 'overview' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTabSubView('overview')}
          >
            Overview & Telemetry
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTabSubView === 'alerts' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTabSubView('alerts')}
          >
            Active Security Alerts ({securityAlerts.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTabSubView === 'workflows' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTabSubView('workflows')}
          >
            Integrated Flow Visualizers
          </button>
        </div>
      </div>

      {/* Top Security Metric Cards */}
      <div className="security-metrics-grid">
        <div className="sec-metric-card">
          <div className="sec-metric-icon bg-primary-subtle text-primary">
            <Activity size={24} />
          </div>
          <div>
            <div className="text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Total Security Events</div>
            <div className="h4 fw-bold text-dark mb-0">{totalEventsCount}</div>
            <div className="text-success fw-semibold" style={{ fontSize: '0.725rem' }}>↑ Telemetry active</div>
          </div>
        </div>

        <div className="sec-metric-card">
          <div className="sec-metric-icon bg-warning-subtle text-warning-emphasis">
            <Lock size={24} />
          </div>
          <div>
            <div className="text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Failed Login Attempts</div>
            <div className="h4 fw-bold text-dark mb-0">{failedLoginsCount}</div>
            <div className="text-warning-emphasis fw-semibold" style={{ fontSize: '0.725rem' }}>Rate limits enforced</div>
          </div>
        </div>

        <div className="sec-metric-card">
          <div className="sec-metric-icon bg-danger-subtle text-danger">
            <UserX size={24} />
          </div>
          <div>
            <div className="text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Unauthorized Access Attempts</div>
            <div className="h4 fw-bold text-dark mb-0">{unauthorizedCount}</div>
            <div className="text-danger fw-semibold" style={{ fontSize: '0.725rem' }}>HTTP 403 Blocked</div>
          </div>
        </div>

        <div className="sec-metric-card">
          <div className="sec-metric-icon bg-success-subtle text-success">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Successful Logins</div>
            <div className="h4 fw-bold text-dark mb-0">{successfulLoginsCount}</div>
            <div className="text-success fw-semibold" style={{ fontSize: '0.725rem' }}>100% MFA verified</div>
          </div>
        </div>

        <div className="sec-metric-card">
          <div className="sec-metric-icon bg-dark text-white">
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Suspicious Activities</div>
            <div className="h4 fw-bold text-dark mb-0">{suspiciousCount}</div>
            <div className="text-danger fw-semibold" style={{ fontSize: '0.725rem' }}>Critical alerts</div>
          </div>
        </div>
      </div>

      {activeTabSubView === 'overview' && (
        <>
          {/* Charts & Graphical Telemetry */}
          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div className="card-rounded p-4 h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h4 className="h6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <BarChart2 size={18} className="text-primary" />
                    Authentication & Security Event Activity (24H Timeline)
                  </h4>
                  <span className="badge bg-light text-muted border">Live Frontend Chart</span>
                </div>

                {/* SVG/CSS Custom Activity Bar Chart */}
                <div className="p-3 bg-light rounded-3" style={{ height: '220px', position: 'relative' }}>
                  <div className="d-flex align-items-end justify-content-between h-100 pt-4 px-3" style={{ gap: '12px' }}>
                    {[
                      { hour: '00:00', success: 12, failed: 1, critical: 0 },
                      { hour: '04:00', success: 5, failed: 0, critical: 0 },
                      { hour: '08:00', success: 42, failed: 4, critical: 1 },
                      { hour: '10:00', success: 85, failed: 9, critical: 2 },
                      { hour: '12:00', success: 64, failed: 3, critical: 1 },
                      { hour: '14:00', success: 50, failed: 2, critical: 0 },
                      { hour: '16:00', success: 70, failed: 5, critical: 0 },
                      { hour: '20:00', success: 28, failed: 2, critical: 0 }
                    ].map((item, idx) => (
                      <div key={idx} className="d-flex flex-column align-items-center flex-fill h-100 justify-content-end">
                        <div className="d-flex align-items-end gap-1 w-100 justify-content-center" style={{ height: '80%' }}>
                          <div className="bg-primary rounded-top" style={{ height: `${item.success}%`, width: '12px' }} title={`Success: ${item.success}`} />
                          <div className="bg-warning rounded-top" style={{ height: `${item.failed * 8}%`, width: '10px' }} title={`Failed: ${item.failed}`} />
                          {item.critical > 0 && (
                            <div className="bg-danger rounded-top" style={{ height: `${item.critical * 30}%`, width: '8px' }} title={`Critical: ${item.critical}`} />
                          )}
                        </div>
                        <span className="text-muted mt-2" style={{ fontSize: '0.725rem' }}>{item.hour}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-center gap-4 mt-3 text-sm">
                  <div className="d-flex align-items-center gap-2">
                    <span className="d-inline-block rounded-circle bg-primary" style={{ width: 10, height: 10 }}></span>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>Successful Logins</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="d-inline-block rounded-circle bg-warning" style={{ width: 10, height: 10 }}></span>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>Failed Attempts</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="d-inline-block rounded-circle bg-danger" style={{ width: 10, height: 10 }}></span>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>Critical Events</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card-rounded p-4 h-100">
                <h4 className="h6 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <PieChart size={18} className="text-secondary" />
                  Security Event Severity Breakdown
                </h4>

                <div className="p-3 bg-light rounded-3 text-center mb-3">
                  <div className="display-6 fw-bold text-dark">{securityEvents.length}</div>
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>Events Evaluated</span>
                </div>

                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-center justify-content-between p-2 rounded bg-success-subtle">
                    <span className="fw-semibold text-success" style={{ fontSize: '0.85rem' }}>Normal Severity</span>
                    <span className="badge bg-success">
                      {securityEvents.filter(e => e.severity === 'Normal').length}
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between p-2 rounded bg-warning-subtle">
                    <span className="fw-semibold text-warning-emphasis" style={{ fontSize: '0.85rem' }}>Warning Severity</span>
                    <span className="badge bg-warning text-dark">
                      {securityEvents.filter(e => e.severity === 'Warning').length}
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between p-2 rounded bg-danger-subtle">
                    <span className="fw-semibold text-danger" style={{ fontSize: '0.85rem' }}>Critical Severity</span>
                    <span className="badge bg-danger">
                      {securityEvents.filter(e => e.severity === 'Critical').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Event Table Section */}
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="h5 fw-bold text-dark mb-0">System Security Event Log Table</h3>
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Severity Filter:</span>
                <select
                  className="form-select form-select-sm"
                  style={{ width: 'auto' }}
                  value={selectedSeverityFilter}
                  onChange={(e) => setSelectedSeverityFilter(e.target.value)}
                >
                  <option value="ALL">All Severities</option>
                  <option value="Normal">Normal</option>
                  <option value="Warning">Warning</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <SecurityEventTable events={filteredEvents} />
          </div>
        </>
      )}

      {activeTabSubView === 'alerts' && (
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h3 className="h5 fw-bold text-dark mb-0">Active Security Alert Cards</h3>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              Showing {securityAlerts.length} unresolved threat cards
            </span>
          </div>

          {securityAlerts.length > 0 ? (
            securityAlerts.map(alert => (
              <SecurityAlertCard
                key={alert.id}
                alert={alert}
                onDismiss={handleDismissAlert}
                onMarkReviewed={handleMarkReviewed}
                onViewDetails={handleViewAlertDetails}
              />
            ))
          ) : (
            <div className="text-center py-5 bg-white rounded-3 border">
              <CheckCircle2 size={40} className="text-success mb-2" />
              <h5 className="h6 text-success">All security alerts resolved or dismissed!</h5>
            </div>
          )}
        </div>
      )}

      {activeTabSubView === 'workflows' && (
        <WorkflowIntegrationDiagram />
      )}
    </div>
  );
};

export default SecurityMonitoring;
