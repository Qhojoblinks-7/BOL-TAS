import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Download, Search, Users, Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { getAll } from '../../../utils/database';

const AttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  // Load real attendance data
  useEffect(() => {
    const loadAttendanceData = () => {
      const records = getAll('attendanceRecords');
      const users = getAll('users');
      const members = getAll('churchMembers');

      // Transform database records to display format
      const transformedRecords = records.map(record => {
        const user = users.find(u => u.id === record.userId);
        const member = members.find(m => m.personalCode === user?.personalCode);

        return {
          id: record.id,
          teenName: user?.name || member?.name || 'Unknown',
          teenId: user?.personalCode || member?.personalCode || 'Unknown',
          location: record.location || 'Main Sanctuary',
          checkInTime: record.timestamp ? new Date(record.timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }) : null,
          status: 'Present', // All records in database are attendance records
          usher: 'System', // Could be enhanced to track actual ushers
          date: record.timestamp ? new Date(record.timestamp).toISOString().split('T')[0] : selectedDate,
          notes: '',
          method: record.method,
          service: record.service
        };
      });

      setAttendanceRecords(transformedRecords);
    };

    loadAttendanceData();
  }, [selectedDate]);

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
    return matchesDate && matchesLocation;
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
  const absentCount = 0; // For now, we only have present records in the database

  return (
    <div className="flex-1 flex flex-col space-y-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Attendance Records</h1>
          <p className="text-sm text-gray-600 mt-1">Monitor and manage teen attendance across all locations</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20 text-sm"
              />
            </div>
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
          </div>
          {/* Export Button */}
          <button
            onClick={exportAttendance}
            className="flex items-center gap-2 bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white px-4 py-3 rounded-lg font-bold transition-all active:scale-95"
          >
            <Download size={20} />
            Export CSV
          </button>
        </div>
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