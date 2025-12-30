import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';

const RecoveryTab = ({ onRecover }) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendRecovery = async () => {
    if (!email) {
      setMessage('Please enter your registered email.');
      return;
    }

    setIsSending(true);
    setMessage('');

    // Simulate sending recovery email and generating new key
    setTimeout(() => {
      onRecover(); // Generate new BOL-Key
      setMessage('Recovery email sent! A new BOL-Key has been generated. Check your inbox for instructions.');
      setIsSending(false);
      setEmail('');
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col space-y-4">
      <h2 className="text-xl font-bold text-black">ID Recovery</h2>
      <div className="bg-white/80 backdrop-blur-md rounded-lg p-4 shadow-lg border border-gray-300 space-y-4">
        <div className="flex items-center space-x-2">
          <Mail size={20} />
          <p className="font-medium text-black">Recover Lost ID</p>
        </div>
        <p className="text-sm text-gray-600">
          Enter your registered email address to receive recovery instructions for your lost BOL-ID.
        </p>
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
        <button
          onClick={handleSendRecovery}
          disabled={isSending}
          className="w-full flex items-center justify-center px-4 py-2 bg-[#d1e5e6] text-black rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50"
        >
          {isSending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              <Send size={16} className="mr-2" />
              Send Recovery Email
            </>
          )}
        </button>
        {message && (
          <p className={`text-sm ${message.includes('sent') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default RecoveryTab;