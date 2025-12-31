import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, RotateCcw, Eye, EyeOff, Mail, Phone, MapPin, Shield, CheckCircle, AlertCircle, Clock, UserCheck, QrCode } from 'lucide-react';
import { getAllActiveAssignments, revokeAssignment } from '../../../utils/helpers';

const AdminUsherManagement = () => {
  const navigate = useNavigate();
  const [ushers, setUshers] = useState([
    {
      id: 'USH-001',
      fullName: 'John Smith',
      email: 'john.smith@church.com',
      phone: '(555) 123-4567',
      location: 'Main Campus',
      permissionLevel: 'Standard',
      status: 'Active',
      createdDate: '2024-01-15',
      createdBy: 'Admin User',
      lastLogin: '2024-12-30',
      tempPassword: null,
      showPassword: false
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    permissionLevel: 'Standard'
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [tempAssignments, setTempAssignments] = useState([]);

  const locations = [
    'Main Campus',
    'Downtown Branch',
    'Riverside Campus',
    'Hillcrest Center'
  ];

  const permissionLevels = [
    { value: 'Standard', label: 'Standard - Can scan QR codes and process check-ins' },
    { value: 'Lead', label: 'Lead - Can manage check-ins and view reports' },
    { value: 'Senior', label: 'Senior - Full access including usher management' }
  ];

  const generateTemporaryPassword = useCallback(() => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }, []);

  const generateUsherId = () => {
    return `USH-${String(ushers.length + 1).padStart(3, '0')}`;
  };

  const handleCreateUsher = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.location) {
      setMessage('Please fill in all required fields.');
      setMessageType('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      return;
    }

    const tempPassword = generateTemporaryPassword();
    const newUsher = {
      id: generateUsherId(),
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      permissionLevel: formData.permissionLevel,
      status: 'Pending Activation',
      createdDate: new Date().toLocaleDateString(),
      createdBy: 'Current Admin',
      lastLogin: '-',
      tempPassword: tempPassword,
      showPassword: true
    };

    setUshers([...ushers, newUsher]);
    setMessage(`Usher account created! Temporary password: ${tempPassword}. Email sent to ${formData.email}`);
    setMessageType('success');

    // Reset form
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      location: '',
      permissionLevel: 'Standard'
    });
    setShowCreateModal(false);

    // Clear message after 5 seconds
    setTimeout(() => setMessage(''), 5000);
  };

  const handleResetPassword = (usherId) => {
    const tempPassword = generateTemporaryPassword();
    setUshers(ushers.map(usher =>
      usher.id === usherId
        ? { ...usher, tempPassword: tempPassword, showPassword: true }
        : usher
    ));
    const usher = ushers.find(u => u.id === usherId);
    setMessage(`Password reset for ${usher?.fullName}. New password: ${tempPassword}`);
    setMessageType('success');
    setTimeout(() => setMessage(''), 5000);
  };

  const handleDeactivateUsher = (usherId) => {
    const usher = ushers.find(u => u.id === usherId);
    setConfirmAction('deactivate');
    setConfirmData({ usherId, usher });
    setShowConfirmModal(true);
  };

  const handleReactivateUsher = (usherId) => {
    const usher = ushers.find(u => u.id === usherId);
    setUshers(ushers.map(u =>
      u.id === usherId ? { ...u, status: 'Active' } : u
    ));
    setMessage(`${usher.fullName} has been reactivated.`);
    setMessageType('success');
    setTimeout(() => setMessage(''), 5000);
  };

  const handleDeleteUsher = (usherId) => {
    const usher = ushers.find(u => u.id === usherId);
    setConfirmAction('delete');
    setConfirmData({ usherId, usher });
    setShowConfirmModal(true);
  };

  const executeConfirmAction = () => {
    if (confirmAction === 'deactivate') {
      setUshers(ushers.map(u =>
        u.id === confirmData.usherId ? { ...u, status: 'Inactive' } : u
      ));
      setMessage(`${confirmData.usher.fullName} has been deactivated.`);
    } else if (confirmAction === 'delete') {
      setUshers(ushers.filter(u => u.id !== confirmData.usherId));
      setMessage(`${confirmData.usher.fullName} has been deleted.`);
    }

    setMessageType('success');
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmData(null);
    setTimeout(() => setMessage(''), 5000);
  };

  const togglePasswordVisibility = (usherId) => {
    setUshers(ushers.map(usher =>
      usher.id === usherId
        ? { ...usher, showPassword: !usher.showPassword }
        : usher
    ));
  };

  // Load temporary assignments
  useEffect(() => {
    const loadTempAssignments = () => {
      const assignments = getAllActiveAssignments();
      setTempAssignments(assignments);
    };

    loadTempAssignments();

    // Listen for assignment changes
    const handleAssignmentChange = () => {
      loadTempAssignments();
    };

    window.addEventListener('tempUsherActivated', handleAssignmentChange);
    window.addEventListener('tempUsherExpired', handleAssignmentChange);
    window.addEventListener('assignmentCreated', handleAssignmentChange);

    return () => {
      window.removeEventListener('tempUsherActivated', handleAssignmentChange);
      window.removeEventListener('tempUsherExpired', handleAssignmentChange);
      window.removeEventListener('assignmentCreated', handleAssignmentChange);
    };
  }, []);

  const handleRevokeTempAssignment = (assignmentId) => {
    if (revokeAssignment(assignmentId)) {
      setTempAssignments(tempAssignments.filter(a => a.id !== assignmentId));
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('assignmentRevoked', { detail: { assignmentId } }));
      setMessage('Temporary usher assignment has been revoked.');
      setMessageType('success');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const formatExpirationTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 flex flex-col space-y-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Manage Ushers</h1>
          <p className="text-sm text-gray-600 mt-1">Create and manage usher accounts and permissions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/usher')}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-bold transition-all active:scale-95"
          >
            <QrCode size={20} />
            Access Usher Terminal
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white px-4 py-3 rounded-lg font-bold transition-all active:scale-95"
          >
            <Plus size={20} />
            Create Usher Account
          </button>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`flex items-center gap-2 p-4 rounded-lg ${
            messageType === 'success'
              ? 'bg-green-50 text-green-700 border border-green-300'
              : 'bg-red-50 text-red-700 border border-red-300'
          }`}
        >
          {messageType === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <p className="font-medium">{message}</p>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-black mb-4">Create New Usher Account</h2>

            <form onSubmit={handleCreateUsher} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Smith"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@church.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Location *</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20"
                >
                  <option value="">Select a location</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Permission Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permission Level *</label>
                <div className="space-y-2">
                  {permissionLevels.map(level => (
                    <label key={level.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="permission"
                        value={level.value}
                        checked={formData.permissionLevel === level.value}
                        onChange={(e) => setFormData({ ...formData, permissionLevel: e.target.value })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white px-4 py-2 rounded-lg font-bold transition-all active:scale-95"
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-bold transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && confirmData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-black mb-2">Confirm Action</h2>
              <p className="text-gray-600 mb-6">
                {confirmAction === 'deactivate'
                  ? `Are you sure you want to deactivate ${confirmData.usher.fullName}? They will lose access to the terminal.`
                  : `Are you sure you want to delete ${confirmData.usher.fullName}? This action cannot be undone.`
                }
              </p>

              <div className="flex gap-2">
                <button
                  onClick={executeConfirmAction}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-all active:scale-95"
                >
                  {confirmAction === 'deactivate' ? 'Deactivate' : 'Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setConfirmAction(null);
                    setConfirmData(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-bold transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ushers Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[hsl(186,70%,34%)]/5 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Usher ID</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Full Name</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Email</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Location</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Permission</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Last Login</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ushers.map((usher, index) => (
                <tr key={usher.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-[hsl(186,70%,34%)]/5 transition-colors`}>
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{usher.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{usher.fullName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{usher.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{usher.location}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[hsl(186,70%,34%)]/10 text-[hsl(186,70%,34%)] text-xs font-medium">
                      <Shield size={14} />
                      {usher.permissionLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      usher.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {usher.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{usher.lastLogin}</td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    <button
                      onClick={() => handleResetPassword(usher.id)}
                      title="Reset Password"
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button
                      onClick={() => usher.status === 'Active' ? handleDeactivateUsher(usher.id) : handleReactivateUsher(usher.id)}
                      title={usher.status === 'Active' ? 'Deactivate' : 'Reactivate'}
                      className={`p-1.5 rounded transition-colors ${
                        usher.status === 'Active'
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {usher.status === 'Active' ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => handleDeleteUsher(usher.id)}
                      title="Delete Usher"
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {ushers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No ushers created yet. Click the button above to create one.</p>
          </div>
        )}
      </div>

      {/* Temporary Assignments Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <UserCheck size={24} className="text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Active Temporary Assignments</h2>
              <p className="text-sm text-gray-600">Members currently assigned usher duties</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-green-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Member Name</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Member ID</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Assigned By</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Expires At</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tempAssignments.map((assignment, index) => (
                <tr key={assignment.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50/50 transition-colors`}>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{assignment.memberName}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{assignment.memberId}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{assignment.assignedBy}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 flex items-center gap-2">
                    <Clock size={14} className="text-orange-500" />
                    {formatExpirationTime(assignment.expiration)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleRevokeTempAssignment(assignment.id)}
                      title="Revoke Assignment"
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tempAssignments.length === 0 && (
          <div className="text-center py-8">
            <UserCheck size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No active temporary assignments.</p>
            <p className="text-sm text-gray-400 mt-1">Assign members from the Members page to see them here.</p>
          </div>
        )}
      </div>

      {/* Temp Password Display (when showing) */}
      {ushers.some(u => u.tempPassword && u.showPassword) && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
          <h3 className="font-bold text-yellow-900 mb-3">⚠️ Temporary Passwords Generated</h3>
          <div className="space-y-2">
            {ushers.filter(u => u.tempPassword && u.showPassword).map(usher => (
              <div key={usher.id} className="bg-white p-3 rounded-lg border border-yellow-200 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{usher.fullName}</p>
                  <p className="text-xs text-gray-600">Email: {usher.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-3 py-1 rounded font-mono text-sm font-bold text-gray-900">{usher.tempPassword}</code>
                  <button
                    onClick={() => togglePasswordVisibility(usher.id)}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    <EyeOff size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsherManagement;
