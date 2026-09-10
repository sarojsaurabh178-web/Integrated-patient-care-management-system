import apiClient, { ApiError } from './api';
import { ROLES } from '../data/mockAuthUsers';

// Utility helpers for identifier detection & validation
export const isEmail = (val) => {
  if (!val) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
};

export const isPhone = (val) => {
  if (!val) return false;
  const digitsOnly = val.replace(/\D/g, '');
  return digitsOnly.length >= 8 && digitsOnly.length <= 15;
};

export const normalizePhone = (val) => {
  return val ? val.replace(/\D/g, '') : '';
};

// Password criteria validator
export const evaluatePasswordStrength = (pwd = '') => {
  const criteria = {
    minLength: pwd.length >= 8,
    hasUpper: /[A-Z]/.test(pwd),
    hasLower: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecial: /[^A-Za-z0-9]/.test(pwd)
  };

  const score = Object.values(criteria).filter(Boolean).length;
  let level = 'Weak';
  let percent = 20;

  if (score >= 5) {
    level = 'Strong';
    percent = 100;
  } else if (score >= 3) {
    level = 'Medium';
    percent = 60;
  } else {
    level = 'Weak';
    percent = Math.max(20, score * 20);
  }

  return {
    criteria,
    score,
    level,
    percent,
    isValid: score === 5
  };
};

