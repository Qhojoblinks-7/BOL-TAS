import React, { useState } from 'react';
import { Calendar, Filter, Download, Search, Users, Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

const AttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock attendance data
  const [attendanceRecords] = useState([
    {
      id: 'ATT-001',
      teenName: 'Ama Serwaa',
      teenId: 'T-001',
      location: 'East Legon',
      checkInTime: '09:15 AM',
      status: 'Present',
      usher: 'John Smith',
      date: '2024-12-30',
      notes: ''
    },
    {
      id: 'ATT-002',
      teenName: 'Emmanuel K.',
      teenId: 'T-002',
      location: 'Cantonments',
      checkInTime: '09:22 AM',
      status: 'Present',
      usher: 'Kwame Tetteh',
      date: '2024-12-30',
      notes: ''
    },
    {
      id: 'ATT-003',
      teenName: 'John Quaye',
      teenId: 'T-003',
      location: 'Tema',
      checkInTime: '10:05 AM',
      status: 'Present',
      usher: 'Ameyaw Kofi',
      date: '2024-12-30',
      notes: ''
    },
    {
      id: 'ATT-004',
      teenName: 'Sarah Doe',
      teenId: 'T-004',
      location: 'East Legon',
      checkInTime: null,
      status: 'Absent',
      usher: null,
      date: '2024-12-30',
      notes: 'Called - sick'
    },
    {
      id: 'ATT-005',
      teenName: 'Michael O.',
      teenId: 'T-005',
      location: 'Accra Central',
      checkInTime: '09:30 AM',
      status: 'Present',
      usher: 'John Smith',
      date: '2024-12-30',
      notes: ''
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

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesDate = record.date === selectedDate;
    const matchesLocation = selectedLocation === 'all' || record.location === selectedLocation;
    const matchesSearch = record.teenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.teenId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDate && matchesLocation && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-800';
      case 'Checked In': return 'bg-blue-100 text-blue-800';
      case 'Absent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportAttendance = () => {
    const csvContent = [
      ['Teen ID', 'Name', 'Location', 'Check-in Time', 'Status', 'Usher', 'Notes'],
      ...filteredRecords.map(record => [
        record.teenId,
        record.teenName,
        record.location,
        record.checkInTime || '-',
        record.status,
        record.usher || '-',
        record.notes
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalTeens = attendanceRecords.filter(r => r.date === selectedDate).length;
  const presentCount = attendanceRecords.filter(r => r.date === selectedDate && r.status === 'Present').length;
  const absentCount = attendanceRecords.filter(r => r.date === selectedDate && r.status === 'Absent').length;

  return (
    <div className="flex-1 flex flex-col space-y-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Attendance Records</h1>
          <p className="text-sm text-gray-600 mt-1">Monitor and manage teen attendance across all locations</p>
        </div>
        <button
          onClick={exportAttendance}
          className="flex items-center gap-2 bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white px-4 py-3 rounded-lg font-bold transition-all active:scale-95"
        >
          <Download size={20} />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[hsl(186,70%,34%)]" />
            <h3 className="text-sm font-medium text-gray-700">Total Teens</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{totalTeens}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="text-sm font-medium text-gray-700">Present</h3>
          </div>
          <p className="text-2xl font-bold mt-2 text-green-600">{presentCount}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="text-sm font-medium text-gray-700">Absent</h3>
          </div>
          <p className="text-2xl font-bold mt-2 text-red-600">{absentCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20"
            />
          </div>
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
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[hsl(186,70%,34%)]/5 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Teen ID</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Name</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Location</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Check-in</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Usher</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, index) => (
                <tr key={record.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-[hsl(186,70%,34%)]/5 transition-colors`}>
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{record.teenId}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{record.teenName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 flex items-center gap-1">
                    <MapPin size={14} />
                    {record.location}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{record.checkInTime || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{record.usher || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No attendance records found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;