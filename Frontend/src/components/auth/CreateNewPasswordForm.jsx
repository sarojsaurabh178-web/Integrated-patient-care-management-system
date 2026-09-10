import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import { authService, evaluatePasswordStrength } from '../../services/authService';

const CreateNewPasswordForm = ({ resetSessionData = {}, onNavigate, onResetSuccess }) => {
  const { identifier = '', resetToken = '' } = resetSessionData;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const strength = evaluatePasswordStrength(newPassword);
  const isMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const isMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const canSubmit = strength.isValid && isMatch && !isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!strength.isValid) {
      setErrorMessage('Please satisfy all password complexity requirements before continuing.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword({
        identifier,
        resetToken,
        newPassword,
        confirmPassword
      });

      onResetSuccess();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update password. Session may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card-body">
      <div className="auth-card-header">
        <div className="auth-badge-header">
          <span className="badge-pill-success">Identity Verified</span>
        </div>
        <h2 className="auth-main-title">Create New Password</h2>
        <p className="auth-main-subtitle">
          Ensure your new password meets healthcare compliance and security standards.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="auth-alert auth-alert-danger" role="alert">
          <AlertCircle size={18} className="alert-icon flex-shrink-0" />
          <div className="alert-content">
            <strong>Security Alert:</strong> {errorMessage}
          </div>
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {/* New Password */}
        <div className="form-group mb-3">
          <label htmlFor="input-new-password" className="auth-label">
            New Password <span className="req-star">*</span>
          </label>
          <div className="auth-input-wrapper">
            <span className="input-prefix-icon"><Lock size={18} /></span>
            <input
              id="input-new-password"
              type={showNewPassword ? 'text' : 'password'}
              className="form-control auth-input with-prefix with-suffix"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              className="input-suffix-btn"
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Password Strength Checklist & Bar */}
          <PasswordStrengthMeter password={newPassword} />
        </div>

        {/* Confirm New Password */}
        <div className="form-group mb-4">
          <label htmlFor="input-confirm-new-password" className="auth-label">
            Confirm New Password <span className="req-star">*</span>
          </label>
          <div className="auth-input-wrapper">
            <span className="input-prefix-icon"><Lock size={18} /></span>
            <input
              id="input-confirm-new-password"
              type={showConfirmPassword ? 'text' : 'password'}
              className={`form-control auth-input with-prefix with-suffix ${isMismatch ? 'is-invalid' : ''}`}
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          {isMismatch && (
            <small className="text-danger mt-1 d-block font-weight-medium">
              Passwords do not match.
            </small>
          )}
          {isMatch && (
            <small className="text-success mt-1 d-flex align-items-center gap-1 font-weight-medium">
              <CheckCircle2 size={13} /> Passwords match perfectly.
            </small>
          )}
        </div>

        {/* Reset Password Button */}
        <button
          type="submit"
          id="btn-confirm-new-password"
          className="btn-auth-primary w-100"
          disabled={!canSubmit}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
              <span>Updating password...</span>
            </>
          ) : (
            <>
              <span>Reset Password</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateNewPasswordForm;
