import React, { useState } from 'react';
import { UserCheck, Clock, Key, AlertCircle, CheckCircle } from 'lucide-react';

const UsherAssignmentModal = ({ member, onConfirm, onCancel }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);

  // Generate unique temporary credentials
  const generateCredentials = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    const username = `usher_${member.id.toLowerCase().replace('-', '_')}_${randomNum}`;
    const password = `USH${timestamp.toString().slice(-6)}`;

    return { username, password };
  };

  // Calculate expiration timestamp (12:00 PM today)
  const getExpirationTimestamp = () => {
    const now = new Date();
    const expiration = new Date(now);
    expiration.setHours(12, 0, 0, 0); // Set to 12:00 PM

    // If it's already past 12:00 PM, set to tomorrow
    if (now >= expiration) {
      expiration.setDate(expiration.getDate() + 1);
    }

    return expiration.getTime();
  };

  const handleGenerateCredentials = () => {
    setIsGenerating(true);

    // Simulate credential generation delay
    setTimeout(() => {
      const newCredentials = generateCredentials();
      const expirationTimestamp = getExpirationTimestamp();

      const newAssignment = {
        id: `assignment_${Date.now()}`,
        memberId: member.id,
        memberEmail: member.email,
        memberName: member.fullName,
        credentials: newCredentials,
        expiration: expirationTimestamp,
        assignedBy: 'admin', // TODO: Get from current user
        assignedAt: Date.now(),
        status: 'active'
      };

      setCredentials(newCredentials);
      setAssignment(newAssignment);
      setIsGenerating(false);
    }, 1000);
  };

  const handleConfirmAssignment = () => {
    if (!assignment) return;

    setIsConfirming(true);

    // Simulate assignment saving delay
    setTimeout(() => {
      onConfirm(assignment);
      setIsConfirming(false);
    }, 1500);
  };

  const formatExpirationTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <UserCheck size={24} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-black">Assign Usher Duty</h2>
            <p className="text-gray-600">Assign temporary usher privileges to a member</p>
          </div>
        </div>

        {/* Member Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Member Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{member.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Member ID:</span>
              <span className="font-mono text-sm">{member.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span>{member.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                member.status === 'Active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {member.status}
              </span>
            </div>
          </div>
        </div>

        {/* Assignment Details */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-blue-600" />
            <h3 className="font-semibold text-gray-900">Assignment Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">Until 12:00 PM today</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Access:</span>
              <span className="font-medium">Usher Terminal Only</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Auto-expiry:</span>
              <span className="font-medium">Yes</span>
            </div>
          </div>
        </div>

        {/* Credentials Generation */}
        {!credentials ? (
          <div className="text-center mb-6">
            <button
              onClick={handleGenerateCredentials}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-bold transition-all active:scale-95 mx-auto"
            >
              <Key size={20} />
              {isGenerating ? 'Generating Credentials...' : 'Generate Temporary Credentials'}
            </button>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={18} className="text-yellow-600" />
              <h3 className="font-semibold text-gray-900">Temporary Credentials Generated</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <div className="bg-white px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm">
                  {credentials.username}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="bg-white px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm">
                  {credentials.password}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expires</label>
                <div className="bg-white px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  {formatExpirationTime(assignment.expiration)}
                </div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-yellow-100 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Please securely communicate these credentials to the member.
                They will be required to access the usher terminal and will expire automatically at 12:00 PM.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-3 rounded-lg font-bold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmAssignment}
            disabled={!credentials || isConfirming}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isConfirming ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Assigning...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Confirm Assignment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsherAssignmentModal;