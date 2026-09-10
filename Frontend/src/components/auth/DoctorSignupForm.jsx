import React, { useState } from 'react';
import { 
  Stethoscope, 
  Mail, 
  Phone, 
  FileText, 
  Building2, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  AlertCircle 
} from 'lucide-react';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import { authService, evaluatePasswordStrength, isEmail, isPhone } from '../../services/authService';

const DoctorSignupForm = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    specialization: 'Cardiology',
    department: 'Cardiology & Heart Care',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null); // null or { status: 'PENDING_APPROVAL', application }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full physician or surgeon name.');
      return;
    }

    if (!isEmail(formData.email)) {
      setErrorMessage('Please enter a valid professional hospital/institutional email address.');
      return;
    }

    if (!isPhone(formData.phone)) {
      setErrorMessage('Please enter a valid contact phone number.');
      return;
    }

    if (!formData.licenseNumber.trim()) {
      setErrorMessage('Please provide your valid Medical Council Registration or License number.');
      return;
    }

    const strength = evaluatePasswordStrength(formData.password);
    if (!strength.isValid) {
      setErrorMessage('Password must satisfy all clinical security criteria.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.requestDoctorAccess(formData);
      setSubmissionStatus(result);
    } catch (err) {
      setErrorMessage(err.message || 'Application submission failed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submissionStatus) {
    return (
      <div className="auth-card-body">
        <div className="status-success-container">
          <div className="status-badge-icon warning-pulse">
            <Clock size={40} className="text-warning" />
          </div>

          <div className="status-header">
            <span className="badge-pill-warning">Application Submitted</span>
            <h2 className="auth-main-title mt-2">Pending Administrator Approval</h2>
            <p className="auth-main-subtitle">
              Thank you, {submissionStatus.application?.name}. Your credentials have been logged under 
              License ID: <strong>{submissionStatus.application?.licenseNumber}</strong>.
            </p>
          </div>

          <div className="security-policy-callout">
            <ShieldAlert size={20} className="text-warning flex-shrink-0" />
            <div>
              <strong>Security Protocol Notice:</strong>
              <p className="mb-0 text-sm">
                To protect patient privacy, physician accounts cannot access clinical data until medical council accreditation is verified by a Chief Medical Officer or System Administrator.
              </p>
            </div>
          </div>

          <div className="application-details-summary">
            <div className="summary-row">
              <span className="summary-lbl">Specialty:</span>
              <span className="summary-val">{submissionStatus.application?.specialization}</span>
            </div>
            <div className="summary-row">
              <span className="summary-lbl">Department:</span>
              <span className="summary-val">{submissionStatus.application?.department}</span>
            </div>
            <div className="summary-row">
              <span className="summary-lbl">Status:</span>
              <span className="summary-val badge-pending">Pending Review</span>
            </div>
          </div>

          <button
            type="button"
            className="btn-auth-primary w-100 mt-4"
            onClick={() => onNavigate('login')}
          >
            <span>Return to Provider Sign In</span>
          </button>
        </div>
      </div>
    );
  }

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
          <span className="badge-pill-info">Doctor Access Request</span>
        </div>
        <h2 className="auth-main-title">Physician Credential Registration</h2>
        <p className="auth-main-subtitle">
          Submit your medical council credentials for hospital verification and OPD portal access.
        </p>
      </div>

      {/* Prominent Healthcare Verification Disclaimer */}
      <div className="medical-approval-notice">
        <ShieldAlert size={20} className="notice-icon flex-shrink-0" />
        <div>
          <strong>Medical Verification Required:</strong>
          <span> Doctor accounts require administrative review and credential verification before clinical authorization is granted.</span>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="auth-alert auth-alert-danger" role="alert">
          <AlertCircle size={18} className="alert-icon flex-shrink-0" />
          <div className="alert-content">
            <strong>Validation Error:</strong> {errorMessage}
          </div>
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className="form-group mb-3">
          <label htmlFor="doc-fullname" className="auth-label">
            Physician Full Name <span className="req-star">*</span>
          </label>
          <div className="auth-input-wrapper">
            <span className="input-prefix-icon"><Stethoscope size={18} /></span>
            <input
              id="doc-fullname"
              type="text"
              name="fullName"
              className="form-control auth-input with-prefix"
              placeholder="e.g. Dr. Sarah Jenkins"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="form-row-2col mb-3">
          <div className="form-group">
            <label htmlFor="doc-email" className="auth-label">
              Professional Email <span className="req-star">*</span>
            </label>
            <div className="auth-input-wrapper">
              <span className="input-prefix-icon"><Mail size={18} /></span>
              <input
                id="doc-email"
                type="email"
                name="email"
                className="form-control auth-input with-prefix"
                placeholder="doctor@hospital.org"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="doc-phone" className="auth-label">
              Phone Number <span className="req-star">*</span>
            </label>
            <div className="auth-input-wrapper">
              <span className="input-prefix-icon"><Phone size={18} /></span>
              <input
                id="doc-phone"
                type="tel"
                name="phone"
                className="form-control auth-input with-prefix"
                placeholder="+91 98765 43211"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>
        </div>

        {/* License Number & Specialization */}
        <div className="form-row-2col mb-3">
          <div className="form-group">
            <label htmlFor="doc-license" className="auth-label">
              Medical License / Reg No. <span className="req-star">*</span>
            </label>
            <div className="auth-input-wrapper">
              <span className="input-prefix-icon"><FileText size={18} /></span>
              <input
                id="doc-license"
                type="text"
                name="licenseNumber"
                className="form-control auth-input with-prefix"
                placeholder="MCI-984210-B"
                value={formData.licenseNumber}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="doc-specialization" className="auth-label">
              Specialization <span className="req-star">*</span>
            </label>
            <select
              id="doc-specialization"
              name="specialization"
              className="form-select auth-input"
              value={formData.specialization}
              onChange={handleChange}
              disabled={isLoading}
              required
            >
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Endocrinology">Endocrinology</option>
            </select>
          </div>
        </div>

        {/* Department */}
        <div className="form-group mb-3">
          <label htmlFor="doc-dept" className="auth-label">
            Hospital Department
          </label>
          <div className="auth-input-wrapper">
            <span className="input-prefix-icon"><Building2 size={18} /></span>
            <input
              id="doc-dept"
              type="text"
              name="department"
              className="form-control auth-input with-prefix"
              placeholder="e.g. Inpatient Cardiology Wing 3"
              value={formData.department}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-group mb-3">
          <label htmlFor="doc-pwd" className="auth-label">
            Create Password <span className="req-star">*</span>
          </label>
          <div className="auth-input-wrapper">
            <span className="input-prefix-icon"><Lock size={18} /></span>
            <input
              id="doc-pwd"
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="form-control auth-input with-prefix with-suffix"
              placeholder="Create strong provider password"
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
          {formData.password && (
            <PasswordStrengthMeter password={formData.password} />
          )}
        </div>

        {/* Confirm Password */}
        <div className="form-group mb-4">
          <label htmlFor="doc-confirm-pwd" className="auth-label">
            Confirm Password <span className="req-star">*</span>
          </label>
          <div className="auth-input-wrapper">
            <span className="input-prefix-icon"><Lock size={18} /></span>
            <input
              id="doc-confirm-pwd"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              className="form-control auth-input with-prefix with-suffix"
              placeholder="Confirm provider password"
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
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="btn-doctor-signup"
          className="btn-auth-primary w-100"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
              <span>Submitting Credential Dossier...</span>
            </>
          ) : (
            <span>Submit Application for Review</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default DoctorSignupForm;
