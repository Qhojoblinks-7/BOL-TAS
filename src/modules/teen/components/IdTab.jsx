import React from 'react';

const IdTab = ({ bolKey, qrCode }) => {
  return (
    <>
      {/* Hero ID Card */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className="w-full max-w-sm bg-white/80 backdrop-blur-md border border-gray-300 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] rounded-3xl p-6 relative overflow-hidden animate-float"
        >
          {/* QR Code Container */}
          <div className="flex justify-center mb-6">
            <div
              className="bg-gray-100 p-4 rounded-lg shadow-lg animate-pulse"
              dangerouslySetInnerHTML={{ __html: qrCode }}
            />
          </div>

          {/* BOL-Key */}
          <div className="text-center">
            <p className="text-xs text-gray-600 tracking-widest uppercase mb-2">BOL-Key</p>
            <p className="font-mono text-xl font-bold text-black tracking-wider">{bolKey}</p>
          </div>
        </div>
      </div>

      {/* Action/Info Area */}
      <div className="bg-white/80 backdrop-blur-md rounded-lg p-4 shadow-lg border border-gray-300">
        <p className="text-center text-gray-700 text-sm">
          Your BOL-Key is unique to your account. Use the Recovery tab if you need to generate a new one.
        </p>
      </div>
    </>
  );
};

export default IdTab;