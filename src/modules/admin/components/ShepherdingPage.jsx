import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Calendar, CheckCircle, AlertCircle, Plus, Search, Filter, MessageSquare, Heart, X } from 'lucide-react';

const ShepherdingPage = () => {
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignFormData, setAssignFormData] = useState({
    teenId: '',
    shepherdName: '',
    contactFrequency: 'weekly'
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Mock shepherding data
  const [shepherdingAssignments] = useState([
    {
      id: 'S-001',
      teenName: 'Ama Serwaa',
      teenId: 'M-001',
      shepherdName: 'Pastor Johnson',
      shepherdEmail: 'pastor.johnson@church.com',
      shepherdPhone: '(233) 24 111 2222',
      location: 'East Legon',
      assignmentDate: '2023-01-15',
      lastContact: '2024-12-28',
      contactFrequency: 'Weekly',
      status: 'Active',
      notes: 'Regular Bible study sessions. Good progress in spiritual growth.',
      nextFollowUp: '2025-01-04',
      attendanceStreak: 12,
      concerns: []
    },
    {
      id: 'S-002',
      teenName: 'Emmanuel Kofi',
      teenId: 'M-002',
      shepherdName: 'Sister Mary',
      shepherdEmail: 'sister.mary@church.com',
      shepherdPhone: '(233) 20 333 4444',
      location: 'Cantonments',
      assignmentDate: '2022-09-10',
      lastContact: '2024-12-20',
      contactFrequency: 'Bi-weekly',
      status: 'Active',
      notes: 'Struggling with consistency. Needs encouragement.',
      nextFollowUp: '2025-01-03',
      attendanceStreak: 8,
      concerns: ['Irregular attendance', 'Peer pressure']
    },
    {
      id: 'S-003',
      teenName: 'John Quaye',
      teenId: 'M-003',
      shepherdName: 'Brother David',
      shepherdEmail: 'brother.david@church.com',
      shepherdPhone: '(233) 27 555 6666',
      location: 'Tema',
      assignmentDate: '2024-02-20',
      lastContact: '2024-12-15',
      contactFrequency: 'Weekly',
      status: 'Needs Attention',
      notes: 'New member, adjusting well but needs more guidance.',
      nextFollowUp: '2024-12-31',
      attendanceStreak: 3,
      concerns: ['New member orientation']
    },
    {
      id: 'S-004',
      teenName: 'Sarah Doe',
      teenId: 'M-004',
      shepherdName: 'Pastor Johnson',
      shepherdEmail: 'pastor.johnson@church.com',
      shepherdPhone: '(233) 24 111 2222',
      location: 'East Legon',
      assignmentDate: '2023-06-12',
      lastContact: '2024-11-15',
      contactFrequency: 'Monthly',
      status: 'Inactive',
      notes: 'Member became inactive. Attempting to re-engage.',
      nextFollowUp: '2025-01-15',
      attendanceStreak: 0,
      concerns: ['Extended absence', 'Lost contact']
    },
    {
      id: 'S-005',
      teenName: 'Michael Owusu',
      teenId: 'M-005',
      shepherdName: 'Sister Mary',
      shepherdEmail: 'sister.mary@church.com',
      shepherdPhone: '(233) 20 333 4444',
      location: 'Accra Central',
      assignmentDate: '2022-11-08',
      lastContact: '2024-12-30',
      contactFrequency: 'Weekly',
      status: 'Active',
      notes: 'Excellent progress. Leading prayer meetings.',
      nextFollowUp: '2025-01-06',
      attendanceStreak: 15,
      concerns: []
    }
  ]);

  const locations = [
    'East Legon',
    'Cantonments',
    'Tema',
    'Accra Central',
    'Takoradi',
    'Kumasi'
  ];

  const shepherds = [
    { name: 'Pastor Johnson', email: 'pastor.johnson@church.com', phone: '(233) 24 111 2222' },
    { name: 'Sister Mary', email: 'sister.mary@church.com', phone: '(233) 20 333 4444' },
    { name: 'Brother David', email: 'brother.david@church.com', phone: '(233) 27 555 6666' },
    { name: 'Pastor Sarah', email: 'pastor.sarah@church.com', phone: '(233) 50 777 8888' }
  ];

  const filteredAssignments = shepherdingAssignments.filter(assignment => {
    const matchesSearch = assignment.teenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.shepherdName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.teenId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || assignment.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Needs Attention': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAssignShepherd = (e) => {
    e.preventDefault();

    if (!assignFormData.teenId || !assignFormData.shepherdName) {
      setMessage('Please select both a teen and a shepherd.');
      setMessageType('error');
      return;
    }

    // In a real app, this would create a new shepherding assignment
    const teen = shepherdingAssignments.find(s => s.teenId === assignFormData.teenId);
    if (teen) {
      setMessage(`Shepherding assignment created for ${teen.teenName} with ${assignFormData.shepherdName}.`);
      setMessageType('success');
    }

    setShowAssignModal(false);
    setAssignFormData({
      teenId: '',
      shepherdName: '',
      contactFrequency: 'weekly'
    });

    setTimeout(() => setMessage(''), 5000);
  };

  const handleCall = (person) => {
    setSelectedPerson(person);
    setShowCallModal(true);
  };
  
  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDetailsModal(true);
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <CheckCircle size={14} />;
      case 'Needs Attention': return <AlertCircle size={14} />;
      case 'Inactive': return <AlertCircle size={14} />;
      default: return null;
    }
  };

  const activeAssignments = shepherdingAssignments.filter(a => a.status === 'Active').length;
  const needsAttention = shepherdingAssignments.filter(a => a.status === 'Needs Attention').length;
  const inactiveAssignments = shepherdingAssignments.filter(a => a.status === 'Inactive').length;

  return (
    <div className="flex-1 flex flex-col space-y-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Shepherding Management</h1>
          <p className="text-sm text-gray-600 mt-1">Monitor shepherding relationships and follow-ups</p>
        </div>
        <button
          onClick={() => setShowAssignModal(true)}
          className="flex items-center gap-2 bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white px-4 py-3 rounded-lg font-bold transition-all active:scale-95"
        >
          <Plus size={20} />
          Assign Shepherd
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-[hsl(186,70%,34%)]" />
            <h3 className="text-sm font-medium text-gray-700">Total Assignments</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{shepherdingAssignments.length}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="text-sm font-medium text-gray-700">Active</h3>
          </div>
          <p className="text-2xl font-bold mt-2 text-green-600">{activeAssignments}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <h3 className="text-sm font-medium text-gray-700">Needs Attention</h3>
          </div>
          <p className="text-2xl font-bold mt-2 text-yellow-600">{needsAttention}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="text-sm font-medium text-gray-700">Inactive</h3>
          </div>
          <p className="text-2xl font-bold mt-2 text-red-600">{inactiveAssignments}</p>
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

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20"
            >
              <option value="all">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by teen or shepherd name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Shepherding Assignments Table */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[hsl(186,70%,34%)]/5 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Teen</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Shepherd</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Location</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Last Contact</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Next Follow-up</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Attendance Streak</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map((assignment, index) => (
                <tr key={assignment.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-[hsl(186,70%,34%)]/5 transition-colors`}>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{assignment.teenName}</p>
                      <p className="text-xs text-gray-600">{assignment.teenId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{assignment.shepherdName}</p>
                      <p className="text-xs text-gray-600">{assignment.shepherdPhone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 flex items-center gap-1">
                    <MapPin size={14} />
                    {assignment.location}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                      {getStatusIcon(assignment.status)}
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{assignment.lastContact}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{assignment.nextFollowUp}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{assignment.attendanceStreak} weeks</td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    <button
                      onClick={() => handleCall({ name: assignment.shepherdName, phone: assignment.shepherdPhone })}
                      title="Call Shepherd"
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                    >
                      <Phone size={16} />
                    </button>
                    <button
                      onClick={() => handleViewDetails(assignment)}
                      title="View Details"
                      className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                    >
                      <User size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No shepherding assignments found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Assign Shepherd Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-black mb-4">Assign Shepherd</h2>

            <form onSubmit={handleAssignShepherd} className="space-y-4">
              {/* Select Teen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Teen</label>
                <select
                  value={assignFormData.teenId}
                  onChange={(e) => setAssignFormData({ ...assignFormData, teenId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20"
                >
                  <option value="">Choose a teen...</option>
                  {/* Would populate with teens not assigned to shepherds */}
                </select>
              </div>

              {/* Select Shepherd */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Shepherd</label>
                <select
                  value={assignFormData.shepherdName}
                  onChange={(e) => setAssignFormData({ ...assignFormData, shepherdName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20"
                >
                  <option value="">Choose a shepherd...</option>
                  {shepherds.map(shepherd => (
                    <option key={shepherd.email} value={shepherd.name}>{shepherd.name}</option>
                  ))}
                </select>
              </div>

              {/* Contact Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Frequency</label>
                <select
                  value={assignFormData.contactFrequency}
                  onChange={(e) => setAssignFormData({ ...assignFormData, contactFrequency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20"
                >
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white px-4 py-2 rounded-lg font-bold transition-all active:scale-95"
                >
                  Assign Shepherd
                </button>
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-bold transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Call Modal */}
      {showCallModal && selectedPerson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl relative">
            <button
              onClick={() => setShowCallModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-black mb-4">Call Contact</h2>

            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone size={32} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedPerson.name}</h3>
                <p className="text-gray-600">{selectedPerson.phone}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Assignment Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Teen Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User size={20} />
                  Teen Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedAssignment.teenName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ID</p>
                    <p className="font-medium">{selectedAssignment.teenId}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin size={16} />
                      {selectedAssignment.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shepherd Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User size={20} />
                  Shepherd Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedAssignment.shepherdName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium flex items-center gap-1">
                      <Phone size={16} />
                      {selectedAssignment.shepherdPhone}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium flex items-center gap-1">
                      <Mail size={16} />
                      {selectedAssignment.shepherdEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Assignment Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar size={20} />
                  Assignment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Assignment Date</p>
                    <p className="font-medium">{selectedAssignment.assignmentDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact Frequency</p>
                    <p className="font-medium">{selectedAssignment.contactFrequency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAssignment.status)}`}>
                      {getStatusIcon(selectedAssignment.status)}
                      {selectedAssignment.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Contact</p>
                    <p className="font-medium">{selectedAssignment.lastContact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Next Follow-up</p>
                    <p className="font-medium">{selectedAssignment.nextFollowUp}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Attendance Streak</p>
                    <p className="font-medium">{selectedAssignment.attendanceStreak} weeks</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare size={20} />
                  Notes
                </h3>
                <p className="text-gray-700">{selectedAssignment.notes}</p>
              </div>

              {/* Concerns */}
              {selectedAssignment.concerns && selectedAssignment.concerns.length > 0 && (
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
                    <AlertCircle size={20} />
                    Concerns
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedAssignment.concerns.map((concern, index) => (
                      <li key={index} className="text-red-800">{concern}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShepherdingPage;