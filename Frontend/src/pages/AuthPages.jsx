import React, { useState } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import PatientSignupForm from '../components/auth/PatientSignupForm';
import DoctorSignupForm from '../components/auth/DoctorSignupForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import OtpVerificationForm from '../components/auth/OtpVerificationForm';
import CreateNewPasswordForm from '../components/auth/CreateNewPasswordForm';
import PasswordResetSuccess from '../components/auth/PasswordResetSuccess';

const AuthPages = ({ 
  onLoginSuccess, 
  currentRole = 'DOCTOR', 
  onSwitchRole, 
  theme, 
  toggleTheme 
}) => {
  // Navigation View State
  // Options: 'login', 'signup_patient', 'signup_doctor', 'forgot_password', 'verify_otp', 'create_new_password', 'reset_success'
  const [view, setView] = useState('login');

  // Multi-step OTP recovery state
  const [otpData, setOtpData] = useState({
    identifier: '',
    maskedTarget: '',
    cooldownSeconds: 30,
    demoOtpCode: '849201'
  });

  const [resetSessionData, setResetSessionData] = useState({
    identifier: '',
    resetToken: ''
  });

  // Simulated Error states for testing convenience
  const [simulatedError, setSimulatedError] = useState(null);

  const handleOtpSent = (data) => {
    setOtpData(data);
    setView('verify_otp');
  };

  const handleOtpVerified = (data) => {
    setResetSessionData(data);
    setView('create_new_password');
  };

  const handleResetSuccess = () => {
    setView('reset_success');
  };

  const handleRegistrationSuccess = (registeredUser) => {
    // Navigate to login with success message
    setView('login');
  };

  return (
    <AuthLayout 
      activeView={view} 
      theme={theme} 
      toggleTheme={toggleTheme}
      onSelectView={setView}
    >
      {/* 1. Login View */}
      {view === 'login' && (
        <LoginForm
          onLoginSuccess={onLoginSuccess}
          onNavigate={setView}
          currentRole={currentRole}
          onSwitchRole={onSwitchRole}
          presetError={simulatedError}
        />
      )}

      {/* 2. Patient Registration View */}
      {view === 'signup_patient' && (
        <PatientSignupForm
          onNavigate={setView}
          onRegistrationSuccess={handleRegistrationSuccess}
        />
      )}

      {/* 3. Doctor Access & Registration View */}
      {view === 'signup_doctor' && (
        <DoctorSignupForm
          onNavigate={setView}
        />
      )}

      {/* 4. Forgot Password View */}
      {view === 'forgot_password' && (
        <ForgotPasswordForm
          onNavigate={setView}
          onOtpSent={handleOtpSent}
        />
      )}

      {/* 5. OTP Verification View */}
      {view === 'verify_otp' && (
        <OtpVerificationForm
          otpData={otpData}
          onNavigate={setView}
          onOtpVerified={handleOtpVerified}
        />
      )}

      {/* 6. Create New Password View */}
      {view === 'create_new_password' && (
        <CreateNewPasswordForm
          resetSessionData={resetSessionData}
          onNavigate={setView}
          onResetSuccess={handleResetSuccess}
        />
      )}

      {/* 7. Password Reset Success View */}
      {view === 'reset_success' && (
        <PasswordResetSuccess
          onReturnToLogin={() => {
            setSimulatedError(null);
            setView('login');
          }}
        />
      )}

      {/* Floating State Simulator (Allows quick inspection of all edge states & pages) */}
      <aside className="auth-simulation-toolbar" aria-label="Testing Toolbar">
        <span className="sim-label">Auth View & Error Simulator:</span>
        <div className="sim-btn-group">
          <button
            type="button"
            className={`btn-sim-chip ${view === 'login' && !simulatedError ? 'active' : ''}`}
            onClick={() => { setSimulatedError(null); setView('login'); }}
            title="Default Login Screen"
          >
            Login
          </button>
          <button
            type="button"
            className={`btn-sim-chip ${view === 'signup_patient' ? 'active' : ''}`}
            onClick={() => setView('signup_patient')}
            title="Patient Registration Screen"
          >
            Patient Sign Up
          </button>
          <button
            type="button"
            className={`btn-sim-chip ${view === 'signup_doctor' ? 'active' : ''}`}
            onClick={() => setView('signup_doctor')}
            title="Doctor Credentialing Screen"
          >
            Doctor Access
          </button>
          <button
            type="button"
            className={`btn-sim-chip ${view === 'forgot_password' ? 'active' : ''}`}
            onClick={() => setView('forgot_password')}
            title="Password Recovery Screen"
          >
            Forgot Pwd
          </button>
          <button
            type="button"
            className={`btn-sim-chip ${view === 'verify_otp' ? 'active' : ''}`}
            onClick={() => setView('verify_otp')}
            title="6-digit OTP Screen"
          >
            OTP (6-Digit)
          </button>
          <button
            type="button"
            className={`btn-sim-chip ${view === 'create_new_password' ? 'active' : ''}`}
            onClick={() => setView('create_new_password')}
            title="Create New Password Screen"
          >
            New Pwd
          </button>
          <button
            type="button"
            className={`btn-sim-chip ${view === 'reset_success' ? 'active' : ''}`}
            onClick={() => setView('reset_success')}
            title="Reset Success Screen"
          >
            Success Screen
          </button>
          <button
            type="button"
            className={`btn-sim-chip ${simulatedError ? 'active' : ''}`}
            onClick={() => {
              setView('login');
              setSimulatedError('Simulated Error: Your account has been disabled. Please contact support.');
            }}
            title="Test Account Disabled Error"
          >
            Simulate 401/Disabled
          </button>
        </div>
      </aside>
    </AuthLayout>
  );
};

export default AuthPages;
