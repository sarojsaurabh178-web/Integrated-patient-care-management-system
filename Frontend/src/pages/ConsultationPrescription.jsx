import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import PatientSelector from '../components/PatientSelector';
import PatientSummary from '../components/PatientSummary';
import ConsultationForm from '../components/ConsultationForm';
import ConsultationHistory from '../components/ConsultationHistory';
import PrescriptionForm from '../components/PrescriptionForm';
import PrescriptionHistory from '../components/PrescriptionHistory';

const ConsultationPrescription = ({
  patients,
  consultations,
  prescriptions,
  setActiveTab,
  onSaveConsultation,
  onGeneratePrescription
}) => {
  const [selectedPatient, setSelectedPatient] = useState(patients.length > 0 ? patients[0] : null);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const handleClearSelection = () => {
    setSelectedPatient(null);
  };

  return (
    <div className="consultation-prescription-page">
      {/* Breadcrumb Navigation */}
      <Breadcrumb activeTab="consultation" setActiveTab={setActiveTab} />

      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Consultation & Prescription Management</h1>
        <p className="page-subtitle">
          Manage patient consultations, record symptoms and diagnosis, and generate official medical prescriptions.
        </p>
      </div>

      {/* SECTION 1: Patient Selection */}
      <PatientSelector
        patients={patients}
        selectedPatient={selectedPatient}
        onSelectPatient={handleSelectPatient}
      />

      {/* Active Patient Summary Banner */}
      {selectedPatient && (
        <PatientSummary
          selectedPatient={selectedPatient}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* SECTION 2: Consultation Form */}
      <ConsultationForm
        selectedPatient={selectedPatient}
        onSaveConsultation={onSaveConsultation}
      />

      {/* SECTION 3: Consultation History */}
      <ConsultationHistory consultations={consultations} />

      {/* SECTION 4: Generate Prescription */}
      <PrescriptionForm
        selectedPatient={selectedPatient}
        onGeneratePrescription={onGeneratePrescription}
      />

      {/* SECTION 5: Prescription History */}
      <PrescriptionHistory prescriptions={prescriptions} patients={patients} />
    </div>
  );
};

export default ConsultationPrescription;
