import React, { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Phone, Shield } from 'lucide-react';

const RecoveryTab = ({ onRecover }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [recoveryMethod, setRecoveryMethod] = useState('email');
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [showCodeVerification, setShowCodeVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleSendRecovery = async () => {
    if (recoveryMethod === 'email' && !email) {
      setMessage('Please enter your registered email.');
      setMessageType('error');
      return;
    }
    if (recoveryMethod === 'phone' && !phone) {
      setMessage('Please enter your registered phone number.');
      setMessageType('error');
      return;
    }

    setIsSending(true);
    setMessage('');

    // Simulate sending recovery and generating code
    setTimeout(() => {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setRecoveryCode(code);
      setShowCodeVerification(true);
      setMessage(`Recovery code sent to your ${recoveryMethod}. Check for verification code.`);
      setMessageType('success');
      setIsSending(false);
    }, 2000);
  };

  const handleVerifyCode = () => {
    if (!verificationCode) {
      setMessage('Please enter the verification code.');
      setMessageType('error');
      return;
    }

    if (verificationCode === recoveryCode) {
      onRecover();
      setMessage('Verification successful! A new BOL-Key has been generated.');
      setMessageType('success');
      setShowCodeVerification(false);
      setEmail('');
      setPhone('');
      setVerificationCode('');
      setRecoveryCode('');
    } else {
      setMessage('Invalid verification code. Please try again.');
      setMessageType('error');
    }
  };

  const handleReset = () => {
    setEmail('');
    setPhone('');
    setVerificationCode('');
    setRecoveryCode('');
    setShowCodeVerification(false);
    setMessage('');
  };

  return (
    <div className="flex-1 flex flex-col space-y-4">
      <h2 className="text-xl text-center font-bold text-black">ID Recovery</h2>
      <div className="bg-white/50 backdrop-blur-md rounded-lg p-4 shadow-lg border border-gray-300 space-y-4">
        <div className="flex items-center space-x-2">
          <Shield size={20} />
          <p className="font-medium text-black">Recover Lost ID</p>
        </div>
        <p className="text-sm text-gray-600">
          Enter your registered contact information to receive recovery instructions for your lost BOL-ID.
        </p>

        {!showCodeVerification ? (
          <>
            {/* Recovery Method Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Recovery Method</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setRecoveryMethod('email')}
                  className={`flex-1 py-2 px-3 rounded-md transition-colors ${
                    recoveryMethod === 'email'
                      ? 'bg-[hsl(186,70%,34%)]/80 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <Mail size={16} className="inline mr-1" /> Email
                </button>
                <button
                  onClick={() => setRecoveryMethod('phone')}
                  className={`flex-1 py-2 px-3 rounded-md transition-colors ${
                    recoveryMethod === 'phone'
                      ? 'bg-[hsl(186,70%,34%)]/80 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <Phone size={16} className="inline mr-1" /> Phone
                </button>
              </div>
            </div>

            {/* Email Input */}
            {recoveryMethod === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Registered Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#d1e5e6] focus:border-[#d1e5e6]"
                />
              </div>
            )}

            {/* Phone Input */}
            {recoveryMethod === 'phone' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Registered Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#d1e5e6] focus:border-[#d1e5e6]"
                />
              </div>
            )}

            {/* Send Button */}
            <button
              onClick={handleSendRecovery}
              disabled={isSending}
              className="w-full flex items-center justify-center px-4 py-2 bg-[hsl(186,70%,34%)]/80 text-white rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50"
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
          </>
        ) : (
          <>
            {/* Verification Code Input */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800 font-medium mb-3">Enter the verification code sent to your {recoveryMethod}</p>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-digit code"
                maxLength="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#d1e5e6] focus:border-[#d1e5e6] text-center tracking-widest"
              />
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyCode}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle size={16} className="mr-2" />
              Verify Code
            </button>

            {/* Back Button */}
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Back
            </button>
          </>
        )}

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
    </div>
  );
};

export default RecoveryTab;