import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Mail, Lock, LogIn } from 'lucide-react';
import mockDatabase from '../../data/mockDatabase.json';

const Login = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation schema with Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .required('Email is required')
      .email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setIsSubmitting(true);

    try {
      // Check against users in mock database
      const users = mockDatabase.users;
      const user = users.find(u => u.email === values.email && u.password === values.password);

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
      setSubmitting(false);
    }
  };

  const initialValues = {
    email: '',
    password: ''
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
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting: formikSubmitting, errors: formikErrors }) => (
                <Form className="space-y-4">
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
                        autoComplete="current-password"
                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-[#d1e5e6] focus:border-[#d1e5e6] border-gray-300"
                        placeholder="Enter your password"
                      />
                    </div>
                    <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
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
                        Signing In...
                      </>
                    ) : (
                      <>
                        <LogIn size={20} className="mr-2" />
                        Sign In
                      </>
                    )}
                  </button>
                </Form>
              )}
            </Formik>

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