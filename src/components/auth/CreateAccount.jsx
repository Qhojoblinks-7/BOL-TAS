import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Shield, Users, UserCheck } from 'lucide-react';
import { add, getAll } from '../../utils/database';

const CreateAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateUniquePersonalCode = () => {
    const users = getAll('users');
    const existingCodes = users.map(user => user.personalCode);
    let code;
    do {
      code = Math.floor(10000 + Math.random() * 90000).toString();
    } while (existingCodes.includes(code));
    return code;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate account creation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate unique personal code for all users
      const personalCode = generateUniquePersonalCode();

      // Store user data (in a real app, this would be sent to backend)
      const userData = {
        ...formData,
        role: 'teen', // Default role for new members
        id: `user_${Date.now()}`,
        personalCode,
        createdAt: new Date().toISOString(),
        bolKey: `${new Date().getFullYear() % 100}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
      };

      // Add user to database
      add('users', userData);

      // Store current user session in localStorage
      localStorage.setItem('userAccount', JSON.stringify(userData));

      // Dispatch custom event to notify App component of account creation
      window.dispatchEvent(new CustomEvent('userAccountCreated', { detail: userData }));

      // Redirect to teen portal for new members
      navigate('/');

    } catch {
      setErrors({ submit: 'Account creation failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-[#d1e5e6] flex flex-col w-full relative mobile-only overflow-y-auto">
      {/* Background circle decorations */}
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: 'hsl(140, 24, 85)' }}></div>
      <div className="absolute top-40 right-10 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: 'hsl(248, 22%, 50%)' }}></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: 'hsl(186, 26%, 62%)' }}></div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-300 p-4">
        <h1 className="text-2xl font-bold text-black">Join BOL-TAS</h1>
        <p className="text-gray-600">Create your member account</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg border border-gray-300">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-[#d1e5e6] focus:border-[#d1e5e6] ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-[#d1e5e6] focus:border-[#d1e5e6] ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-[#d1e5e6] focus:border-[#d1e5e6] ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Create a password"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-[#d1e5e6] focus:border-[#d1e5e6] ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>


              {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#d1e5e6] text-black py-3 px-4 rounded-lg hover:bg-opacity-80 active:bg-opacity-90 active:scale-95 transition-all duration-100 touch-manipulation font-bold disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-[#d1e5e6] hover:underline font-medium"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateAccount;