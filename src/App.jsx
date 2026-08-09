import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PatientRegistration from './pages/PatientRegistration';
import Appointments from './pages/Appointments';
import ConsultationPrescription from './pages/ConsultationPrescription';
import AppointmentModal from './components/AppointmentModal';
import ToastNotification from './components/ToastNotification';
import { initialPatients } from './data/mockPatients';
import { initialAppointments, generateNextAppointmentId } from './data/mockAppointments';
import { initialConsultations } from './data/mockConsultations';
import { initialPrescriptions } from './data/mockPrescriptions';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [patients, setPatients] = useState(initialPatients);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [consultations, setConsultations] = useState(initialConsultations);
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [toast, setToast] = useState(null);

  // Appointment Modal State
  const [aptModal, setAptModal] = useState({
    isOpen: false,
    mode: 'create',
    appointment: null
  });

  // Calculate next auto-generated Appointment ID
  const nextAppointmentId = useMemo(() => {
    return generateNextAppointmentId(appointments);
  }, [appointments]);

  // Open Appointment Modal for new booking
  const handleOpenNewAppointmentModal = () => {
    setAptModal({
      isOpen: true,
      mode: 'create',
      appointment: null
    });
  };

  // Open Appointment Modal for editing
  const handleEditAppointment = (apt) => {
    setAptModal({
      isOpen: true,
      mode: 'edit',
      appointment: apt
    });
  };

  // Save new or edited appointment
  const handleSaveAppointment = (aptData) => {
    if (aptModal.mode === 'create') {
      setAppointments((prev) => [aptData, ...prev]);
      setToast({
        type: 'success',
        message: `Appointment (${aptData.id}) scheduled successfully for ${aptData.patientName}.`
      });
    } else {
      setAppointments((prev) =>
        prev.map((a) => (a.id === aptData.id ? aptData : a))
      );
      setToast({
        type: 'success',
        message: `Appointment (${aptData.id}) updated successfully.`
      });
    }
    setAptModal({ isOpen: false, mode: 'create', appointment: null });
  };

  // Update appointment status directly
  const handleUpdateAppointmentStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    setToast({
      type: 'success',
      message: `Appointment (${id}) marked as ${newStatus}.`
    });
  };

  // Save new clinical consultation (Module 2)
  const handleSaveConsultation = (consultationData) => {
    setConsultations((prev) => [consultationData, ...prev]);
    setToast({
      type: 'success',
      message: `Consultation saved successfully for ${consultationData.patientName} (${consultationData.patientId}).`
    });
  };

  // Generate new patient prescription (Module 2)
  const handleGeneratePrescription = (prescriptionData) => {
    setPrescriptions((prev) => [prescriptionData, ...prev]);
    setToast({
      type: 'success',
      message: `Prescription generated successfully for ${prescriptionData.patientName} (${prescriptionData.patientId}).`
    });
  };

  return (
    <div className="app-container">
      {/* Top Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        patientCount={patients.length}
        appointmentCount={appointments.length}
        consultationCount={consultations.length}
      />

      {/* Main View Router */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            patients={patients}
            appointments={appointments}
            setActiveTab={setActiveTab}
            onOpenNewAppointmentModal={handleOpenNewAppointmentModal}
          />
        )}

        {activeTab === 'patients' && (
          <PatientRegistration
            patients={patients}
            setPatients={setPatients}
            setActiveTab={setActiveTab}
            setToast={setToast}
          />
        )}

        {activeTab === 'appointments' && (
          <Appointments
            appointments={appointments}
            setActiveTab={setActiveTab}
            onOpenNewAppointmentModal={handleOpenNewAppointmentModal}
            onEditAppointment={handleEditAppointment}
            onUpdateStatus={handleUpdateAppointmentStatus}
          />
        )}

        {activeTab === 'consultation' && (
          <ConsultationPrescription
            patients={patients}
            consultations={consultations}
            prescriptions={prescriptions}
            setActiveTab={setActiveTab}
            onSaveConsultation={handleSaveConsultation}
            onGeneratePrescription={handleGeneratePrescription}
          />
        )}

        {/* Global Appointment Booking / Edit Modal */}
        <AppointmentModal
          isOpen={aptModal.isOpen}
          mode={aptModal.mode}
          appointment={aptModal.appointment}
          nextAppointmentId={nextAppointmentId}
          patients={patients}
          onClose={() => setAptModal({ isOpen: false, mode: 'create', appointment: null })}
          onSave={handleSaveAppointment}
        />

        {/* Global Toast Notification Alerts */}
        <ToastNotification toast={toast} onClose={() => setToast(null)} />
      </main>
    </div>
  );
}

export default App;
