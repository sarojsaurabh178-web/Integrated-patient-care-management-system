import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PatientRegistration from './pages/PatientRegistration';
import Appointments from './pages/Appointments';
import ConsultationPrescription from './pages/ConsultationPrescription';
import NotificationCenter from './pages/NotificationCenter';
import AuthPages from './pages/AuthPages';
import SecurityMonitoring from './pages/SecurityMonitoring';
import AuditLogsPage from './pages/AuditLogsPage';
import JwtAuthFlowPage from './pages/JwtAuthFlowPage';
import ApiDocumentationPage from './pages/ApiDocumentationPage';
import ErrorPages from './pages/ErrorPages';

import AppointmentModal from './components/AppointmentModal';
import ToastNotification from './components/ToastNotification';
import { AccessDeniedComponent } from './components/StateFeedbackComponents';

import { initialPatients } from './data/mockPatients';
import { initialAppointments, generateNextAppointmentId } from './data/mockAppointments';
import { initialConsultations } from './data/mockConsultations';
import { initialPrescriptions } from './data/mockPrescriptions';
import { initialNotifications } from './data/mockNotifications';
import { initialAuditLogs } from './data/mockAuditLogs';
import { initialSecurityEvents, initialSecurityAlerts } from './data/mockSecurityEvents';
import { ROLE_DETAILS } from './data/mockAuthUsers';

function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState('DOCTOR'); // 'PATIENT', 'DOCTOR', 'ADMINISTRATOR'
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Core Datasets State
  const [patients, setPatients] = useState(initialPatients);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [consultations, setConsultations] = useState(initialConsultations);
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);

  // Milestone 3 Datasets State
  const [notifications, setNotifications] = useState(initialNotifications);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [securityEvents, setSecurityEvents] = useState(initialSecurityEvents);
  const [securityAlerts, setSecurityAlerts] = useState(initialSecurityAlerts);

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

  // Role Access Permission Checker
  const roleAllowedTabs = useMemo(() => {
    return ROLE_DETAILS[currentRole]?.allowedTabs || [];
  }, [currentRole]);

  const isTabAllowed = (tab) => {
    return roleAllowedTabs.includes(tab);
  };

  // Switch role handler
  const handleSwitchRole = (newRole) => {
    setCurrentRole(newRole);
    setToast({
      type: 'info',
      message: `Switched demo role to ${newRole} mode.`
    });
  };

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

  // Save new or edited appointment & append audit log + notification
  const handleSaveAppointment = (aptData) => {
    if (aptModal.mode === 'create') {
      setAppointments((prev) => [aptData, ...prev]);

      // Add audit log
      const newAudit = {
        id: `LOG-${Date.now()}`,
        user: ROLE_DETAILS[currentRole].name,
        role: currentRole === 'DOCTOR' ? 'Doctor' : currentRole === 'PATIENT' ? 'Patient' : 'Administrator',
        action: 'Booked Appointment',
        resource: `${aptData.id} - ${aptData.department}`,
        timestamp: new Date().toLocaleString(),
        ipAddress: '192.168.1.50',
        status: 'Success',
        details: `Scheduled appointment for ${aptData.patientName}.`
      };
      setAuditLogs(prev => [newAudit, ...prev]);

      // Add notification
      const newNotif = {
        id: `NOT-${Date.now()}`,
        type: 'Appointment Reminder',
        category: 'appointment',
        title: `Appointment Booked (${aptData.id})`,
        message: `Your appointment with ${aptData.doctorName} is confirmed for ${aptData.date} at ${aptData.time}.`,
        date: aptData.date,
        time: aptData.time,
        isRead: false,
        doctorName: aptData.doctorName,
        patientName: aptData.patientName,
        appointmentId: aptData.id,
        priority: 'high'
      };
      setNotifications(prev => [newNotif, ...prev]);

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

  // Save new clinical consultation
  const handleSaveConsultation = (consultationData) => {
    setConsultations((prev) => [consultationData, ...prev]);

    // Add audit log entry
    const newAudit = {
      id: `LOG-${Date.now()}`,
      user: ROLE_DETAILS[currentRole].name,
      role: 'Doctor',
      action: 'Added Diagnosis',
      resource: `${consultationData.patientId} - ${consultationData.patientName}`,
      timestamp: new Date().toLocaleString(),
      ipAddress: '192.168.1.45',
      status: 'Success',
      details: `Recorded diagnosis: ${consultationData.diagnosis}.`
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    setToast({
      type: 'success',
      message: `Consultation saved successfully for ${consultationData.patientName} (${consultationData.patientId}).`
    });
  };

  // Generate new patient prescription
  const handleGeneratePrescription = (prescriptionData) => {
    setPrescriptions((prev) => [prescriptionData, ...prev]);

    // Add notification
    const newNotif = {
      id: `NOT-${Date.now()}`,
      type: 'Prescription Alert',
      category: 'prescription',
      title: 'New Prescription Generated',
      message: `Prescription issued for ${prescriptionData.patientName} by ${prescriptionData.doctorName}.`,
      date: new Date().toISOString().split('T')[0],
      time: 'Now',
      isRead: false,
      doctorName: prescriptionData.doctorName,
      patientName: prescriptionData.patientName,
      prescriptionId: prescriptionData.id
    };
    setNotifications(prev => [newNotif, ...prev]);

    setToast({
      type: 'success',
      message: `Prescription generated successfully for ${prescriptionData.patientName} (${prescriptionData.patientId}).`
    });
  };

  // View specific appointment from notification click
  const handleViewAppointmentFromNotif = (aptId) => {
    setActiveTab('appointments');
    setToast({
      type: 'info',
      message: `Navigated to appointment reference ${aptId}.`
    });
  };

  // Sign in / Sign out handler
  const handleLoginSuccess = (role) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    setToast({
      type: 'success',
      message: `Authenticated successfully as ${role}. JWT token active.`
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('auth_portal');
    setToast({
      type: 'info',
      message: 'Logged out of session. Access tokens cleared.'
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
        notifications={notifications}
        currentRole={currentRole}
        onSwitchRole={handleSwitchRole}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="main-content">
        {!isAuthenticated || activeTab === 'auth_portal' ? (
          <AuthPages 
            onLoginSuccess={handleLoginSuccess} 
            currentRole={currentRole}
            onSwitchRole={handleSwitchRole}
          />
        ) : !isTabAllowed(activeTab) ? (
          <AccessDeniedComponent onReturnDashboard={() => setActiveTab('dashboard')} />
        ) : (
          <>
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

            {activeTab === 'notifications' && (
              <NotificationCenter
                notifications={notifications}
                setNotifications={setNotifications}
                setActiveTab={setActiveTab}
                onViewAppointment={handleViewAppointmentFromNotif}
              />
            )}

            {activeTab === 'audit_logs' && (
              <AuditLogsPage
                auditLogs={auditLogs}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'security_monitoring' && (
              <SecurityMonitoring
                securityEvents={securityEvents}
                securityAlerts={securityAlerts}
                setSecurityAlerts={setSecurityAlerts}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'jwt_flow' && (
              <JwtAuthFlowPage setActiveTab={setActiveTab} />
            )}

            {activeTab === 'api_docs' && (
              <ApiDocumentationPage setActiveTab={setActiveTab} />
            )}

            {activeTab === 'error_pages' && (
              <ErrorPages setActiveTab={setActiveTab} />
            )}
          </>
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
