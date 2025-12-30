import React from 'react';

const SecurityTab = () => {
  return (
    <div className="flex-1 flex flex-col space-y-4">
      <div className="bg-white/80 backdrop-blur-md rounded-lg p-4 shadow-lg border border-gray-300 space-y-4">
        <h3 className="text-lg font-bold text-black">Security Settings</h3>
        <div>
          <p className="font-medium text-black">BOL-Key Security</p>
          <p className="text-sm text-gray-600">Your BOL-Key is securely tied to your account and remains static until recovered.</p>
        </div>
        <div>
          <p className="font-medium text-black">Account Protection</p>
          <p className="text-sm text-gray-600">Use the Recovery tab to generate a new BOL-Key if your current one is compromised.</p>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;