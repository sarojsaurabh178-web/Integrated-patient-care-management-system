import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import { authService, evaluatePasswordStrength, isEmail, isPhone } from '../../services/authService';

const PatientSignupForm = ({ onNavigate, onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: 'Male',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Form validations
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }

    if (!formData.dob) {
      setErrorMessage('Please select your date of birth.');
      return;
    }

    if (!isPhone(formData.phone)) {
      setErrorMessage('Please enter a valid phone number (e.g. +91 98765 43210 or 10 digits).');
      return;
    }

    if (!isEmail(formData.email)) {
      setErrorMessage('Please enter a valid email address (e.g. user@example.com).');
      return;
    }

    const strength = evaluatePasswordStrength(formData.password);
    if (!strength.isValid) {
      setErrorMessage('Please satisfy all password complexity rules before proceeding.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your entries.');
      return;
    }

    if (!formData.agreeTerms) {
      setErrorMessage('You must agree to the Terms of Service and Privacy Policy to register.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.registerPatient(formData);
      setSuccessMessage(result.message || 'Account created successfully!');
      setTimeout(() => {
        if (onRegistrationSuccess) {
          onRegistrationSuccess(result.user);
        } else {
          onNavigate('login');
        }
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card-body">
      <div className="auth-card-header">
        <button
          type="button"
          className="btn-back-link"
          onClick={() => onNavigate('login')}
          disabled={isLoading}
        >
          <ArrowLeft size={16} />
          <span>Back to Sign In</span>
        </button>

        <div className="auth-badge-header mt-2">
          <span className="badge-pill-success">Patient Registration</span>
        </div>
        <h2 className="auth-main-title">Create Your MediTrack Account</h2>
        <p className="auth-main-subtitle">
          Register to manage your healthcare appointments, prescriptions, and electronic health records.
        </p>
      </div>

      {/* Error & Success Banners */}
      {errorMessage && (
        <div className="auth-alert auth-alert-danger" role="alert">
          <AlertCircle size={18} className="alert-icon flex-shrink-0" />
          <div className="alert-content">
            <strong>Registration Error:</strong> {errorMessage}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="auth-alert auth-alert-success" role="alert">
          <CheckCircle2 size={18} className="alert-icon flex-shrink-0" />
          <div className="alert-content">
            <strong>Success!</strong> {successMessage} Redirecting...
          </div>
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className="form-group mb-3">
          <label htmlFor="reg-fullname" className="auth-label">
            Full Name <span className="req-star">*</span>
          </label>
          <div className="auth-input-wrapper">
            <span className="input-prefix-icon"><User size={18} /></span>
            <input
              id="reg-fullname"
              type="text"
              name="fullName"
              className="form-control auth-input with-prefix"
              placeholder="e.g. Rahul Sharma"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* DOB & Gender 2-Col Grid */}
        <div className="form-row-2col mb-3">
          <div className="form-group">
            <label htmlFor="reg-dob" className="auth-label">
              Date of Birth <span className="req-star">*</span>
            </label>
            <div className="auth-input-wrapper">
              <span className="input-prefix-icon"><Calendar size={18} /></span>
              <input
                id="reg-dob"
                type="date"
                name="dob"
                className="form-control auth-input with-prefix"
                value={formData.dob}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-gender" className="auth-label">
              Gender <span className="req-star">*</span>
            </label>
            <select
              id="reg-gender"
              name="gender"
              className="form-select auth-input"
              value={formData.gender}
              onChange={handleChange}
              disabled={isLoading}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>

        {/* Phone & Email 2-Col Grid */}
        <div className="form-row-2col mb-3">
          <div className="form-group">
            <label htmlFor="reg-phone" className="auth-label">
              Phone Number <span className="req-star">*</span>
            </label>
            <div className="auth-input-wrapper">
              <span className="input-prefix-icon"><Phone size={18} /></span>
              <input
                id="reg-phone"
                type="tel"
                name="phone"
                className="form-control auth-input with-prefix"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-email" className="auth-label">
              Email Address <span className="req-star">*</span>
            </label>
            <div className="auth-input-wrapper">
              <span className="input-prefix-icon"><Mail size={18} /></span>
              <input
                id="reg-email"
                type="email"
                name="email"
                className="form-control auth-input with-prefix"
                placeholder="patient@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="form-group mb-3">
          <label htmlFor="reg-password" className="auth-label">
            Password <span className="req-star">*</span>
          </label>
          <div className="auth-input-wrapper">
            <span className="input-prefix-icon"><Lock size={18} /></span>
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="form-control auth-input with-prefix with-suffix"
              placeholder="Create strong password"
              value={formData.password}
              onChange={handleChange}
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

          {/* Live Password Strength Meter */}
          {formData.password && (
            <PasswordStrengthMeter password={formData.password} />
          )}
        </div>

        {/* Confirm Password */}
        <div className="form-group mb-3">
          <label htmlFor="reg-confirm-password" className="auth-label">
            Confirm Password <span className="req-star">*</span>
          </label>
          <div className="auth-input-wrapper">
            <span className="input-prefix-icon"><Lock size={18} /></span>
            <input
              id="reg-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              className="form-control auth-input with-prefix with-suffix"
              placeholder="Confirm strong password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              className="input-suffix-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <small className="text-danger mt-1 d-block font-weight-medium">
              Passwords do not match.
            </small>
          )}
        </div>

        {/* Terms & Privacy Agreement */}
        <div className="form-group mb-4">
          <label className="remember-me-checkbox" htmlFor="reg-terms-check">
            <input
              type="checkbox"
              id="reg-terms-check"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
            <span className="checkbox-custom" />
            <span className="checkbox-text">
              I agree to the <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms of Service: You agree to provide accurate medical information.'); }}>Terms of Service</a> and <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Policy: Medical records are protected under healthcare regulations.'); }}>Privacy Policy</a>. <span className="req-star">*</span>
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="btn-patient-signup"
          className="btn-auth-primary w-100"
          disabled={isLoading || !formData.agreeTerms}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="auth-card-footer mt-4 text-center">
        <p className="text-muted text-sm mb-0">
          Already registered on MediTrack?{' '}
          <button
            type="button"
            className="btn-link-action-inline"
            onClick={() => onNavigate('login')}
          >
            Sign In Here
          </button>
        </p>
      </div>
    </div>
  );
};

export default PatientSignupForm;
