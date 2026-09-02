import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

const AuditLogTable = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedAction, setSelectedAction] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = 
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm);

      const matchesRole = selectedRole === 'ALL' || log.role === selectedRole;
      const matchesStatus = selectedStatus === 'ALL' || log.status === selectedStatus;
      const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;
      const matchesDate = !dateFilter || log.timestamp.startsWith(dateFilter);

      return matchesSearch && matchesRole && matchesStatus && matchesAction && matchesDate;
    });
  }, [logs, searchTerm, selectedRole, selectedStatus, selectedAction, dateFilter]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const currentLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage]);

  return (
    <div className="audit-table-container">
      {/* Search & Filters Header */}
      <div className="audit-table-filters">
        <div className="flex-grow-1" style={{ minWidth: '220px' }}>
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-white">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search user, IP, action, resource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filter by Role */}
        <select 
          className="form-select form-select-sm" 
          style={{ width: 'auto' }}
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="ALL">All Roles</option>
          <option value="Doctor">Doctor</option>
          <option value="Administrator">Administrator</option>
          <option value="Patient">Patient</option>
          <option value="Guest">Guest</option>
        </select>

        {/* Filter by Action */}
        <select 
          className="form-select form-select-sm" 
          style={{ width: 'auto' }}
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
        >
          <option value="ALL">All Actions</option>
          <option value="Viewed Patient">Viewed Patient</option>
          <option value="Added Diagnosis">Added Diagnosis</option>
          <option value="Updated Patient">Updated Patient</option>
          <option value="Booked Appointment">Booked Appointment</option>
          <option value="Generated Prescription">Generated Prescription</option>
          <option value="Failed Login Attempt">Failed Login Attempt</option>
        </select>

        {/* Filter by Status */}
        <select 
          className="form-select form-select-sm" 
          style={{ width: 'auto' }}
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
          <option value="Denied">Denied</option>
        </select>

        {/* Date Filter */}
        <input
          type="date"
          className="form-control form-control-sm"
          style={{ width: 'auto' }}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="audit-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Timestamp</th>
              <th>IP Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.length > 0 ? (
              currentLogs.map((log) => (
                <tr key={log.id}>
                  <td className="fw-semibold">{log.user}</td>
                  <td>
                    <span className="badge bg-light text-dark border">
                      {log.role}
                    </span>
                  </td>
                  <td>{log.action}</td>
                  <td><code style={{ fontSize: '0.8rem' }}>{log.resource}</code></td>
                  <td className="text-muted">{log.timestamp}</td>
                  <td className="text-muted"><code style={{ fontSize: '0.8rem' }}>{log.ipAddress}</code></td>
                  <td>
                    <span className={`status-pill ${
                      log.status === 'Success' ? 'status-pill-success' :
                      log.status === 'Denied' ? 'status-pill-danger' : 'status-pill-warning'
                    }`}>
                      ● {log.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
                  No matching audit logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 bg-light border-top d-flex align-items-center justify-content-between">
        <span className="text-muted" style={{ fontSize: '0.825rem' }}>
          Showing {currentLogs.length} of {filteredLogs.length} entries
        </span>

        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogTable;
