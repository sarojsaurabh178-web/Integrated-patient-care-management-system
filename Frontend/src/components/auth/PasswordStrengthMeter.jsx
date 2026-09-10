import React from 'react';
import { Check, X } from 'lucide-react';
import { evaluatePasswordStrength } from '../../services/authService';

const PasswordStrengthMeter = ({ password = '' }) => {
  const { criteria, level, percent } = evaluatePasswordStrength(password);

  const getBarColorClass = () => {
    if (level === 'Strong') return 'strength-strong';
    if (level === 'Medium') return 'strength-medium';
    return 'strength-weak';
  };

  const getLevelLabelColor = () => {
    if (level === 'Strong') return 'text-success';
    if (level === 'Medium') return 'text-warning';
    return 'text-danger';
  };

  const rules = [
    { key: 'minLength', label: 'At least 8 characters' },
    { key: 'hasUpper', label: 'One uppercase letter (A-Z)' },
    { key: 'hasLower', label: 'One lowercase letter (a-z)' },
    { key: 'hasNumber', label: 'One numeric digit (0-9)' },
    { key: 'hasSpecial', label: 'One special symbol (!@#$%^&*)' }
  ];

  return (
    <div className="password-strength-container" aria-live="polite">
      {/* Strength Progress Bar */}
      <div className="strength-meter-header">
        <span className="strength-title">Security Strength:</span>
        <span className={`strength-badge ${getLevelLabelColor()}`}>
          {password ? level : 'Not entered'}
        </span>
      </div>

      <div className="strength-bar-track">
        <div
          className={`strength-bar-fill ${getBarColorClass()}`}
          style={{ width: password ? `${percent}%` : '0%' }}
        />
      </div>

      {/* Criteria Checklist */}
      <ul className="password-rules-list">
        {rules.map((rule) => {
          const isMet = Boolean(criteria[rule.key]);
          return (
            <li key={rule.key} className={`password-rule-item ${isMet ? 'met' : 'unmet'}`}>
              <span className="rule-icon-box">
                {isMet ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={2.5} />}
              </span>
              <span className="rule-label">{rule.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordStrengthMeter;
