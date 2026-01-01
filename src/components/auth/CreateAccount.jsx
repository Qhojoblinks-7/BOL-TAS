import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { User, Mail, Lock } from 'lucide-react';
import { add, getAll } from '../../utils/database';

const CreateAccount = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation schema with Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
      .trim()
      .required('Email is required')
      .email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password')], 'Passwords do not match')
  });

  const generateUniquePersonalCode = () => {
    const users = getAll('users');
    const existingCodes = users.map(user => user.personalCode);
    let code;
    do {
      code = Math.floor(10000 + Math.random() * 90000).toString();
    } while (existingCodes.includes(code));
    return code;
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setIsSubmitting(true);

    try {
      // Simulate account creation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate unique personal code for all users
      const personalCode = generateUniquePersonalCode();

      // Store user data (in a real app, this would be sent to backend)
      const userData = {
        ...values,
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
      setSubmitting(false);
    }
  };

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting: formikSubmitting, errors: formikErrors }) => (
                <Form className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Field
                        type="text"
                        name="name"
                        autoComplete="name"
                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-[#d1e5e6] focus:border-[#d1e5e6] border-gray-300"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <ErrorMessage name="name" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Field
                        type="email"
                        name="email"
                        autoComplete="email"
                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-[#d1e5e6] focus:border-[#d1e5e6] border-gray-300"
                        placeholder="Enter your email"
                      />
                    </div>
                    <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Field
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-[#d1e5e6] focus:border-[#d1e5e6] border-gray-300"
                        placeholder="Create a password"
                      />
                    </div>
                    <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Field
                        type="password"
                        name="confirmPassword"
                        autoComplete="new-password"
                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-[#d1e5e6] focus:border-[#d1e5e6] border-gray-300"
                        placeholder="Confirm your password"
                      />
                    </div>
                    <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  {formikErrors.submit && <p className="text-red-500 text-sm">{formikErrors.submit}</p>}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || formikSubmitting}
                    className="w-full bg-[#d1e5e6] text-black py-3 px-4 rounded-lg hover:bg-opacity-80 active:bg-opacity-90 active:scale-95 transition-all duration-100 touch-manipulation font-bold disabled:opacity-50 flex items-center justify-center"
                  >
                    {isSubmitting || formikSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </Form>
              )}
            </Formik>

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