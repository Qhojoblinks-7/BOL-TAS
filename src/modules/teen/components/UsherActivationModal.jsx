import React, { useState } from 'react';
import { UserCheck, Key, AlertCircle, CheckCircle, X } from 'lucide-react';
import { validateTempCredentials } from '../../../utils/helpers';

const UsherActivationModal = ({ email, onSuccess, onCancel }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      return;
    }

    setIsValidating(true);
    setError('');

    // Simulate validation delay
    setTimeout(() => {
      const result = validateTempCredentials(email, credentials.username, credentials.password);

      if (result.valid) {
        // Update user role to tempUsher
        const userAccount = JSON.parse(localStorage.getItem('userAccount'));
        userAccount.role = 'tempUsher';
        userAccount.expirationTimestamp = result.assignment.expiration;
        localStorage.setItem('userAccount', JSON.stringify(userAccount));

        // Dispatch event to update app state
        window.dispatchEvent(new CustomEvent('tempUsherActivated'));

        onSuccess();
      } else {
        setError(result.error || 'Invalid credentials');
      }

      setIsValidating(false);
    }, 1000);
  };

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <UserCheck size={20} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">Activate Usher Duty</h2>
              <p className="text-gray-600 text-sm">Enter your temporary credentials</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Enter username"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                disabled={isValidating}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                disabled={isValidating}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Important:</p>
                <p>These credentials are temporary and will expire at 12:00 PM today. Make sure to complete your usher duties before then.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-3 rounded-lg font-bold transition-all"
              disabled={isValidating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isValidating || !credentials.username || !credentials.password}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isValidating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Activating...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Activate
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsherActivationModal;