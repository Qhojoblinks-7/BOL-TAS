import React from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessOverlay = ({ showSuccessOverlay }) => {
  return (
    <>
      {showSuccessOverlay && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-2xl p-8 md:p-12 shadow-2xl animate-bounce-in max-w-sm mx-4 text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircle size={64} className="text-green-500 animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-2">Scan Successful!</h2>
            <p className="text-xl md:text-2xl font-semibold text-gray-800">Marked Present</p>
          </div>
        </div>
      )}
    </>
  );
};

export default SuccessOverlay;