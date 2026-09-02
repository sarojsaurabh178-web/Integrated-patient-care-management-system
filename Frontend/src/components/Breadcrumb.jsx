import React from 'react';
import { Home, ChevronRight } from 'lucide-react';

const Breadcrumb = ({ activeTab, setActiveTab }) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'patients':
        return 'Patient Registration';
      case 'appointments':
        return 'Appointment Scheduling';
      default:
        return 'Dashboard';
    }
  };

  return (
    <nav className="breadcrumb-container" aria-label="Breadcrumb">
      <button 
        type="button" 
        className="breadcrumb-item" 
        onClick={() => setActiveTab('dashboard')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <Home size={15} />
        <span>Dashboard</span>
      </button>

      {activeTab !== 'dashboard' && (
        <>
          <ChevronRight size={14} className="breadcrumb-separator" />
          <span className="breadcrumb-item active">{getTabTitle()}</span>
        </>
      )}
    </nav>
  );
};

export default Breadcrumb;
