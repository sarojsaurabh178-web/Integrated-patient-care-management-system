import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import ApiDemoCard from '../components/ApiDemoCard';
import { apiEndpoints } from '../data/mockApiEndpoints';
import { Code, Terminal, Server, ShieldCheck } from 'lucide-react';

const ApiDocumentationPage = ({ setActiveTab }) => {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const filteredEndpoints = apiEndpoints.filter(api => {
    if (activeCategory === 'ALL') return true;
    return api.category === activeCategory;
  });

  return (
    <div className="api-docs-page pb-5">
      <Breadcrumb activeTab="api_docs" setActiveTab={setActiveTab} />

      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">REST API Documentation & Interactive Tester</h1>
          <p className="text-muted mb-0">
            Developer reference specification for Python Flask REST API backend endpoints and JSON response schemas.
          </p>
        </div>

        <div className="btn-group btn-group-sm">
          <button
            type="button"
            className={`btn ${activeCategory === 'ALL' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveCategory('ALL')}
          >
            All Endpoints ({apiEndpoints.length})
          </button>
          <button
            type="button"
            className={`btn ${activeCategory === 'Patients Management' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveCategory('Patients Management')}
          >
            Patients
          </button>
          <button
            type="button"
            className={`btn ${activeCategory === 'Appointments Scheduling' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveCategory('Appointments Scheduling')}
          >
            Appointments
          </button>
          <button
            type="button"
            className={`btn ${activeCategory === 'Clinical OPD' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveCategory('Clinical OPD')}
          >
            Clinical
          </button>
          <button
            type="button"
            className={`btn ${activeCategory === 'Pharmacy & Prescriptions' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveCategory('Pharmacy & Prescriptions')}
          >
            Prescriptions
          </button>
        </div>
      </div>

      {/* Backend Integration Note Banner */}
      <div className="alert alert-info d-flex align-items-start gap-3 mb-4" role="alert">
        <Server className="text-info flex-shrink-0 mt-1" size={22} />
        <div>
          <h5 className="alert-heading fw-bold mb-1" style={{ fontSize: '0.95rem' }}>
            Flask REST API Architectural Readiness
          </h5>
          <p className="mb-0 text-secondary" style={{ fontSize: '0.85rem' }}>
            All requests shown below are prepared to accept JSON payloads and returns structured HTTP status codes (200 OK, 201 Created, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error). Use the interactive buttons on any card to test frontend handling of each API status state.
          </p>
        </div>
      </div>

      {/* Cards List */}
      <div className="api-cards-container">
        {filteredEndpoints.map(api => (
          <ApiDemoCard key={api.id} api={api} />
        ))}
      </div>
    </div>
  );
};

export default ApiDocumentationPage;
