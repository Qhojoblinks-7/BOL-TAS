import React from 'react';
import { Key } from 'lucide-react';

const AdminBOLKeyTab = ({ bolKeyInput, setBolKeyInput, handleBOLKeySubmit }) => {
  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 5) {
      setBolKeyInput(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bolKeyInput.length === 5) {
      handleBOLKeySubmit();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-[hsl(186,70%,34%)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Key size={32} className="text-[hsl(186,70%,34%)]" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">BOL-Key Entry</h3>
        <p className="text-gray-600">Enter the 5-digit personal code for attendance check-in</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personal Code
          </label>
          <input
            type="text"
            value={bolKeyInput}
            onChange={handleInputChange}
            placeholder="Enter 5-digit code"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20 text-center text-2xl font-mono tracking-widest"
            maxLength={5}
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-1 text-center">
            {bolKeyInput.length}/5 digits
          </p>
        </div>

        <button
          type="submit"
          disabled={bolKeyInput.length !== 5}
          className="w-full bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-bold transition-all active:scale-95 disabled:active:scale-100"
        >
          Check In Member
        </button>
      </form>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">How it works:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Enter the 5-digit personal code from the member's BOL-Key</li>
          <li>• The system will automatically record their attendance</li>
          <li>• Use this method when QR scanning is not available</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminBOLKeyTab;