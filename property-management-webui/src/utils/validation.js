/**
 * Validates registration form data
 * @param {Object} formData - Registration form data
 * @returns {Object} - Validation errors
 */
export const validateRegistrationForm = (formData) => {
    const errors = {};
  
    // Username validation
    if (!formData.username || formData.username.trim() === '') {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters long';
    } else if (formData.username.length > 20) {
      errors.username = 'Username cannot exceed 20 characters';
    }
  
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || formData.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
  
    // Password validation
    if (!formData.password || formData.password.trim() === '') {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else {
      // Optional: Additional password strength checks
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasNumbers = /[0-9]/.test(formData.password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
  
      if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
        errors.password = 'Password must include uppercase, lowercase, numbers, and special characters';
      }
    }
  
    // First Name validation
    if (!formData.firstName || formData.firstName.trim() === '') {
      errors.firstName = 'First Name is required';
    } else if (formData.firstName.length < 2) {
      errors.firstName = 'First Name must be at least 2 characters long';
    }
  
    // Last Name validation
    if (!formData.lastName || formData.lastName.trim() === '') {
      errors.lastName = 'Last Name is required';
    } else if (formData.lastName.length < 2) {
      errors.lastName = 'Last Name must be at least 2 characters long';
    }
  
    // Phone Number validation
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
    if (!formData.phoneNumber || formData.phoneNumber.trim() === '') {
      errors.phoneNumber = 'Phone Number is required';
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }
  
    return errors;
  };
  