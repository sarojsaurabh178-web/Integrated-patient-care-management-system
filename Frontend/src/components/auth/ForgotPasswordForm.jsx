import React, { useState } from 'react';
import { Mail, Phone, ArrowRight, ArrowLeft, AlertCircle, KeyRound } from 'lucide-react';
import { authService, isEmail, isPhone } from '../../services/authService';

const ForgotPasswordForm = ({ onNavigate, onOtpSent }) => {
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    const clean = identifier.trim();
    if (!clean) {
      setErrorMessage('Please enter your registered email address or phone number.');
      return;
    }

    if (!isEmail(clean) && !isPhone(clean)) {
      setErrorMessage('Please enter a valid email address or phone number.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.sendOtp(clean);
      onOtpSent({
        identifier: clean,
        maskedTarget: result.maskedTarget,
        cooldownSeconds: result.cooldownSeconds,
        demoOtpCode: result.demoOtpCode
      });
      onNavigate('verify_otp');
    } catch (err) {
      setErrorMessage(err.message || 'Unable to dispatch verification code. Please check details.');
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
          <span className="badge-pill-primary">Password Recovery</span>
        </div>
        <h2 className="auth-main-title">Reset Your Password</h2>
        <p className="auth-main-subtitle">
          Enter your registered email or phone number and we'll send you a 6-digit verification code.
        </p>
      </div>

      {errorMessage && (
        <div className="auth-alert auth-alert-danger" role="alert">
          <AlertCircle size={18} className="alert-icon flex-shrink-0" />
          <div className="alert-content">
            <strong>Error:</strong> {errorMessage}
          </div>
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group mb-4">
          <label htmlFor="recovery-identifier" className="auth-label">
            Registered Email or Phone Number <span className="req-star">*</span>
          </label>
          <div className="auth-input-wrapper">
            <span className="input-prefix-icon">
              {isPhone(identifier) ? <Phone size={18} /> : <Mail size={18} />}
            </span>
            <input
              id="recovery-identifier"
              type="text"
              name="identifier"
              className="form-control auth-input with-prefix"
              placeholder="name@example.com or +91 98765 43210"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <small className="field-hint-text">
            We will verify your identity with a one-time passcode (OTP) before allowing password reset.
          </small>
        </div>

        <button
          type="submit"
          id="btn-send-otp"
          className="btn-auth-primary w-100"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
              <span>Sending OTP...</span>
            </>
          ) : (
            <>
              <span>Send OTP Verification Code</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="auth-card-footer mt-4 text-center">
        <p className="text-muted text-sm mb-0">
          Remembered your password?{' '}
          <button
            type="button"
            className="btn-link-action-inline"
            onClick={() => onNavigate('login')}
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
