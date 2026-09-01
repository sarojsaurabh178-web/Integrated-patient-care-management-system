import React from 'react';

const SecurityEventTable = ({ events }) => {
  return (
    <div className="audit-table-container">
      <div className="table-responsive">
        <table className="audit-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Event</th>
              <th>Date</th>
              <th>Time</th>
              <th>IP Address</th>
              <th>Status</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody>
            {events.map((evt) => (
              <tr key={evt.id}>
                <td className="fw-semibold text-dark">{evt.user}</td>
                <td>{evt.event}</td>
                <td className="text-muted">{evt.date}</td>
                <td className="text-muted">{evt.time}</td>
                <td><code style={{ fontSize: '0.8rem' }}>{evt.ipAddress}</code></td>
                <td>
                  <span className="badge bg-light text-dark border">
                    {evt.status}
                  </span>
                </td>
                <td>
                  <span className={`severity-badge ${
                    evt.severity === 'Critical' ? 'severity-critical' :
                    evt.severity === 'Warning' ? 'severity-warning' : 'severity-normal'
                  }`}>
                    {evt.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SecurityEventTable;
