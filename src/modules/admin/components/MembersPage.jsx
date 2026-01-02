import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Download, User, Mail, Phone, MapPin, Calendar, Filter, CheckCircle, AlertCircle, UserCheck } from 'lucide-react';
import UsherAssignmentModal from './UsherAssignmentModal';
import { saveTemporaryAssignment, getActiveAssignmentForMember, revokeAssignment } from '@/utils/helpers.js';
import { getAll, add, remove } from '../../../utils/database';

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  // Load real member data from database
  useEffect(() => {
    const loadMembers = () => {
      try {
        const churchMembers = getAll('churchMembers');
        const users = getAll('users');
        const attendanceRecords = getAll('attendanceRecords');

        // Transform church members to display format with user data
        const transformedMembers = churchMembers.map(member => {
          const user = users.find(u => u.personalCode === member.personalCode);

          // Calculate attendance streak for this member
          const memberAttendance = attendanceRecords
            .filter(record => {
              const recordUser = users.find(u => u.id === record.userId);
              return recordUser && recordUser.personalCode === member.personalCode;
            })
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

          // Simple streak calculation (consecutive weeks)
          let streak = 0;
          if (memberAttendance.length > 0) {
            const latestDate = new Date(memberAttendance[0].timestamp);
            for (let i = 0; i < memberAttendance.length; i++) {
              const recordDate = new Date(memberAttendance[i].timestamp);
              const weeksDiff = Math.floor((latestDate - recordDate) / (7 * 24 * 60 * 60 * 1000));
              if (weeksDiff === i) {
                streak++;
              } else {
                break;
              }
            }
          }

          return {
            id: member.id,
            fullName: member.name,
            email: user?.email || `${member.name.toLowerCase().replace(' ', '.')}@email.com`,
            phone: user?.profile?.phoneNumber || '(233) 24 123 4567',
            location: member.area,
            dateOfBirth: `${member.birthYear}-01-01`, // Approximate from birth year
            joinDate: user?.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '2024-01-01',
            status: 'Active', // Assume active unless specified
            lastAttendance: memberAttendance.length > 0 ?
              new Date(memberAttendance[0].timestamp).toISOString().split('T')[0] : null,
            attendanceStreak: streak,
            personalCode: member.personalCode,
            parent: member.parent
          };
        });

        setMembers(transformedMembers);
      } catch (error) {
        console.error('Error loading members:', error);
        // Fallback to empty array
        setMembers([]);
      }
    };

    loadMembers();

    // Listen for global search events
    const handleGlobalSearch = (event) => {
      const { searchTerm: globalTerm, page } = event.detail;
      if (page === 'members') {
        setGlobalSearchTerm(globalTerm);
      }
    };

    window.addEventListener('globalSearch', handleGlobalSearch);

    return () => {
      window.removeEventListener('globalSearch', handleGlobalSearch);
    };
  }, []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [assigningMember, setAssigningMember] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    dateOfBirth: '',
    joinDate: '',
    status: 'Active'
  });
  const [message, setMessageType] = useState('');


  const locations = [
    'East Legon',
    'Cantonments',
    'Tema',
    'Accra Central',
    'Takoradi',
    'Kumasi'
  ];

  const filteredMembers = members.filter(member => {
    const matchesSearch = !globalSearchTerm ||
                          member.fullName.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
                          member.email.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
                          member.id.toLowerCase().includes(globalSearchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || member.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  const generateMemberId = () => {
    const existingMembers = getAll('churchMembers');
    const nextId = existingMembers.length + 1;
    return `member_${String(nextId).padStart(3, '0')}`;
  };

  const handleAddMember = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.location) {
      setMessageType('error');
      return;
    }

    // Generate personal code for the member
    const personalCode = Math.floor(10000 + Math.random() * 90000).toString();

    const newMember = {
      id: generateMemberId(),
      name: formData.fullName,
      area: formData.location,
      parent: 'TBD', // To be determined
      birthYear: formData.dateOfBirth ? new Date(formData.dateOfBirth).getFullYear().toString() : '2008',
      personalCode: personalCode
    };

    try {
      // Add to churchMembers collection
      add('churchMembers', newMember);

      // Create corresponding user account if email provided
      if (formData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setMessageType('error');
          return;
        }

        const newUser = {
          id: `user_${Date.now()}`,
          name: formData.fullName,
          email: formData.email,
          password: 'password123', // Default password
          role: 'teen',
          personalCode: personalCode,
          createdAt: new Date().toISOString(),
          profile: {
            fullName: formData.fullName,
            preferredName: formData.fullName.split(' ')[0],
            dateOfBirth: formData.dateOfBirth,
            phoneNumber: formData.phone,
            guardianName: 'TBD',
            ministry: 'TBD',
            membershipStatus: 'Active Member',
            parentalConsent: true,
            attendanceRecords: '0/52 (0%)',
            volunteerRoles: 'None',
            points: '0'
          }
        };

        add('users', newUser);
      }

      // Reload members to show the new addition
      const updatedMembers = getAll('churchMembers');
      const users = getAll('users');
      const attendanceRecords = getAll('attendanceRecords');

      const transformedMembers = updatedMembers.map(member => {
        const user = users.find(u => u.personalCode === member.personalCode);
        const memberAttendance = attendanceRecords
          .filter(record => {
            const recordUser = users.find(u => u.id === record.userId);
            return recordUser && recordUser.personalCode === member.personalCode;
          })
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        let streak = 0;
        if (memberAttendance.length > 0) {
          const latestDate = new Date(memberAttendance[0].timestamp);
          for (let i = 0; i < memberAttendance.length; i++) {
            const recordDate = new Date(memberAttendance[i].timestamp);
            const weeksDiff = Math.floor((latestDate - recordDate) / (7 * 24 * 60 * 60 * 1000));
            if (weeksDiff === i) {
              streak++;
            } else {
              break;
            }
          }
        }

        return {
          id: member.id,
          fullName: member.name,
          email: user?.email || `${member.name.toLowerCase().replace(' ', '.')}@email.com`,
          phone: user?.profile?.phoneNumber || '(233) 24 123 4567',
          location: member.area,
          dateOfBirth: `${member.birthYear}-01-01`,
          joinDate: user?.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '2024-01-01',
          status: 'Active',
          lastAttendance: memberAttendance.length > 0 ?
            new Date(memberAttendance[0].timestamp).toISOString().split('T')[0] : null,
          attendanceStreak: streak,
          personalCode: member.personalCode,
          parent: member.parent
        };
      });

      setMembers(transformedMembers);
      setMessageType('success');
      setShowAddModal(false);

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        dateOfBirth: '',
        joinDate: '',
        status: 'Active'
      });

      setTimeout(() => setMessageType(''), 3000);
    } catch (error) {
      console.error('Error adding member:', error);
      setMessageType('error');
      setTimeout(() => setMessageType(''), 3000);
    }
  };

  const exportMembers = () => {
    const csvContent = [
      ['Member ID', 'Name', 'Contact', 'Location', 'Date of Birth', 'Join Date', 'Status', 'Last Attendance', 'Attendance Streak'],
      ...filteredMembers.map(member => [
        member.id,
        member.fullName,
        `${member.email} | ${member.phone}`,
        member.location,
        member.dateOfBirth,
        member.joinDate,
        member.status,
        member.lastAttendance || '-',
        member.attendanceStreak
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `members-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleEditMember = (memberId) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setEditingMember(member);
      setFormData({
        fullName: member.fullName,
        email: member.email,
        phone: member.phone,
        location: member.location,
        dateOfBirth: member.dateOfBirth,
        joinDate: member.joinDate,
        status: member.status
      });
      setShowEditModal(true);
    }
  };

  const handleUpdateMember = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.location) {
      setMessageType('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessageType('error');
      return;
    }

    // Update member in state
    setMembers(members.map(member =>
      member.id === editingMember.id
        ? { ...member, ...formData }
        : member
    ));

    setMessageType('update');
    setShowEditModal(false);
    setEditingMember(null);

    // Reset form
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      location: '',
      dateOfBirth: '',
      joinDate: '',
      status: 'Active'
    });

    setTimeout(() => setMessageType(''), 3000);
  };

  const handleAssignUsher = (memberId) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setAssigningMember(member);
      setShowAssignmentModal(true);
    }
  };

  const handleConfirmAssignment = (assignment) => {
    // Save assignment to localStorage
    saveTemporaryAssignment(assignment);
    console.log('Assignment saved:', assignment);

    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('assignmentCreated', { detail: assignment }));

    // Close modal and reset state
    setShowAssignmentModal(false);
    setAssigningMember(null);

    // Show success message
    setMessageType('assignment');
    setTimeout(() => setMessageType(''), 3000);
  };

  const handleRevokeUsher = (memberId) => {
    const assignment = getActiveAssignmentForMember(memberId);
    if (assignment) {
      revokeAssignment(assignment.id);
      setMessageType('revoke');
      setTimeout(() => setMessageType(''), 3000);
    }
  };

  const handleDeleteMember = (memberId) => {
    const member = members.find(m => m.id === memberId);
    setConfirmAction('delete');
    setConfirmData({ memberId, member });
    setShowConfirmModal(true);
  };

  const executeConfirmAction = () => {
    if (confirmAction === 'delete') {
      try {
        // Remove from churchMembers collection
        remove('churchMembers', confirmData.memberId);

        // Also remove associated user account if it exists
        const users = getAll('users');
        const member = members.find(m => m.id === confirmData.memberId);
        if (member) {
          const user = users.find(u => u.personalCode === member.personalCode);
          if (user) {
            remove('users', user.id);
          }
        }

        // Reload members
        const updatedMembers = getAll('churchMembers');
        const updatedUsers = getAll('users');
        const attendanceRecords = getAll('attendanceRecords');

        const transformedMembers = updatedMembers.map(member => {
          const user = updatedUsers.find(u => u.personalCode === member.personalCode);
          const memberAttendance = attendanceRecords
            .filter(record => {
              const recordUser = updatedUsers.find(u => u.id === record.userId);
              return recordUser && recordUser.personalCode === member.personalCode;
            })
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

          let streak = 0;
          if (memberAttendance.length > 0) {
            const latestDate = new Date(memberAttendance[0].timestamp);
            for (let i = 0; i < memberAttendance.length; i++) {
              const recordDate = new Date(memberAttendance[i].timestamp);
              const weeksDiff = Math.floor((latestDate - recordDate) / (7 * 24 * 60 * 60 * 1000));
              if (weeksDiff === i) {
                streak++;
              } else {
                break;
              }
            }
          }

          return {
            id: member.id,
            fullName: member.name,
            email: user?.email || `${member.name.toLowerCase().replace(' ', '.')}@email.com`,
            phone: user?.profile?.phoneNumber || '(233) 24 123 4567',
            location: member.area,
            dateOfBirth: `${member.birthYear}-01-01`,
            joinDate: user?.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '2024-01-01',
            status: 'Active',
            lastAttendance: memberAttendance.length > 0 ?
              new Date(memberAttendance[0].timestamp).toISOString().split('T')[0] : null,
            attendanceStreak: streak,
            personalCode: member.personalCode,
            parent: member.parent
          };
        });

        setMembers(transformedMembers);
        setMessageType('delete');
        setTimeout(() => setMessageType(''), 3000);
      } catch (error) {
        console.error('Error deleting member:', error);
        setMessageType('error');
        setTimeout(() => setMessageType(''), 3000);
      }
    }

    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmData(null);
  };

  const getStatusColor = (status) => {
    return status === 'Active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const activeMembers = members.filter(m => m.status === 'Active').length;
  const totalMembers = members.length;

  return (
    <div className="flex-1 flex flex-col space-y-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Members Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage teen members and their information</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Location Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Location:</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20 text-sm"
            >
              <option value="all">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={exportMembers}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-bold transition-all active:scale-95"
            >
              <Download size={20} />
              Export CSV
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white px-4 py-3 rounded-lg font-bold transition-all active:scale-95"
            >
              <Plus size={20} />
              Add Member
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-[hsl(186,70%,34%)]" />
            <h3 className="text-sm font-medium text-gray-700">Total Members</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{totalMembers}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="text-sm font-medium text-gray-700">Active Members</h3>
          </div>
          <p className="text-2xl font-bold mt-2 text-green-600">{activeMembers}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="text-sm font-medium text-gray-700">Inactive Members</h3>
          </div>
          <p className="text-2xl font-bold mt-2 text-red-600">{totalMembers - activeMembers}</p>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`flex items-center gap-2 p-4 rounded-lg ${
            message === 'success'
              ? 'bg-green-50 text-green-700 border border-green-300'
              : 'bg-red-50 text-red-700 border border-red-300'
          }`}
        >
          {message === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <p className="font-medium">
            {message === 'success' ? 'Member added successfully!' :
             message === 'delete' ? 'Member deleted successfully!' :
             message === 'assignment' ? 'Usher duty assigned successfully!' :
             message === 'revoke' ? 'Usher duty revoked successfully!' :
             'Please fill in all required fields with valid information.'}
          </p>
        </div>
      )}


      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Accessibility: Screen reader title */}
            <h1 className="sr-only">Add New Member Modal</h1>
            <h2 className="text-2xl font-bold text-black mb-4">Add New Member</h2>

            <form onSubmit={handleAddMember} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
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
                  placeholder="john@email.com"
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
                  placeholder="(233) 24 123 4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
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

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20"
                />
              </div>

              {/* Join Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                <input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white px-4 py-2 rounded-lg font-bold transition-all active:scale-95"
                >
                  Add Member
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-bold transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && editingMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Accessibility: Screen reader title */}
            <h1 className="sr-only">Edit Member Modal</h1>
            <h2 className="text-2xl font-bold text-black mb-4">Edit Member</h2>

            <form onSubmit={handleUpdateMember} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
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
                  placeholder="john@email.com"
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
                  placeholder="(233) 24 123 4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
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

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20"
                />
              </div>

              {/* Join Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                <input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white px-4 py-2 rounded-lg font-bold transition-all active:scale-95"
                >
                  Update Member
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingMember(null);
                    setFormData({
                      fullName: '',
                      email: '',
                      phone: '',
                      location: '',
                      dateOfBirth: '',
                      joinDate: '',
                      status: 'Active'
                    });
                  }}
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
            {/* Accessibility: Screen reader title */}
            <h1 className="sr-only">Confirm Member Deletion Modal</h1>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-black mb-2">Confirm Action</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete {confirmData.member.fullName}? This action cannot be undone.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={executeConfirmAction}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-all active:scale-95"
                >
                  Delete
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

      {/* Usher Assignment Modal */}
      {showAssignmentModal && assigningMember && (
        <UsherAssignmentModal
          member={assigningMember}
          onConfirm={handleConfirmAssignment}
          onCancel={() => {
            setShowAssignmentModal(false);
            setAssigningMember(null);
          }}
        />
      )}

      {/* Members Table */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[hsl(186,70%,34%)]/5 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Member ID</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Name</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Location</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Usher Status</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Last Attendance</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Streak</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, index) => (
                <tr key={member.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-[hsl(186,70%,34%)]/5 transition-colors`}>
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{member.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{member.fullName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1">
                        <Mail size={12} />
                        {member.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={12} />
                        {member.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 flex items-center gap-1">
                    <MapPin size={14} />
                    {member.location}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {getActiveAssignmentForMember(member.id) ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle size={12} className="mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{member.lastAttendance || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{member.attendanceStreak} weeks</td>
                  <td className="px-4 py-3 text-sm space-x-2">
                     {getActiveAssignmentForMember(member.id) ? (
                       <>
                         <button
                           onClick={() => handleRevokeUsher(member.id)}
                           title="Revoke Usher Duty"
                           className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                         >
                           <UserCheck size={16} />
                         </button>
                         <button
                           onClick={() => handleEditMember(member.id)}
                           title="Edit Member"
                           className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                         >
                           <Edit size={16} />
                         </button>
                       </>
                     ) : (
                       <>
                         <button
                           onClick={() => handleAssignUsher(member.id)}
                           title="Assign Usher Duty"
                           className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                         >
                           <UserCheck size={16} />
                         </button>
                         <button
                           onClick={() => handleEditMember(member.id)}
                           title="Edit Member"
                           className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                         >
                           <Edit size={16} />
                         </button>
                         <button
                           onClick={() => handleDeleteMember(member.id)}
                           title="Delete Member"
                           className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                         >
                           <Trash2 size={16} />
                         </button>
                       </>
                     )}
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No members found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersPage;