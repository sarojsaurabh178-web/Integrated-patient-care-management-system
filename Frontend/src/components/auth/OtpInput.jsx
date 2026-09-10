import React, { useRef, useEffect } from 'react';

const OtpInput = ({ length = 6, value = '', onChange, disabled = false, isInvalid = false }) => {
  const inputRefs = useRef([]);

  // Ensure array of values matching length
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  useEffect(() => {
    // Focus first empty or first input on mount
    const firstEmptyIndex = digits.findIndex((d) => !d);
    const targetIndex = firstEmptyIndex === -1 ? 0 : firstEmptyIndex;
    if (inputRefs.current[targetIndex] && !disabled) {
      inputRefs.current[targetIndex].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const val = e.target.value;
    // Extract last typed digit (numbers only)
    const numericChar = val.replace(/\D/g, '').slice(-1);

    const newDigits = [...digits];
    newDigits[index] = numericChar;
    const newOtp = newDigits.join('');
    onChange(newOtp);

    // Auto-advance to next input if digit entered
    if (numericChar && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Current empty, delete previous and move back
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current digit
        const newDigits = [...digits];
        newDigits[index] = '';
        onChange(newDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);
    if (!pastedData) return;

    onChange(pastedData);

    const nextFocusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  return (
    <div className={`otp-boxes-container ${isInvalid ? 'is-invalid' : ''}`} onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[index]}
          disabled={disabled}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={(e) => e.target.select()}
          className={`otp-digit-box ${digits[index] ? 'has-value' : ''} ${isInvalid ? 'error' : ''}`}
          aria-label={`Digit ${index + 1} of verification code`}
        />
      ))}
    </div>
  );
};

export default OtpInput;
