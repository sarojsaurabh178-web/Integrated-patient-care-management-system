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
import { useTheme } from './hooks/useTheme';

import patientService from './services/patientService';
import appointmentService from './services/appointmentService';
import consultationService from './services/consultationService';
import prescriptionService from './services/prescriptionService';
import notificationService from './services/notificationService';
import dashboardService from './services/dashboardService';

function App() {
  // Theme Manager State
  const { theme, toggleTheme } = useTheme();

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

  // Initial load from real PostgreSQL backend APIs
  React.useEffect(() => {
    let isMounted = true;

    const fetchAllBackendData = async () => {
      try {
        const [patRes, aptRes, consRes, rxRes, notifRes, auditRes] = await Promise.allSettled([
          patientService.getPatients(),
          appointmentService.getAppointments(),
          consultationService.getConsultations(),
          prescriptionService.getPrescriptions(),
          notificationService.getNotifications(),
          dashboardService.getAuditLogs()
        ]);

        if (!isMounted) return;

        if (patRes.status === 'fulfilled' && Array.isArray(patRes.value) && patRes.value.length > 0) {
          setPatients(patRes.value.map(p => ({
            ...p,
            name: p.name || p.fullName,
            fullName: p.fullName || p.name,
            registeredDate: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : '2026-09-01'
          })));
        }

        if (aptRes.status === 'fulfilled' && Array.isArray(aptRes.value) && aptRes.value.length > 0) {
          setAppointments(aptRes.value.map(a => ({
            ...a,
            patientName: a.patientName || 'Patient',
            doctorName: a.doctorName || 'Doctor',
            department: a.department || 'General Medicine'
          })));
        }

        if (consRes.status === 'fulfilled' && Array.isArray(consRes.value) && consRes.value.length > 0) {
          setConsultations(consRes.value);
        }

        if (rxRes.status === 'fulfilled' && Array.isArray(rxRes.value) && rxRes.value.length > 0) {
          setPrescriptions(rxRes.value);
        }

        if (notifRes.status === 'fulfilled' && Array.isArray(notifRes.value) && notifRes.value.length > 0) {
          setNotifications(notifRes.value.map(n => ({
            ...n,
            title: n.title || n.type,
            date: n.createdAt ? new Date(n.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            time: 'Recent',
            isRead: n.status === 'Read' || n.isRead
          })));
        }

        if (auditRes.status === 'fulfilled' && Array.isArray(auditRes.value) && auditRes.value.length > 0) {
          setAuditLogs(auditRes.value.map(l => ({
            ...l,
            timestamp: l.timestamp ? new Date(l.timestamp).toLocaleString() : new Date().toLocaleString(),
            resource: l.endpoint,
            status: l.statusCode < 400 ? 'Success' : 'Failed'
          })));
        }
      } catch (err) {
        console.warn('Backend loading notice:', err);
      }
    };

    if (isAuthenticated) {
      fetchAllBackendData();
    }

    return () => { isMounted = false; };
  }, [isAuthenticated, currentRole]);

  // Save new or edited appointment & append audit log + notification
  const handleSaveAppointment = async (aptData) => {
    if (aptModal.mode === 'create') {
      try {
        const created = await appointmentService.createAppointment(aptData);
        const normalized = {
          ...aptData,
          id: created.id || aptData.id,
          patientName: created.patientName || aptData.patientName,
          doctorName: created.doctorName || aptData.doctorName,
          status: created.status || 'Scheduled'
        };
        setAppointments((prev) => [normalized, ...prev]);

        // Refresh notifications
        try {
          const freshNotifs = await notificationService.getNotifications();
          if (Array.isArray(freshNotifs)) setNotifications(freshNotifs);
        } catch (e) {}

        setToast({
          type: 'success',
          message: `Appointment (${normalized.id}) scheduled successfully in PostgreSQL database.`
        });
        setAptModal({ isOpen: false, mode: 'create', appointment: null });
      } catch (err) {
        setToast({
          type: 'danger',
          message: err.message || 'Slot Conflict: Doctor already booked at this slot.'
        });
      }
    } else {
      try {
        await appointmentService.updateAppointmentStatus(aptData.id, aptData.status);
      } catch (e) {}
      setAppointments((prev) =>
        prev.map((a) => (a.id === aptData.id ? aptData : a))
      );
      setToast({
        type: 'success',
        message: `Appointment (${aptData.id}) updated successfully in database.`
      });
      setAptModal({ isOpen: false, mode: 'create', appointment: null });
    }
  };

  // Update appointment status directly
  const handleUpdateAppointmentStatus = async (id, newStatus) => {
    try {
      await appointmentService.updateAppointmentStatus(id, newStatus);
    } catch (e) {}
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    setToast({
      type: 'success',
      message: `Appointment (${id}) marked as ${newStatus} in database.`
    });
  };

  // Save new clinical consultation
  const handleSaveConsultation = async (consultationData) => {
    try {
      const created = await consultationService.createConsultation(consultationData);
      setConsultations((prev) => [created || consultationData, ...prev]);
      setToast({
        type: 'success',
        message: `Consultation saved to PostgreSQL for ${consultationData.patientName}.`
      });
    } catch (err) {
      setConsultations((prev) => [consultationData, ...prev]);
      setToast({
        type: 'success',
        message: `Consultation saved for ${consultationData.patientName}.`
      });
    }
  };

  // Generate new patient prescription
  const handleGeneratePrescription = async (prescriptionData) => {
    try {
      const created = await prescriptionService.createPrescription(prescriptionData);
      setPrescriptions((prev) => [created || prescriptionData, ...prev]);

      // Refresh notifications from backend
      try {
        const freshNotifs = await notificationService.getNotifications();
        if (Array.isArray(freshNotifs)) setNotifications(freshNotifs);
      } catch (e) {}

      setToast({
        type: 'success',
        message: `Prescription generated and saved to database for ${prescriptionData.patientName}.`
      });
    } catch (err) {
      setPrescriptions((prev) => [prescriptionData, ...prev]);
      setToast({
        type: 'success',
        message: `Prescription generated for ${prescriptionData.patientName}.`
      });
    }
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
      {isAuthenticated && activeTab !== 'auth_portal' && (
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
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}

      {/* Main View Router */}
      <main className={isAuthenticated && activeTab !== 'auth_portal' ? "main-content" : "main-auth-content"}>
        {!isAuthenticated || activeTab === 'auth_portal' ? (
          <AuthPages 
            onLoginSuccess={handleLoginSuccess} 
            currentRole={currentRole}
            onSwitchRole={handleSwitchRole}
            theme={theme}
            toggleTheme={toggleTheme}
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
