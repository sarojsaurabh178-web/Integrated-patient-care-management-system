import React, { useState } from 'react';
import { Activity, Lock, Mail, User, Phone, CheckCircle, AlertTriangle, ArrowRight, KeyRound, ShieldAlert } from 'lucide-react';

const AuthPages = ({ onLoginSuccess, currentRole, onSwitchRole }) => {
  const [view, setView] = useState('login'); // 'login', 'register', 'forgot', 'reset'
  const [simulatedState, setSimulatedState] = useState('normal'); // 'normal', 'loading', 'success', 'invalid_credentials', 'empty_fields'

  // Form State
  const [email, setEmail] = useState('dr.ravi@meditrack.org');
  const [password, setPassword] = useState('••••••••');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('DOCTOR');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (simulatedState === 'empty_fields') {
      return; // UI shows empty field error banner
    }

    setSimulatedState('loading');

    setTimeout(() => {
      if (simulatedState === 'invalid_credentials') {
        setSimulatedState('invalid_credentials');
      } else {
        setSimulatedState('success');
        setTimeout(() => {
          onLoginSuccess(selectedRole);
        }, 800);
      }
    }, 1000);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand-logo">
            <Activity size={28} />
          </div>
          <h2 className="auth-title">
            {view === 'login' && 'MediTrack Portal Sign In'}
            {view === 'register' && 'Create MediTrack Account'}
            {view === 'forgot' && 'Reset Your Password'}
            {view === 'reset' && 'Set New Password'}
          </h2>
          <p className="auth-subtitle">
            {view === 'login' && 'Integrated Patient Care Management System'}
            {view === 'register' && 'Register as a Patient, Doctor, or Administrator'}
            {view === 'forgot' && 'Enter your registered email for password recovery'}
            {view === 'reset' && 'Enter your authorization code and new password'}
          </p>
        </div>

        {/* Simulated State Alert Banners */}
        {simulatedState === 'invalid_credentials' && (
          <div className="alert alert-danger d-flex align-items-center gap-2 text-sm mb-4" role="alert">
            <ShieldAlert size={18} className="flex-shrink-0" />
            <div>
              <strong>Invalid Credentials!</strong> The username or password provided is incorrect. (Simulated HTTP 401)
            </div>
          </div>
        )}

        {simulatedState === 'empty_fields' && (
          <div className="alert alert-warning d-flex align-items-center gap-2 text-sm mb-4" role="alert">
            <AlertTriangle size={18} className="flex-shrink-0" />
            <div>
              <strong>Empty Fields Detected!</strong> Please fill in all required login fields before proceeding.
            </div>
          </div>
        )}

        {simulatedState === 'success' && (
          <div className="alert alert-success d-flex align-items-center gap-2 text-sm mb-4" role="alert">
            <CheckCircle size={18} className="flex-shrink-0" />
            <div>
              <strong>Login Successful!</strong> Authentication token issued. Redirecting to dashboard...
            </div>
          </div>
        )}

        {/* Form Views */}
        {view === 'login' && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email / Username</label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  className="form-control auth-input"
                  placeholder="name@meditrack.org"
                  value={simulatedState === 'empty_fields' ? '' : email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={simulatedState !== 'empty_fields'}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  className="form-control auth-input"
                  placeholder="Enter your password"
                  value={simulatedState === 'empty_fields' ? '' : password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={simulatedState !== 'empty_fields'}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Select Portal Access Role</label>
              <select
                className="form-select auth-input"
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  onSwitchRole(e.target.value);
                }}
              >
                <option value="PATIENT">PATIENT - View Records & Appointments</option>
                <option value="DOCTOR">DOCTOR - Clinical OPD & Prescriptions</option>
                <option value="ADMINISTRATOR">ADMINISTRATOR - System & Security Management</option>
              </select>
            </div>

            <div className="auth-options">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberCheck"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="form-check-label text-muted" htmlFor="rememberCheck">
                  Remember Me
                </label>
              </div>
              <button
                type="button"
                className="btn btn-link text-primary p-0 text-decoration-none"
                onClick={() => setView('forgot')}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="btn-auth-primary"
              disabled={simulatedState === 'loading'}
            >
              {simulatedState === 'loading' ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Login to MediTrack</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {view === 'register' && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control auth-input"
                placeholder="Dr. John Doe / Jane Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control auth-input"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                className="form-control auth-input"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control auth-input"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Role Registration Selection</label>
              <select
                className="form-select auth-input"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="PATIENT">PATIENT</option>
                <option value="DOCTOR">DOCTOR</option>
                <option value="ADMINISTRATOR">ADMINISTRATOR</option>
              </select>
            </div>

            <button type="submit" className="btn-auth-primary">
              Register Account
            </button>

            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-link text-muted p-0 text-decoration-none"
                onClick={() => setView('login')}
              >
                Already have an account? Sign In
              </button>
            </div>
          </form>
        )}

        {view === 'forgot' && (
          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); setView('reset'); }}>
            <div className="form-group">
              <label>Registered Email Address</label>
              <input
                type="email"
                className="form-control auth-input"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-auth-primary">
              Send Password Reset Link
            </button>

            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-link text-muted p-0 text-decoration-none"
                onClick={() => setView('login')}
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {view === 'reset' && (
          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); setView('login'); setSimulatedState('success'); }}>
            <div className="form-group">
              <label>Reset Authorization Code</label>
              <input
                type="text"
                className="form-control auth-input"
                placeholder="e.g. 6-digit code: 849201"
                required
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                className="form-control auth-input"
                placeholder="New strong password"
                required
              />
            </div>

            <button type="submit" className="btn-auth-primary">
              Confirm Password Reset
            </button>
          </form>
        )}

        {/* Demo State Switcher Footer */}
        <div className="auth-demo-state-selector">
          <div className="fw-semibold text-dark" style={{ fontSize: '0.75rem' }}>
            TEST FRONTEND AUTHENTICATION UI STATES:
          </div>
          <div className="auth-state-btn-group">
            <button
              type="button"
              className={`btn-state-chip ${simulatedState === 'normal' ? 'active' : ''}`}
              onClick={() => setSimulatedState('normal')}
            >
              Default Login
            </button>
            <button
              type="button"
              className={`btn-state-chip ${simulatedState === 'invalid_credentials' ? 'active' : ''}`}
              onClick={() => setSimulatedState('invalid_credentials')}
            >
              Invalid Credentials (401)
            </button>
            <button
              type="button"
              className={`btn-state-chip ${simulatedState === 'empty_fields' ? 'active' : ''}`}
              onClick={() => setSimulatedState('empty_fields')}
            >
              Empty Fields State
            </button>
            <button
              type="button"
              className={`btn-state-chip ${simulatedState === 'loading' ? 'active' : ''}`}
              onClick={() => setSimulatedState('loading')}
            >
              Loading State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPages;
