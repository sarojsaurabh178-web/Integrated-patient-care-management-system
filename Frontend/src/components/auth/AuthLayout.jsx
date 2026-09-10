import React from 'react';
import { Activity, ShieldCheck, Lock, HeartPulse, UserCheck, CheckCircle2 } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

const AuthLayout = ({ children, activeView, theme, toggleTheme, onSelectView }) => {
  return (
    <div className="auth-master-page">
      {/* Top Utility Bar for Theme Switch & Quick Access */}
      <header className="auth-top-bar">
        <div className="auth-top-inner">
          <div className="auth-top-brand" onClick={() => onSelectView('login')}>
            <div className="auth-brand-glyph">
              <Activity size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="auth-brand-text">
              <span className="auth-brand-title">MediTrack</span>
              <span className="auth-brand-tag">Healthcare Platform</span>
            </div>
          </div>

          <div className="auth-top-actions">
            {theme && toggleTheme && (
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            )}
          </div>
        </div>
      </header>

      {/* Main Split Body */}
      <div className="auth-split-wrapper">
        {/* Left Side: Healthcare Trust & System Information (Desktop) */}
        <aside className="auth-hero-panel" aria-label="Healthcare Information">
          <div className="hero-panel-decorations">
            <div className="decor-blob blob-1" />
            <div className="decor-blob blob-2" />
          </div>

          <div className="hero-content-inner">
            <div className="hero-header-badge">
              <HeartPulse size={16} className="pulse-icon" />
              <span>Enterprise Clinical Care Portal</span>
            </div>

            <h1 className="hero-headline">
              Secure, Unified Care Management for Patients & Providers
            </h1>

            <p className="hero-description">
              MediTrack connects doctors, patients, and healthcare administrators into a high-security, 
              HIPAA-aligned digital ecosystem for appointments, clinical consultations, and records.
            </p>

            {/* Feature Highlights Grid */}
            <div className="hero-features-grid">
              <div className="hero-feature-card">
                <div className="feature-icon">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="feature-title">Role-Based Authorization</div>
                  <div className="feature-desc">Separated workflows for Patients, Doctors, and System Admins.</div>
                </div>
              </div>

              <div className="hero-feature-card">
                <div className="feature-icon">
                  <Lock size={20} />
                </div>
                <div>
                  <div className="feature-title">Dual Identifier Access</div>
                  <div className="feature-desc">Sign in with verified Email or registered Phone Number with 6-digit OTP recovery.</div>
                </div>
              </div>

              <div className="hero-feature-card">
                <div className="feature-icon">
                  <UserCheck size={20} />
                </div>
                <div>
                  <div className="feature-title">Credentialed Doctor Approval</div>
                  <div className="feature-desc">Strict medical license verification protecting clinical operations.</div>
                </div>
              </div>
            </div>

            {/* Compliance & System Status Badge */}
            <div className="hero-status-footer">
              <div className="status-pill">
                <span className="status-dot-green" />
                <span>System Operational • REST API Ready</span>
              </div>
              <div className="compliance-tags">
                <span className="compliance-tag">HIPAA Compliant</span>
                <span className="compliance-tag">AES-256</span>
                <span className="compliance-tag">ISO 27001</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side: Auth Container Form Card */}
        <section className="auth-form-panel">
          <div className="auth-card-wrapper">
            {children}
          </div>

          {/* Accessible Footer */}
          <footer className="auth-footer-notice">
            <p>© {new Date().getFullYear()} MediTrack Inc. All rights reserved. Hospital Information Management System.</p>
            <div className="auth-footer-links">
              <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('MediTrack Privacy Policy: All medical data is stored under HIPAA and local health data governance protocols.'); }}>
                Privacy Policy
              </a>
              <span className="dot-sep">•</span>
              <a href="#terms" onClick={(e) => { e.preventDefault(); alert('MediTrack Terms of Service: Intended strictly for authorized healthcare professionals and registered patients.'); }}>
                Terms of Service
              </a>
              <span className="dot-sep">•</span>
              <a href="#support" onClick={(e) => { e.preventDefault(); alert('MediTrack Support: Please contact it-support@meditrack.org or your clinical supervisor.'); }}>
                IT Helpdesk
              </a>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
};

export default AuthLayout;
