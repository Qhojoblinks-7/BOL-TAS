import React from 'react';
import { Mail, Phone, Send, AlertCircle, CheckCircle } from 'lucide-react';

const RecoveryMethod = ({
  method,
  setMethod,
  email,
  setEmail,
  phone,
  setPhone,
  onSend,
  isSending,
  message,
  messageType
}) => {
  return (
    <div className="bg-white/50 backdrop-blur-md rounded-lg p-4 shadow-lg border border-gray-300 space-y-4">
      <div className="flex items-center space-x-2">
        <Mail size={20} className="text-[hsl(186,70%,34%)]" />
        <p className="font-medium text-black">Recover Lost ID</p>
      </div>

      <p className="text-sm text-gray-600">
        Enter your registered contact information to receive recovery instructions for your lost BOL-ID.
      </p>

      {/* Recovery Method Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Recovery Method</label>
        <div className="flex gap-3">
          <button
            onClick={() => setMethod('email')}
            className={`flex-1 py-2 px-3 rounded-md transition-colors font-medium ${
              method === 'email'
                ? 'bg-[hsl(186,70%,34%)]/80 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Mail size={16} className="inline mr-1" /> Email
          </button>
          <button
            onClick={() => setMethod('phone')}
            className={`flex-1 py-2 px-3 rounded-md transition-colors font-medium ${
              method === 'phone'
                ? 'bg-[hsl(186,70%,34%)]/80 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Phone size={16} className="inline mr-1" /> Phone
          </button>
        </div>
      </div>

      {/* Email Input */}
      {method === 'email' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Registered Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[hsl(186,70%,34%)]/20 focus:border-[hsl(186,70%,34%)]"
          />
        </div>
      )}

      {/* Phone Input */}
      {method === 'phone' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Registered Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[hsl(186,70%,34%)]/20 focus:border-[hsl(186,70%,34%)]"
          />
        </div>
      )}

      {/* Send Button */}
      <button
        onClick={onSend}
        disabled={isSending || (!email && !phone)}
        className="w-full flex items-center justify-center px-4 py-3 bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
      >
        {isSending ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Sending...
          </>
        ) : (
          <>
            <Send size={16} className="mr-2" />
            Send Recovery Code
          </>
        )}
      </button>

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

export default RecoveryMethod;
