import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck, 
  Info, 
  CheckCircle2,
  Stethoscope,
  UserPlus
} from 'lucide-react';
import { isEmail, isPhone, authService } from '../../services/authService';

const LoginForm = ({ 
  onLoginSuccess, 
  onNavigate, 
  currentRole, 
  onSwitchRole, 
  presetError = null 
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState(currentRole || 'DOCTOR');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(presetError);
  const [detectedType, setDetectedType] = useState('unknown'); // 'email', 'phone', 'unknown'

  // Load saved identifier if remember me was used previously
  useEffect(() => {
    const saved = authService.getSavedIdentifier();
    if (saved) {
      setIdentifier(saved);
      setRememberMe(true);
    } else {
      // Default to standard doctor account for easy evaluation
      setIdentifier('s.jenkins@meditrack.org');
      setPassword('DocPass@123');
    }
  }, []);

  // Detect input type dynamically
  useEffect(() => {
    if (!identifier) {
      setDetectedType('unknown');
    } else if (isEmail(identifier)) {
      setDetectedType('email');
    } else if (isPhone(identifier)) {
      setDetectedType('phone');
    } else {
      setDetectedType('typing');
    }
  }, [identifier]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage('Please enter your registered email or phone number.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.login({
        identifier,
        password,
        rememberMe,
        demoRole: selectedDemoRole
      });

      if (result.success) {
        // Pass verified role up to app
        onLoginSuccess(result.role);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email/phone or password.');
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click quick fill for evaluators
  const handleQuickFill = (role) => {
    setErrorMessage(null);
    setSelectedDemoRole(role);
    if (onSwitchRole) onSwitchRole(role);

    if (role === 'DOCTOR') {
      setIdentifier('s.jenkins@meditrack.org');
      setPassword('DocPass@123');
    } else if (role === 'PATIENT') {
      setIdentifier('rahul.verma@example.com');
      setPassword('Patient@123');
    } else if (role === 'ADMINISTRATOR') {
      setIdentifier('admin@meditrack.org');
      setPassword('Admin@123');
    }
  };

  return (
    <div className="auth-card-body">
      <div className="auth-card-header">
        <div className="auth-badge-header">
          <span className="badge-pill-primary">Healthcare Portal</span>
        </div>
        <h2 className="auth-main-title">Welcome Back</h2>
        <p className="auth-main-subtitle">
          Sign in to continue to MediTrack Patient Care Management System
        </p>
      </div>

      {/* Error Alert Display */}
      {errorMessage && (
        <div className="auth-alert auth-alert-danger" role="alert" aria-live="assertive">
          <AlertCircle size={18} className="alert-icon flex-shrink-0" />
          <div className="alert-content">
            <strong>Authentication Failed:</strong> {errorMessage}
          </div>
        </div>
      )}

      {/* Main Login Form */}
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {/* Identifier Field: Email or Phone */}
        <div className="form-group mb-3">
          <div className="label-with-hint">
            <label htmlFor="auth-identifier" className="auth-label">
              Email or Phone Number <span className="req-star">*</span>
            </label>
            {detectedType === 'email' && (
              <span className="type-detector-badge email">Email format detected</span>
            )}
            {detectedType === 'phone' && (
              <span className="type-detector-badge phone">Phone format detected</span>
            )}
          </div>

          <div className="auth-input-wrapper">
            <span className="input-prefix-icon" aria-hidden="true">
              {detectedType === 'phone' ? <Phone size={18} /> : <Mail size={18} />}
            </span>
            <input
              id="auth-identifier"
              type="text"
              name="identifier"
              autoComplete="username"
              className="form-control auth-input with-prefix"
              placeholder="name@meditrack.org or +91 98765 43210"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <small className="field-hint-text">
            Enter your registered email address or mobile phone number with country code.
          </small>
        </div>

        {/* Password Field */}
        <div className="form-group mb-3">
          <div className="label-with-hint">
            <label htmlFor="auth-password" className="auth-label">
              Password <span className="req-star">*</span>
            </label>
            <button
              type="button"
              className="btn-link-forgot"
              onClick={() => onNavigate('forgot_password')}
              tabIndex={0}
            >
              Forgot Password?
            </button>
          </div>

          <div className="auth-input-wrapper">
            <span className="input-prefix-icon" aria-hidden="true">
              <Lock size={18} />
            </span>
            <input
              id="auth-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              className="form-control auth-input with-prefix with-suffix"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              className="input-suffix-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Demo Role / Portal Access Selector */}
        <div className="form-group mb-3">
          <label htmlFor="auth-demo-role" className="auth-label">
            Portal Access / Demo Role
          </label>
          <div className="auth-input-wrapper">
            <span className="input-prefix-icon" aria-hidden="true">
              <ShieldCheck size={18} />
            </span>
            <select
              id="auth-demo-role"
              className="form-select auth-input with-prefix"
              value={selectedDemoRole}
              onChange={(e) => {
                setSelectedDemoRole(e.target.value);
                if (onSwitchRole) onSwitchRole(e.target.value);
              }}
              disabled={isLoading}
            >
              <option value="PATIENT">PATIENT - View Medical Records & Appointments</option>
              <option value="DOCTOR">DOCTOR - Clinical OPD, Diagnosis & Prescriptions</option>
              <option value="ADMINISTRATOR">ADMINISTRATOR - Security, Audit Logs & Users</option>
            </select>
          </div>
          <div className="security-notice-box">
            <Info size={14} className="notice-icon" />
            <span>
              <strong>Security Policy:</strong> Portal role selection is for demonstration. 
              The backend verifies user credentials and enforces true system authorization.
            </span>
          </div>
        </div>

        {/* Remember Me & Quick Actions */}
        <div className="auth-aux-row mb-4">
          <label className="remember-me-checkbox" htmlFor="auth-remember-check">
            <input
              type="checkbox"
              id="auth-remember-check"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            <span className="checkbox-custom" />
            <span className="checkbox-text">Remember identifier</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="btn-login-submit"
          className="btn-auth-primary w-100"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign in to MediTrack</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Fast Demo Testing Toolbar */}
      <div className="quick-fill-section">
        <div className="quick-fill-label">1-Click Test Demo Credentials:</div>
        <div className="quick-fill-buttons">
          <button
            type="button"
            className={`btn-quick-fill ${selectedDemoRole === 'DOCTOR' ? 'active' : ''}`}
            onClick={() => handleQuickFill('DOCTOR')}
          >
            Doctor (Dr. Jenkins)
          </button>
          <button
            type="button"
            className={`btn-quick-fill ${selectedDemoRole === 'PATIENT' ? 'active' : ''}`}
            onClick={() => handleQuickFill('PATIENT')}
          >
            Patient (Rahul V.)
          </button>
          <button
            type="button"
            className={`btn-quick-fill ${selectedDemoRole === 'ADMINISTRATOR' ? 'active' : ''}`}
            onClick={() => handleQuickFill('ADMINISTRATOR')}
          >
            Admin (System Admin)
          </button>
        </div>
      </div>

      {/* Alternate Registration Links */}
      <div className="auth-card-footer">
        <div className="registration-links-grid">
          <button
            type="button"
            className="btn-link-action"
            onClick={() => onNavigate('signup_patient')}
          >
            <UserPlus size={16} />
            <span>New Patient? <strong>Create Account</strong></span>
          </button>

          <span className="divider-vertical" />

          <button
            type="button"
            className="btn-link-action"
            onClick={() => onNavigate('signup_doctor')}
          >
            <Stethoscope size={16} />
            <span>Physician? <strong>Doctor Access</strong></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
