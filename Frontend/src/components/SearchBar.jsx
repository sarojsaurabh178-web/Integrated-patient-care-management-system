import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm, totalPatients }) => {
  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search patients by name or Patient ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <span className="patient-count-badge">
        Total Registered: {totalPatients} {totalPatients === 1 ? 'Patient' : 'Patients'}
      </span>
    </div>
  );
};

export default SearchBar;
