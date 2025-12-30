import React from 'react';
import { Download, CheckCircle, AlertCircle } from 'lucide-react';

const BackupCodes = ({ backupCodes, onGenerate, onDownload, message, messageType }) => {
  return (
    <div className="bg-white/50 backdrop-blur-md rounded-lg p-4 shadow-lg border border-gray-300 space-y-4">
      <div className="flex items-center space-x-2">
        <Download size={20} className="text-[hsl(186,70%,34%)]" />
        <p className="font-medium text-black">Backup Codes</p>
      </div>

      <p className="text-sm text-gray-600">
        Generate and save backup codes for emergency access. Each code can be used once if you can't use your primary recovery method.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <p className="text-sm text-blue-800 font-medium mb-3">Your Backup Codes:</p>
        <div className="grid grid-cols-1 gap-2 mb-3">
          {backupCodes.map((code, index) => (
            <div key={index} className="bg-white p-2 rounded border border-blue-200 font-mono text-sm text-center break-all">
              {code}
            </div>
          ))}
        </div>
        <p className="text-xs text-blue-700">Keep these codes in a safe place. Share them with trusted contacts if needed.</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onGenerate}
          className="flex-1 flex items-center justify-center px-4 py-3 bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white rounded-lg transition-colors font-bold"
        >
          Generate New Codes
        </button>
        <button
          onClick={onDownload}
          className="flex-1 flex items-center justify-center px-4 py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg transition-colors font-bold"
        >
          <Download size={16} className="mr-2" />
          Download
        </button>
      </div>

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

export default BackupCodes;
