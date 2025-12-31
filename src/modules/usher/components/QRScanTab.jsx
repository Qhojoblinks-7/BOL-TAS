import React from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { CheckCircle, Camera } from 'lucide-react';

const QRScanTab = ({ isScanning, scanResult, scanError, startScanning, stopScanning, onScanSuccess, onScanFailure, onRetry }) => {
  return (
    <>
      {/* Camera Feed Box */}
      {isScanning && (
        <div className="bg-white rounded-xl p-5 md:p-6 shadow-lg border border-gray-200 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <h4 className="text-lg font-bold text-black mb-4 text-center">Live Camera Feed</h4>
            <div id="qr-reader" className="rounded-lg overflow-hidden border-2 border-[hsl(186,70%,34%)]/30 mx-auto"></div>
          </div>
        </div>
      )}

      {/* Control Box */}
      <div className="bg-white rounded-xl p-5 md:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
        <h3 className="text-xl md:text-2xl font-bold text-black mb-4">Scan QR Code</h3>
        <p className="text-sm md:text-base text-gray-600 mb-5">Position the QR code within the frame to check in attendees.</p>
        <div className="space-y-3">
          <button
            onClick={isScanning ? stopScanning : startScanning}
            className="w-full bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white px-4 py-3 md:py-4 rounded-lg active:scale-95 transition-all duration-100 font-bold text-base md:text-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Camera size={20} />
            {isScanning ? 'Stop Scanning' : 'Start Camera Scan'}
          </button>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const html5QrCode = new Html5Qrcode("qr-reader");
                  html5QrCode.scanFile(file, true)
                    .then(onScanSuccess)
                    .catch(onScanFailure);
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg transition-colors font-medium text-base">
              Upload Image
            </button>
          </div>
        </div>
      </div>

      {/* Error Box */}
      {scanError && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-5 md:p-6 shadow-lg border-2 border-red-300">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 text-sm">!</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-red-700 font-semibold">Scan Error</p>
              <p className="text-base text-red-900">{scanError}</p>
            </div>
          </div>
          <button
            onClick={onRetry}
            className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Result Box */}
      {scanResult && !scanError && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 md:p-6 shadow-lg border-2 border-blue-300">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-blue-600 flex-shrink-0" size={28} />
            <div>
              <p className="text-xs md:text-sm text-blue-700 font-semibold">QR Code Detected</p>
              <p className="text-base md:text-lg font-bold text-blue-900">{scanResult}</p>
              <p className="text-sm text-blue-600 mt-1">Please confirm member details to complete check-in.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QRScanTab;