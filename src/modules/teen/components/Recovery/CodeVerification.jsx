import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const CodeVerification = ({
  method,
  verificationCode,
  setVerificationCode,
  onVerify,
  onBack,
  message,
  messageType
}) => {
  return (
    <div className="bg-white/50 backdrop-blur-md rounded-lg p-4 shadow-lg border border-gray-300 space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <p className="text-sm text-blue-800 font-medium mb-3">
          Enter the verification code sent to your {method}
        </p>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
          placeholder="Enter 6-digit code"
          maxLength="6"
          className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[hsl(186,70%,34%)]/20 focus:border-[hsl(186,70%,34%)] text-center tracking-widest text-lg font-bold"
        />
      </div>

      {/* Buttons */}
      <div className="space-y-2">
        <button
          onClick={onVerify}
          className="w-full flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-bold"
        >
          <CheckCircle size={16} className="mr-2" />
          Verify Code
        </button>

        <button
          onClick={onBack}
          className="w-full px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors font-bold"
        >
          Back
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`flex items-center space-x-2 text-sm p-3 rounded-md ${
            messageType === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {messageType === 'success' ? (
            <CheckCircle size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default CodeVerification;