export const authService = {
  /**
   * Performs user login with either email or phone number.
   * Connects to Python FastAPI backend -> PostgreSQL.
   */
  login: async ({ identifier, password, rememberMe = false, demoRole = null }) => {
    if (!identifier || !identifier.trim() || !password) {
      throw new Error('Please enter both identifier and password.');
    }

    try {
      const payload = {
        identifier: identifier.trim(),
        password: password
      };

      const result = await apiClient.post('/auth/login', payload);

      if (result && result.token && result.user) {
        // Save safe authentication token
        sessionStorage.setItem('meditrack_auth_token', result.token);

        // Map backend role to frontend application role
        const rawRole = (result.user.role || 'Doctor').toUpperCase();
        let appRole = ROLES.DOCTOR;
        if (rawRole.includes('PATIENT')) appRole = ROLES.PATIENT;
        else if (rawRole.includes('ADMIN')) appRole = ROLES.ADMINISTRATOR;
        else if (rawRole.includes('DOCTOR')) appRole = ROLES.DOCTOR;

        const session = {
          userId: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: appRole,
          specialty: result.user.specialty,
          token: result.token,
          authenticatedAt: new Date().toISOString()
        };

        sessionStorage.setItem('meditrack_auth_session', JSON.stringify(session));

        if (rememberMe) {
          localStorage.setItem('meditrack_safe_identifier', identifier.trim());
        } else {
          localStorage.removeItem('meditrack_safe_identifier');
        }

        return {
          success: true,
          user: session,
          role: appRole,
          token: result.token
        };
      }
      throw new Error('Malformed authentication response from server.');
    } catch (err) {
      // If backend error has specific detail message
      if (err instanceof ApiError) {
        throw new Error(err.message || 'Invalid email/phone or password.');
      }

      // Offline fallback for demo testing convenience
      if (demoRole && (password === '••••••••' || password === 'demo123' || password === 'password')) {
        const fallbackSession = {
          userId: `usr_demo_${demoRole.toLowerCase()}`,
          name: demoRole === 'DOCTOR' ? 'Dr. Sarah Jenkins' : demoRole === 'PATIENT' ? 'Rahul Verma' : 'System Admin',
          email: identifier.trim(),
          role: demoRole,
          token: 'demo_token_' + Date.now(),
          authenticatedAt: new Date().toISOString()
        };
        sessionStorage.setItem('meditrack_auth_session', JSON.stringify(fallbackSession));
        return {
          success: true,
          user: fallbackSession,
          role: demoRole,
          token: fallbackSession.token
        };
      }

      throw new Error(err.message || 'Authentication failed. Please check your credentials.');
    }
  },

  /**
   * Registers a new Public User / Patient on the PostgreSQL backend
   */
  registerPatient: async ({ fullName, dob, gender, phone, email, password }) => {
    if (!fullName || !phone || !email || !password) {
      throw new Error('Please fill in all required fields.');
    }

    if (!isEmail(email)) {
      throw new Error('Please enter a valid email address.');
    }

    if (!isPhone(phone)) {
      throw new Error('Please enter a valid phone number with country code.');
    }

    const strength = evaluatePasswordStrength(password);
    if (!strength.isValid) {
      throw new Error('Password does not meet all security complexity requirements.');
    }

    try {
      const payload = {
        username: email.split('@')[0],
        email: email.trim(),
        phone: phone.trim(),
        fullName: fullName.trim(),
        password: password,
        role: 'Patient'
      };

      const result = await apiClient.post('/auth/register', payload);

      return {
        success: true,
        user: result.user,
        message: 'Account created successfully. You can now sign in to your Patient Portal.'
      };
    } catch (err) {
      if (err instanceof ApiError) {
        throw new Error(err.message || 'Registration failed.');
      }
      throw new Error(err.message || 'Unable to register patient account. Please try again.');
    }
  },

  /**
   * Submits a Doctor Registration application.
   * Status is PENDING_APPROVAL.
   */
  requestDoctorAccess: async ({ fullName, email, phone, licenseNumber, specialization, department, password }) => {
    if (!fullName || !email || !phone || !licenseNumber || !specialization || !password) {
      throw new Error('Please complete all doctor verification and credential fields.');
    }

    try {
      // Doctor accounts require administrative approval
      const payload = {
        username: email.split('@')[0],
        email: email.trim(),
        phone: phone.trim(),
        name: fullName.startsWith('Dr.') ? fullName : `Dr. ${fullName}`,
        password: password,
        role: 'Doctor'
      };

      // Register account in system
      await apiClient.post('/auth/register', payload);

      return {
        success: true,
        application: {
          name: fullName,
          licenseNumber,
          specialization,
          department: department || 'General Medicine'
        },
        status: 'PENDING_APPROVAL',
        message: 'Medical license registration submitted for verification. An administrator will review your medical credentials.'
      };
    } catch (err) {
      if (err instanceof ApiError) {
        throw new Error(err.message);
      }
      throw new Error(err.message || 'Doctor access application submission failed.');
    }
  },

  /**
   * Initiates password recovery by sending an OTP to email or phone.
   */
  sendOtp: async (identifier) => {
    if (!identifier || !identifier.trim()) {
      throw new Error('Please provide your registered email or phone number.');
    }

    try {
      const result = await apiClient.post('/auth/forgot-password', { identifier: identifier.trim() });
      const clean = identifier.trim();
      return {
        success: true,
        maskedTarget: isEmail(clean) 
          ? clean.replace(/(.{2})(.*)(?=@)/, (gp1, gp2, gp3) => gp2 + '***')
          : clean.slice(0, 3) + ' ••••• ' + clean.slice(-3),
        cooldownSeconds: result.cooldownSeconds || 30,
        demoOtpCode: '849201'
      };
    } catch (err) {
      throw new Error(err.message || 'Unable to dispatch OTP code.');
    }
  },

  /**
   * Verifies the 6-digit OTP.
   */
  verifyOtp: async (identifier, otpCode) => {
    if (!otpCode || otpCode.length !== 6) {
      throw new Error('Please enter the full 6-digit verification code.');
    }

    try {
      const result = await apiClient.post('/auth/verify-otp', {
        identifier: identifier.trim(),
        otp: otpCode.trim()
      });

      return {
        success: true,
        resetToken: result.resetToken || 'rst_valid',
        message: 'Code verified successfully.'
      };
    } catch (err) {
      throw new Error(err.message || 'Invalid OTP code.');
    }
  },

  /**
   * Resets the user's password using the verified reset token.
   */
  resetPassword: async ({ identifier, resetToken, newPassword, confirmPassword }) => {
    if (!newPassword || !confirmPassword) {
      throw new Error('Please enter and confirm your new password.');
    }

    if (newPassword !== confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    const strength = evaluatePasswordStrength(newPassword);
    if (!strength.isValid) {
      throw new Error('Password does not satisfy complexity requirements.');
    }

    try {
      const result = await apiClient.post('/auth/reset-password', {
        identifier: identifier.trim(),
        resetToken,
        newPassword
      });

      return {
        success: true,
        message: result.message || 'Your password has been updated successfully.'
      };
    } catch (err) {
      throw new Error(err.message || 'Failed to update password.');
    }
  },

  /**
   * Session Management
   */
  logout: () => {
    sessionStorage.removeItem('meditrack_auth_token');
    sessionStorage.removeItem('meditrack_auth_session');
  },

  getCurrentSession: () => {
    try {
      const raw = sessionStorage.getItem('meditrack_auth_session');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      return null;
    }
    return null;
  },

  getSavedIdentifier: () => {
    return localStorage.getItem('meditrack_safe_identifier') || '';
  }
};
