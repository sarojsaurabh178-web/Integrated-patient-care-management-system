import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  RotateCw, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';
import OtpInput from './OtpInput';
import { authService } from '../../services/authService';

const OtpVerificationForm = ({ 
  otpData = {}, 
  onNavigate, 
  onOtpVerified 
}) => {
  const { 
    identifier = '', 
    maskedTarget = '', 
    cooldownSeconds = 30, 
    demoOtpCode = '849201' 
  } = otpData;

  const [otpValue, setOtpValue] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(cooldownSeconds || 30);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successNotice, setSuccessNotice] = useState(null);

  // Countdown timer for resend
  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining]);

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    if (otpValue.length === 6 && !isLoading) {
      handleVerify(otpValue);
    }
  }, [otpValue]);

  const handleVerify = async (codeToVerify) => {
    const code = codeToVerify || otpValue;
    if (code.length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await authService.verifyOtp(identifier, code);
      setSuccessNotice('OTP code verified successfully.');
      setTimeout(() => {
        onOtpVerified({
          identifier,
          resetToken: result.resetToken
        });
        onNavigate('create_new_password');
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (secondsRemaining > 0 || isLoading) return;
    setErrorMessage(null);
    setSuccessNotice(null);
    setIsLoading(true);

    try {
      const result = await authService.sendOtp(identifier || 'demo@meditrack.org');
      setSecondsRemaining(result.cooldownSeconds || 30);
      setSuccessNotice('A new verification code has been dispatched.');
      setOtpValue('');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to resend verification code.');
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
          onClick={() => onNavigate('forgot_password')}
          disabled={isLoading}
        >
          <ArrowLeft size={16} />
          <span>Change Email/Phone</span>
        </button>

        <div className="auth-badge-header mt-2">
          <span className="badge-pill-primary">Two-Factor Security</span>
        </div>
        <h2 className="auth-main-title">Verify OTP</h2>
        <p className="auth-main-subtitle">
          We've sent a 6-digit verification code to{' '}
          <strong className="text-primary">{maskedTarget || identifier || 'your registered contact'}</strong>.
        </p>
      </div>

      {/* Error & Success States */}
      {errorMessage && (
        <div className="auth-alert auth-alert-danger" role="alert" aria-live="assertive">
          <AlertCircle size={18} className="alert-icon flex-shrink-0" />
          <div className="alert-content">
            <strong>Verification Error:</strong> {errorMessage}
          </div>
        </div>
      )}

      {successNotice && (
        <div className="auth-alert auth-alert-success" role="alert">
          <CheckCircle2 size={18} className="alert-icon flex-shrink-0" />
          <div className="alert-content">
            {successNotice}
          </div>
        </div>
      )}

      {/* 6-Digit OTP Box Component */}
      <div className="otp-section-wrapper my-4">
        <label className="auth-label text-center d-block mb-2">
          Enter 6-Digit Verification Passcode
        </label>

        <OtpInput
          length={6}
          value={otpValue}
          onChange={(val) => {
            setOtpValue(val);
            if (errorMessage) setErrorMessage(null);
          }}
          disabled={isLoading}
          isInvalid={Boolean(errorMessage)}
        />

        {/* Demo Assistant helper for testing convenience */}
        <div className="otp-testing-helper mt-3">
          <span className="helper-label">Demo Simulation Passcode:</span>
          <button
            type="button"
            className="btn-paste-demo-otp"
            onClick={() => setOtpValue(demoOtpCode || '849201')}
            title="Click to auto-fill demo OTP"
          >
            {demoOtpCode || '849201'} (Click to auto-fill)
          </button>
        </div>
      </div>

      {/* Submit Verification Button */}
      <button
        type="button"
        id="btn-verify-otp"
        className="btn-auth-primary w-100 mb-3"
        onClick={() => handleVerify(otpValue)}
        disabled={isLoading || otpValue.length !== 6}
      >
        {isLoading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
            <span>Verifying...</span>
          </>
        ) : (
          <>
            <span>Verify & Continue</span>
            <ArrowRight size={18} />
          </>
        )}
      </button>

      {/* Resend Cooldown Section */}
      <div className="otp-resend-row">
        <span className="text-muted text-sm">Didn't receive the code?</span>
        {secondsRemaining > 0 ? (
          <span className="cooldown-timer">
            <Clock size={14} className="me-1" />
            Resend OTP in <strong>{secondsRemaining}s</strong>
          </span>
        ) : (
          <button
            type="button"
            className="btn-resend-otp"
            onClick={handleResend}
            disabled={isLoading}
          >
            <RotateCw size={14} className="me-1" />
            Resend OTP
          </button>
        )}
      </div>

      <div className="auth-card-footer mt-4 text-center">
        <button
          type="button"
          className="btn-link-action-inline"
          onClick={() => onNavigate('login')}
        >
          Cancel & Return to Login
        </button>
      </div>
    </div>
  );
};

export default OtpVerificationForm;
