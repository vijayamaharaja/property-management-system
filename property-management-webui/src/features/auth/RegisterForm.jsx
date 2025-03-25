import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, reset } from './authSlice';
import { validateRegistrationForm } from '../../utils/validation';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '' // Added phone number field
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  
  useEffect(() => {
    // Reset form and state if registration is successful
    if (isSuccess) {
      // You might want to redirect to login or show a success message
      dispatch(reset());
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '' // Reset phone number field
      });
    }
  }, [isSuccess, dispatch]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateRegistrationForm(formData);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Dispatch registration action
    dispatch(registerUser(formData));
  };
  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
      
      {isError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {message}
        </div>
      )}
      
      {isSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Registration successful! You can now log in.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Existing input fields */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="username">
            Username *
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${formErrors.username ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your username"
          />
          {formErrors.username && (
            <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your email"
          />
          {formErrors.email && (
            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
            Password *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${formErrors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your password"
          />
          {formErrors.password && (
            <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="firstName">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your first name"
          />
          {formErrors.firstName && (
            <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="lastName">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your last name"
          />
          {formErrors.lastName && (
            <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
          )}
        </div>

        {/* New Phone Number Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="phoneNumber">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your phone number"
          />
          {formErrors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{formErrors.phoneNumber}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:bg-blue-300"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;