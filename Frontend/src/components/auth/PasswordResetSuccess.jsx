import React from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

const PasswordResetSuccess = ({ onReturnToLogin }) => {
  return (
    <div className="auth-card-body text-center py-4">
      <div className="status-success-container">
        {/* Animated Checkmark Circle */}
        <div className="success-icon-pulsing">
          <CheckCircle2 size={54} className="text-success" strokeWidth={2.5} />
        </div>

        <div className="status-header mt-3">
          <div className="badge-pill-success mx-auto mb-2 d-inline-flex">
            Account Secured
          </div>
          <h2 className="auth-main-title">Password Reset Successful</h2>
          <p className="auth-main-subtitle max-w-sm mx-auto">
            Your password has been updated successfully. Your previous sessions and temporary reset tokens have been invalidated for security.
          </p>
        </div>

        <div className="security-policy-callout my-4 text-start">
          <ShieldCheck size={20} className="text-success flex-shrink-0" />
          <div className="text-sm">
            <strong>Security Confirmation:</strong> You can now sign in with your new credentials across all web and mobile MediTrack portals.
          </div>
        </div>

        <button
          type="button"
          id="btn-return-login"
          className="btn-auth-primary w-100"
          onClick={onReturnToLogin}
        >
          <span>Return to Login</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;
