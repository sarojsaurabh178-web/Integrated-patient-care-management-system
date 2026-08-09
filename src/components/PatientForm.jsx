import React, { useState, useEffect } from 'react';
import { UserPlus, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';

const PatientForm = ({ nextPatientId, onRegisterPatient }) => {
  const initialFormState = {
    name: '',
    age: '',
    gender: '',
    dob: '',
    phone: '',
    email: '',
    address: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Reset form when nextPatientId updates after successful registration
  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    setTouched({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error dynamically as user types if field was previously errored
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const validateField = (fieldName, value) => {
    let errorMsg = '';
    const trimmedVal = typeof value === 'string' ? value.trim() : value;

    switch (fieldName) {
      case 'name':
        if (!trimmedVal) {
          errorMsg = 'Full name is required.';
        } else if (trimmedVal.length < 2) {
          errorMsg = 'Name must be at least 2 characters.';
        }
        break;

      case 'age':
        if (!trimmedVal && trimmedVal !== 0) {
          errorMsg = 'Please enter a valid age.';
        } else {
          const ageNum = Number(trimmedVal);
          if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
            errorMsg = 'Please enter a valid age (1-120).';
          }
        }
        break;

      case 'gender':
        if (!trimmedVal || trimmedVal === 'Select Gender') {
          errorMsg = 'Please select gender.';
        }
        break;

      case 'dob':
        if (!trimmedVal) {
          errorMsg = 'Date of birth is required.';
        }
        break;

      case 'phone':
        if (!trimmedVal) {
          errorMsg = 'Please enter a valid phone number.';
        } else {
          const phoneRegex = /^[6-9]\d{9}$/;
          if (!phoneRegex.test(trimmedVal)) {
            errorMsg = 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).';
          }
        }
        break;

      case 'email':
        if (!trimmedVal) {
          errorMsg = 'Please enter a valid email address.';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(trimmedVal)) {
            errorMsg = 'Please enter a valid email address.';
          }
        }
        break;

      case 'address':
        if (!trimmedVal) {
          errorMsg = 'Address is required.';
        } else if (trimmedVal.length < 5) {
          errorMsg = 'Address must be at least 5 characters long.';
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
    return !errorMsg;
  };

  const validateAll = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    else if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters.';

    if (!formData.age && formData.age !== 0) newErrors.age = 'Please enter a valid age.';
    else {
      const ageNum = Number(formData.age);
      if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) newErrors.age = 'Please enter a valid age (1-120).';
    }

    if (!formData.gender || formData.gender === 'Select Gender') newErrors.gender = 'Please select gender.';

    if (!formData.dob) newErrors.dob = 'Date of birth is required.';

    if (!formData.phone.trim()) newErrors.phone = 'Please enter a valid phone number.';
    else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (!formData.email.trim()) newErrors.email = 'Please enter a valid email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.address.trim()) newErrors.address = 'Address is required.';

    setErrors(newErrors);
    setTouched({
      name: true,
      age: true,
      gender: true,
      dob: true,
      phone: true,
      email: true,
      address: true
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateAll();

    if (isValid) {
      const newPatientRecord = {
        id: nextPatientId,
        name: formData.name.trim(),
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        dob: formData.dob,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        status: 'Active',
        registeredAt: new Date().toISOString().split('T')[0]
      };

      onRegisterPatient(newPatientRecord);
      handleReset();
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <UserPlus className="card-title-icon" size={20} />
          New Patient Details
        </h2>
        <span className="patient-count-badge">System Auto-ID Enabled</span>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            {/* 1. Patient ID (Read-only) */}
            <div className="form-group">
              <label className="form-label" htmlFor="patientId">
                Patient ID
              </label>
              <input
                type="text"
                id="patientId"
                name="patientId"
                className="form-control"
                value={nextPatientId}
                readOnly
              />
            </div>

            {/* 2. Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Enter patient's full name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.name && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* 3. Age */}
            <div className="form-group">
              <label className="form-label" htmlFor="age">
                Age <span className="required-star">*</span>
              </label>
              <input
                type="number"
                id="age"
                name="age"
                min="1"
                max="120"
                className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                placeholder="Enter age"
                value={formData.age}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.age && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{errors.age}</span>
                </div>
              )}
            </div>

            {/* 4. Gender */}
            <div className="form-group">
              <label className="form-label" htmlFor="gender">
                Gender <span className="required-star">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                value={formData.gender}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{errors.gender}</span>
                </div>
              )}
            </div>

            {/* 5. Date of Birth */}
            <div className="form-group">
              <label className="form-label" htmlFor="dob">
                Date of Birth <span className="required-star">*</span>
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
                value={formData.dob}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.dob && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{errors.dob}</span>
                </div>
              )}
            </div>

            {/* 6. Phone Number */}
            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Phone Number <span className="required-star">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                maxLength="10"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                placeholder="Enter 10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.phone && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{errors.phone}</span>
                </div>
              )}
            </div>

            {/* 7. Email Address */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="email">
                Email Address <span className="required-star">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* 8. Residential Address */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="address">
                Residential Address <span className="required-star">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                placeholder="Enter complete residential address"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
              ></textarea>
              {errors.address && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{errors.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              <RotateCcw size={16} />
              Reset
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} />
              Register Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
