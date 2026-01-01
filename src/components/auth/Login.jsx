import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { getAll } from '../../utils/database';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      // Check against users in database
      const users = getAll('users');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);

      if (!user) {
        setErrors({ submit: 'Invalid email or password.' });
        return;
      }

      // Store current user session
      localStorage.setItem('userAccount', JSON.stringify(user));

      // Successful login - dispatch event to update app state
      window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));

      // Role-based redirection
      switch (user.role) {
        case 'admin':
          navigate('/');
          break;
        case 'temp_usher':
          navigate('/');
          break;
        case 'teen':
        default:
          navigate('/');
          break;
      }

    } catch {
      setErrors({ submit: 'Login failed. Please try again.' });
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
        <h1 className="text-2xl font-bold text-black">Sign In</h1>
        <p className="text-gray-600">Welcome back to BOL-TAS</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg border border-gray-300">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
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
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn size={20} className="mr-2" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Create Account Link */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/create-account')}
                  className="text-[#d1e5e6] hover:underline font-medium"
                >
                  Create one here
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;