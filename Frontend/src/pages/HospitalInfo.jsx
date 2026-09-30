import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  AlertTriangle,
  HeartPulse,
  Bed,
  CheckCircle2,
  Clock,
  PlusCircle,
  Edit2,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  Save,
  X,
  ShieldCheck,
  Activity,
  Layers,
  Info
} from 'lucide-react';
import hospitalManagementService from '../services/hospitalManagementService';

const WARD_OPTIONS = ['All', 'Cardiology ICU', 'Surgical ICU', 'General Ward A', 'General Ward B', 'Emergency Trauma Unit', 'Pediatric Care Unit'];
const TYPE_OPTIONS = ['All', 'ICU', 'General Ward', 'Emergency', 'Pediatric'];
const STATUS_OPTIONS = ['All', 'Available', 'Occupied', 'Reserved', 'Under Maintenance'];

const HospitalInfo = ({
  currentRole = 'ADMINISTRATOR',
  setActiveTab,
  setToast
}) => {
  const [hospitalData, setHospitalData] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBeds, setLoadingBeds] = useState(false);
  const [error, setError] = useState(null);

  // Filter State
  const [selectedWard, setSelectedWard] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Hospital Edit State (Admin only)
  const [isEditingHospital, setIsEditingHospital] = useState(false);
  const [hospForm, setHospForm] = useState({});
  const [savingHosp, setSavingHosp] = useState(false);

  // Bed Modal State (Create or Edit)
  const [bedModal, setBedModal] = useState({
    isOpen: false,
    mode: 'create', // create | edit
    bed: null
  });
  const [bedForm, setBedForm] = useState({
    bedNumber: '',
    ward: 'Cardiology ICU',
    type: 'ICU',
    floor: 'Floor 2',
    status: 'Available',
    patientName: '',
    notes: ''
  });
  const [bedFormError, setBedFormError] = useState('');
  const [savingBed, setSavingBed] = useState(false);

  // Fetch Hospital Info & Calculated Bed Telemetry
  const fetchHospitalInfo = async () => {
    try {
      const data = await hospitalManagementService.getHospitalInfo();
      if (data && data.status === 'success') {
        setHospitalData(data.hospital);
        setTelemetry(data.bedTelemetry);
        setHospForm({
          name: data.hospital.name,
          address: data.hospital.address,
          contactNumber: data.hospital.contactNumber,
          emergencyNumber: data.hospital.emergencyNumber,
          email: data.hospital.email || '',
          operatingHours: data.hospital.operatingHours || ''
        });
      }
    } catch (err) {
      console.error('Error fetching hospital info:', err);
      setError('Unable to load hospital records from database.');
    }
  };

  // Fetch Bed Records
  const fetchBeds = async () => {
    setLoadingBeds(true);
    try {
      const data = await hospitalManagementService.getBeds({
        ward: selectedWard,
        type: selectedType,
        status: selectedStatus,
        search: searchQuery
      });
      setBeds(data);
    } catch (err) {
      console.error('Error fetching beds:', err);
    } finally {
      setLoadingBeds(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchHospitalInfo();
      await fetchBeds();
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    fetchBeds();
  }, [selectedWard, selectedType, selectedStatus, searchQuery]);

  // Save Hospital Information (Admin)
  const handleSaveHospitalInfo = async (e) => {
    e.preventDefault();
    setSavingHosp(true);
    try {
      const res = await hospitalManagementService.updateHospitalInfo(hospForm);
      if (res?.hospital) {
        setHospitalData(res.hospital);
      }
      setIsEditingHospital(false);
      if (setToast) {
        setToast({
          type: 'success',
          message: 'Hospital information updated in database.'
        });
      }
    } catch (err) {
      console.error('Error updating hospital info:', err);
      alert('Failed to update hospital information.');
    } finally {
      setSavingHosp(false);
    }
  };

  // Quick Bed Status Toggle
  const handleQuickStatusChange = async (bed, newStatus) => {
    try {
      await hospitalManagementService.updateBed(bed.id, { status: newStatus });
      // Refresh both bed list and calculated hospital metrics
      await fetchBeds();
      await fetchHospitalInfo();
      if (setToast) {
        setToast({
          type: 'info',
          message: `Bed ${bed.bedNumber} marked as ${newStatus}.`
        });
      }
    } catch (err) {
      console.error('Error updating bed status:', err);
      alert('Failed to change bed status.');
    }
  };

  // Open Bed Create/Edit Modal
  const handleOpenBedModal = (mode, bed = null) => {
    setBedModal({ isOpen: true, mode, bed });
    setBedFormError('');
    if (mode === 'edit' && bed) {
      setBedForm({
        bedNumber: bed.bedNumber,
        ward: bed.ward,
        type: bed.type,
        floor: bed.floor || 'Ground Floor',
        status: bed.status,
        patientName: bed.patientName || '',
        notes: bed.notes || ''
      });
    } else {
      setBedForm({
        bedNumber: '',
        ward: 'Cardiology ICU',
        type: 'ICU',
        floor: 'Floor 2',
        status: 'Available',
        patientName: '',
        notes: ''
      });
    }
  };

  // Submit Bed Form (Create / Edit)
  const handleSaveBed = async (e) => {
    e.preventDefault();
    if (!bedForm.bedNumber.trim()) {
      setBedFormError('Bed number is required (e.g. ICU-107, GEN-A-215).');
      return;
    }

    setSavingBed(true);
    setBedFormError('');
    try {
      if (bedModal.mode === 'create') {
        await hospitalManagementService.createBed(bedForm);
        if (setToast) {
          setToast({
            type: 'success',
            message: `Bed ${bedForm.bedNumber} added to ${bedForm.ward}.`
          });
        }
      } else {
        await hospitalManagementService.updateBed(bedModal.bed.id, bedForm);
        if (setToast) {
          setToast({
            type: 'success',
            message: `Bed ${bedForm.bedNumber} updated successfully.`
          });
        }
      }
      setBedModal({ isOpen: false, mode: 'create', bed: null });
      await fetchBeds();
      await fetchHospitalInfo();
    } catch (err) {
      console.error('Error saving bed:', err);
      const detail = err.response?.data?.detail || 'Bed number already exists or invalid data.';
      setBedFormError(detail);
    } finally {
      setSavingBed(false);
    }
  };

  // Delete Bed
  const handleDeleteBed = async (bed) => {
    if (!window.confirm(`Are you sure you want to delete bed ${bed.bedNumber}?`)) return;
    try {
      await hospitalManagementService.deleteBed(bed.id);
      await fetchBeds();
      await fetchHospitalInfo();
      if (setToast) {
        setToast({
          type: 'info',
          message: `Bed ${bed.bedNumber} deleted from database.`
        });
      }
    } catch (err) {
      console.error('Error deleting bed:', err);
      alert('Failed to delete bed record.');
    }
  };

  if (loading) {
    return (
      <div className="profile-loading-state">
        <RefreshCw size={36} className="spin-animation text-primary" />
        <p>Connecting to PostgreSQL bed telemetry engine...</p>
      </div>
    );
  }

  const metrics = telemetry?.metrics || {
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    occupancyRatePercent: 0,
    hasAvailableBeds: false
  };

  const breakdown = telemetry?.breakdown || {
    icu: { total: 0, available: 0, occupied: 0, occupancyRate: 0 },
    generalWard: { total: 0, available: 0, occupied: 0, occupancyRate: 0 },
    emergency: { total: 0, available: 0, occupied: 0, occupancyRate: 0 },
    pediatric: { total: 0, available: 0, occupied: 0, occupancyRate: 0 }
  };

  return (
    <div className="hospital-info-page">
      {/* 1. Hospital Header Information Card */}
      <div className="page-header-card hospital-brand-card">
        <div className="d-flex align-items-start justify-content-between flex-wrap gap-3">
          <div className="header-meta">
            <div className="header-badge">
              <Building2 size={15} />
              <span>Hospital Information &amp; Bed Capacity Center</span>
            </div>
            <h1 className="page-title">{hospitalData?.name}</h1>
            <p className="page-subtitle">
              <MapPin size={14} className="text-primary inline-icon" />
              <span>{hospitalData?.address}</span>
            </p>
            <div className="hosp-contact-strip">
              <span><strong>Phone:</strong> {hospitalData?.contactNumber}</span>
              <span>•</span>
              <span className="emergency-num"><strong>Emergency 24x7:</strong> {hospitalData?.emergencyNumber}</span>
              <span>•</span>
              <span><strong>Hours:</strong> {hospitalData?.operatingHours}</span>
            </div>
          </div>

          {currentRole === 'ADMINISTRATOR' && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
              onClick={() => setIsEditingHospital(!isEditingHospital)}
            >
              <Edit2 size={14} />
              <span>{isEditingHospital ? 'Cancel Edit' : 'Edit Hospital Details'}</span>
            </button>
          )}
        </div>

        {/* Hospital Edit Form (Admin Only) */}
        {isEditingHospital && (
          <form className="hospital-edit-form" onSubmit={handleSaveHospitalInfo}>
            <div className="form-grid">
              <div className="form-group">
                <label>Hospital Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={hospForm.name}
                  onChange={(e) => setHospForm({ ...hospForm, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={hospForm.address}
                  onChange={(e) => setHospForm({ ...hospForm, address: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Desk Contact</label>
                <input
                  type="text"
                  className="form-control"
                  value={hospForm.contactNumber}
                  onChange={(e) => setHospForm({ ...hospForm, contactNumber: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Emergency Hotline</label>
                <input
                  type="text"
                  className="form-control"
                  value={hospForm.emergencyNumber}
                  onChange={(e) => setHospForm({ ...hospForm, emergencyNumber: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-3 d-flex gap-2">
              <button type="submit" className="btn btn-primary btn-sm" disabled={savingHosp}>
                {savingHosp ? 'Saving...' : 'Save Hospital Details'}
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsEditingHospital(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 2. Calculated Bed Availability Statistics Grid */}
      <div className="bed-stats-master-card">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div className="d-flex align-items-center gap-2">
            <HeartPulse size={20} className="text-primary" />
            <h2 className="section-title mb-0">Live Hospital Bed Availability Telemetry</h2>
          </div>
          <span className="telemetry-badge">
            <ShieldCheck size={14} className="text-success" />
            Calculated from PostgreSQL Records (Available = Total - Occupied)
          </span>
        </div>

        {/* Master Statistics Cards */}
        <div className="metrics-summary-grid">
          {/* Total Beds */}
          <div className="stat-card total">
            <div className="stat-icon-wrapper blue">
              <Bed size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-number">{metrics.totalBeds}</span>
              <span className="stat-label">Total Beds Registered</span>
              <span className="stat-sub">Across all wings</span>
            </div>
          </div>

          {/* Occupied Beds */}
          <div className="stat-card occupied">
            <div className="stat-icon-wrapper amber">
              <Activity size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-number">{metrics.occupiedBeds}</span>
              <span className="stat-label">Occupied Beds</span>
              <span className="stat-sub">{metrics.occupancyRatePercent}% Overall Occupancy</span>
            </div>
          </div>

          {/* Available Beds */}
          <div className={`stat-card ${metrics.availableBeds > 0 ? 'available' : 'critical'}`}>
            <div className={`stat-icon-wrapper ${metrics.availableBeds > 0 ? 'green' : 'red'}`}>
              <CheckCircle2 size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-number glow">{metrics.availableBeds}</span>
              <span className="stat-label">Available Beds</span>
              {metrics.availableBeds > 0 ? (
                <span className="stat-sub text-success">Ready for patient admission</span>
              ) : (
                <span className="stat-sub text-danger font-weight-bold">⚠️ Hospital at Maximum Capacity</span>
              )}
            </div>
          </div>

          {/* Reserved & Maintenance */}
          <div className="stat-card secondary">
            <div className="stat-icon-wrapper purple">
              <Clock size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-number">{metrics.reservedBeds + metrics.maintenanceBeds}</span>
              <span className="stat-label">Reserved &amp; Service</span>
              <span className="stat-sub">{metrics.reservedBeds} Res • {metrics.maintenanceBeds} Maint</span>
            </div>
          </div>
        </div>

        {/* Ward Breakdown with Progress Meters */}
        <div className="ward-breakdown-panel mt-4">
          <h3 className="breakdown-title">Department &amp; Ward Capacity Breakdown</h3>
          <div className="breakdown-bars-grid">
            {/* ICU Beds */}
            <div className="breakdown-card">
              <div className="breakdown-header">
                <span className="ward-name">Intensive Care Unit (ICU)</span>
                <span className="ward-counts">
                  <strong>{breakdown.icu.available}</strong> Available / {breakdown.icu.total} Total
                </span>
              </div>
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill icu" 
                  style={{ width: `${breakdown.icu.occupancyRate}%` }}
                />
              </div>
              <span className="rate-text">{breakdown.icu.occupancyRate}% Occupied ({breakdown.icu.occupied} In Use)</span>
            </div>

            {/* General Ward Beds */}
            <div className="breakdown-card">
              <div className="breakdown-header">
                <span className="ward-name">General Medical Wards</span>
                <span className="ward-counts">
                  <strong>{breakdown.generalWard.available}</strong> Available / {breakdown.generalWard.total} Total
                </span>
              </div>
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill gen" 
                  style={{ width: `${breakdown.generalWard.occupancyRate}%` }}
                />
              </div>
              <span className="rate-text">{breakdown.generalWard.occupancyRate}% Occupied ({breakdown.generalWard.occupied} In Use)</span>
            </div>

            {/* Emergency Beds */}
            <div className="breakdown-card">
              <div className="breakdown-header">
                <span className="ward-name">Emergency Trauma Unit</span>
                <span className="ward-counts">
                  <strong>{breakdown.emergency.available}</strong> Available / {breakdown.emergency.total} Total
                </span>
              </div>
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill emr" 
                  style={{ width: `${breakdown.emergency.occupancyRate}%` }}
                />
              </div>
              <span className="rate-text">{breakdown.emergency.occupancyRate}% Occupied ({breakdown.emergency.occupied} In Use)</span>
            </div>

            {/* Pediatric Beds */}
            <div className="breakdown-card">
              <div className="breakdown-header">
                <span className="ward-name">Pediatric Care Unit</span>
                <span className="ward-counts">
                  <strong>{breakdown.pediatric.available}</strong> Available / {breakdown.pediatric.total} Total
                </span>
              </div>
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill ped" 
                  style={{ width: `${breakdown.pediatric.occupancyRate}%` }}
                />
              </div>
              <span className="rate-text">{breakdown.pediatric.occupancyRate}% Occupied ({breakdown.pediatric.occupied} In Use)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Bed Management Table & Operations */}
      <div className="bed-management-panel">
        <div className="panel-header-actions">
          <div className="left-controls">
            <h3 className="panel-title">Hospital Bed Registry ({beds.length})</h3>
            <span className="panel-sub">Manage bed occupancy, admissions, and maintenance states.</span>
          </div>

          <div className="right-controls">
            {currentRole === 'ADMINISTRATOR' && (
              <button
                type="button"
                className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"
                onClick={() => handleOpenBedModal('create')}
              >
                <PlusCircle size={15} />
                <span>Add New Bed</span>
              </button>
            )}
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                fetchBeds();
                fetchHospitalInfo();
              }}
              title="Refresh database records"
            >
              <RefreshCw size={14} className={loadingBeds ? 'spin-animation' : ''} />
            </button>
          </div>
        </div>

        {/* Filters Strip */}
        <div className="bed-filters-strip">
          <div className="search-filter-input">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search bed number, ward, or patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-dropdown-group">
            <label>Ward:</label>
            <select
              className="form-select form-select-sm"
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
            >
              {WARD_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          <div className="filter-dropdown-group">
            <label>Type:</label>
            <select
              className="form-select form-select-sm"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="filter-dropdown-group">
            <label>Status:</label>
            <select
              className="form-select form-select-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Beds Table */}
        <div className="table-responsive bed-table-container">
          <table className="table bed-records-table">
            <thead>
              <tr>
                <th>Bed No.</th>
                <th>Ward / Department</th>
                <th>Type</th>
                <th>Floor</th>
                <th>Status</th>
                <th>Assigned Patient</th>
                <th>Notes</th>
                <th>Quick Status Toggle</th>
                {currentRole === 'ADMINISTRATOR' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {beds.length > 0 ? (
                beds.map((bed) => {
                  const isAvail = bed.status === 'Available';
                  const isOcc = bed.status === 'Occupied';
                  const isRes = bed.status === 'Reserved';
                  const isMaint = bed.status === 'Under Maintenance';

                  return (
                    <tr key={bed.id} className={`bed-row ${bed.status.toLowerCase().replace(' ', '-')}`}>
                      <td>
                        <strong className="bed-code">{bed.bedNumber}</strong>
                      </td>
                      <td>{bed.ward}</td>
                      <td>
                        <span className={`badge-bed-type ${bed.type.toLowerCase().replace(' ', '-')}`}>
                          {bed.type}
                        </span>
                      </td>
                      <td>{bed.floor}</td>
                      <td>
                        <span className={`bed-status-chip ${bed.status.toLowerCase().replace(' ', '-')}`}>
                          <span className="dot" />
                          {bed.status}
                        </span>
                      </td>
                      <td>
                        {bed.patientName ? (
                          <span className="patient-name-tag font-weight-bold">
                            {bed.patientName}
                          </span>
                        ) : (
                          <span className="text-muted">— Unassigned —</span>
                        )}
                      </td>
                      <td className="notes-col">{bed.notes || '—'}</td>
                      
                      {/* Quick Status Toggle Button */}
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className={`btn btn-xs ${isAvail ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => handleQuickStatusChange(bed, 'Available')}
                            title="Mark Available"
                          >
                            Avail
                          </button>
                          <button
                            type="button"
                            className={`btn btn-xs ${isOcc ? 'btn-danger' : 'btn-outline-danger'}`}
                            onClick={() => handleQuickStatusChange(bed, 'Occupied')}
                            title="Mark Occupied"
                          >
                            Occ
                          </button>
                          <button
                            type="button"
                            className={`btn btn-xs ${isRes ? 'btn-info' : 'btn-outline-info'}`}
                            onClick={() => handleQuickStatusChange(bed, 'Reserved')}
                            title="Mark Reserved"
                          >
                            Res
                          </button>
                          <button
                            type="button"
                            className={`btn btn-xs ${isMaint ? 'btn-warning' : 'btn-outline-warning'}`}
                            onClick={() => handleQuickStatusChange(bed, 'Under Maintenance')}
                            title="Mark Maintenance"
                          >
                            Maint
                          </button>
                        </div>
                      </td>

                      {/* Admin Edit / Delete */}
                      {currentRole === 'ADMINISTRATOR' && (
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <button
                              type="button"
                              className="btn btn-icon btn-sm"
                              onClick={() => handleOpenBedModal('edit', bed)}
                              title="Edit bed details"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-icon btn-sm text-danger"
                              onClick={() => handleDeleteBed(bed)}
                              title="Delete bed record"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={currentRole === 'ADMINISTRATOR' ? 9 : 8} className="text-center py-4 text-muted">
                    No hospital bed records match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Bed Create/Edit Modal */}
      {bedModal.isOpen && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom">
            <div className="modal-header-custom">
              <h4>
                <Bed size={18} />
                <span>{bedModal.mode === 'create' ? 'Register New Hospital Bed' : `Edit Bed ${bedModal.bed?.bedNumber}`}</span>
              </h4>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setBedModal({ isOpen: false, mode: 'create', bed: null })}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveBed}>
              <div className="modal-body-custom">
                {bedFormError && (
                  <div className="alert alert-danger py-2 px-3 mb-3 font-size-sm">
                    {bedFormError}
                  </div>
                )}

                <div className="form-group mb-3">
                  <label>Bed Number / Identifier *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. ICU-108, GEN-A-215, EMR-05"
                    value={bedForm.bedNumber}
                    onChange={(e) => setBedForm({ ...bedForm, bedNumber: e.target.value })}
                    required
                  />
                  <small className="text-muted">Must be unique across the hospital database.</small>
                </div>

                <div className="form-group mb-3">
                  <label>Ward / Department *</label>
                  <select
                    className="form-control"
                    value={bedForm.ward}
                    onChange={(e) => setBedForm({ ...bedForm, ward: e.target.value })}
                  >
                    <option value="Cardiology ICU">Cardiology ICU</option>
                    <option value="Surgical ICU">Surgical ICU</option>
                    <option value="General Ward A">General Ward A</option>
                    <option value="General Ward B">General Ward B</option>
                    <option value="Emergency Trauma Unit">Emergency Trauma Unit</option>
                    <option value="Pediatric Care Unit">Pediatric Care Unit</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label>Bed Type</label>
                  <select
                    className="form-control"
                    value={bedForm.type}
                    onChange={(e) => setBedForm({ ...bedForm, type: e.target.value })}
                  >
                    <option value="ICU">ICU</option>
                    <option value="General Ward">General Ward</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Pediatric">Pediatric</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label>Floor / Wing</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Ground Floor, Floor 2"
                    value={bedForm.floor}
                    onChange={(e) => setBedForm({ ...bedForm, floor: e.target.value })}
                  />
                </div>

                <div className="form-group mb-3">
                  <label>Bed Status</label>
                  <select
                    className="form-control"
                    value={bedForm.status}
                    onChange={(e) => setBedForm({ ...bedForm, status: e.target.value })}
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label>Assigned Patient Name (If Occupied)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Patient Name"
                    value={bedForm.patientName}
                    onChange={(e) => setBedForm({ ...bedForm, patientName: e.target.value })}
                  />
                </div>

                <div className="form-group mb-3">
                  <label>Notes / Equipment Attached</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Ventilator active, Oxygen telemetry"
                    value={bedForm.notes}
                    onChange={(e) => setBedForm({ ...bedForm, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer-custom">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={savingBed}
                >
                  {savingBed ? 'Saving...' : 'Save Bed Record'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setBedModal({ isOpen: false, mode: 'create', bed: null })}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalInfo;
