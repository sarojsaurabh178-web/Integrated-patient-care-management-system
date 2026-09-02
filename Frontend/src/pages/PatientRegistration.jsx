import React, { useState, useMemo } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import PatientForm from '../components/PatientForm';
import SearchBar from '../components/SearchBar';
import PatientTable from '../components/PatientTable';
import PatientModal from '../components/PatientModal';
import { generateNextPatientId } from '../data/mockPatients';

const PatientRegistration = ({ patients, setPatients, setActiveTab, setToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModal, setActiveModal] = useState({ isOpen: false, mode: 'view', patient: null });

  // Compute next unique Patient ID dynamically
  const nextPatientId = useMemo(() => {
    return generateNextPatientId(patients);
  }, [patients]);

  // Handle registering new patient
  const handleRegisterPatient = (newPatient) => {
    setPatients((prev) => [newPatient, ...prev]);
    setToast({
      type: 'success',
      message: `Patient registered successfully. (ID: ${newPatient.id})`
    });
  };

  // Handle modal view
  const handleViewPatient = (patient) => {
    setActiveModal({ isOpen: true, mode: 'view', patient });
  };

  // Handle modal edit
  const handleEditPatient = (patient) => {
    setActiveModal({ isOpen: true, mode: 'edit', patient });
  };

  // Handle saving edited patient record
  const handleSaveEditedPatient = (updatedPatient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
    setActiveModal({ isOpen: false, mode: 'view', patient: null });
    setToast({
      type: 'success',
      message: `Patient record updated successfully. (ID: ${updatedPatient.id})`
    });
  };

  // Filter patients list based on real-time search (name, ID, or phone)
  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) return patients;
    const query = searchTerm.toLowerCase().trim();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.phone.includes(query)
    );
  }, [patients, searchTerm]);

  return (
    <div className="patient-registration-page">
      {/* Breadcrumb Navigation */}
      <Breadcrumb activeTab="patients" setActiveTab={setActiveTab} />

      {/* Page Heading & Subtitle */}
      <div className="page-header">
        <h1 className="page-title">Patient Registration</h1>
        <p className="page-subtitle">
          Register a new patient and create their basic healthcare record.
        </p>
      </div>

      {/* Patient Registration Form Card */}
      <PatientForm
        nextPatientId={nextPatientId}
        onRegisterPatient={handleRegisterPatient}
      />

      {/* Search Bar */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        totalPatients={filteredPatients.length}
      />

      {/* Patient Table */}
      <PatientTable
        patients={filteredPatients}
        onViewPatient={handleViewPatient}
        onEditPatient={handleEditPatient}
      />

      {/* View / Edit Detail Modal */}
      <PatientModal
        isOpen={activeModal.isOpen}
        mode={activeModal.mode}
        patient={activeModal.patient}
        onClose={() => setActiveModal({ isOpen: false, mode: 'view', patient: null })}
        onSave={handleSaveEditedPatient}
      />
    </div>
  );
};

export default PatientRegistration;
