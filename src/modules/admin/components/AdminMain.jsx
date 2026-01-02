import React, { useState, useEffect } from 'react';
import { Button } from '@/components/shared/ui/button';
import { FileSpreadsheet, UserPlus, Phone, User, CheckCircle, AlertCircle, X } from 'lucide-react';
import SundayAttendanceCard from '@/components/shared/ui/sunday-attendance';
import { AttendanceTrendsChart } from '@/components/shared/ui/chart';
import { getAll } from '../../../utils/database';

const AdminMain = () => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [shepherdingList, setShepherdingList] = useState([]);
  const [stats, setStats] = useState({
    totalTeens: 0,
    todaysPresence: 0,
    firstTimers: 0,
    avgRetention: 0
  });

  // Load data from database
  useEffect(() => {
    const loadData = () => {
      const contacts = getAll('shepherdingContacts');
      const users = getAll('users');
      const attendanceRecords = getAll('attendanceRecords');

      // Transform shepherding contacts
      const transformedContacts = contacts.map(contact => {
        const shepherd = users.find(u => u.id === contact.shepherd);
        const member = users.find(u => u.id === contact.member);

        return {
          name: member?.name || 'Unknown',
          weeksAbsent: 0, // Default, could calculate
          phone: contact.contactInfo
        };
      });

      setShepherdingList(transformedContacts.slice(0, 3)); // Show first 3

      // Calculate stats
      const totalTeens = users.filter(u => u.role === 'teen').length;
      const todaysAttendance = attendanceRecords.filter(r => {
        const recordDate = new Date(r.timestamp).toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        return recordDate === today;
      }).length;

      setStats({
        totalTeens,
        todaysPresence: todaysAttendance,
        firstTimers: 0, // Not tracked
        avgRetention: 82 // Mock
      });
    };

    loadData();
  }, []);

  const handleExportExcel = () => {
    // Mock data for export
    const attendanceData = [
      ['Date', 'Total Teens', 'Present', 'First Timers', 'Location'],
      ['2024-12-29', '245', '220', '5', 'Main Campus'],
      ['2024-12-22', '248', '215', '8', 'Main Campus'],
      ['2024-12-15', '242', '210', '3', 'Main Campus']
    ];

    const csvContent = attendanceData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    setMessage('Attendance report exported successfully!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleNewMember = () => {
    // Navigate to members page or open modal
    window.location.href = '/members';
  };

  const handleCallShepherd = (person) => {
    setSelectedPerson(person);
    setShowCallModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex space-x-2">
          <Button size="sm" style={{ backgroundColor: 'hsl(186, 70%, 34%)', color: 'white', border: 'none' }} onClick={handleExportExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button size="sm" style={{ backgroundColor: 'hsl(186, 70%, 34%)', color: 'white', border: 'none' }} onClick={handleNewMember}>
            <UserPlus className="mr-2 h-4 w-4" />
            New Member
          </Button>
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

      {/* Top Row: Progress Bars and Shepherding List */}
      <div className="grid gap-4 md:grid-cols-2">
        <SundayAttendanceCard />
        {/* Shepherding List Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Shepherding List</h3>
          <div className="space-y-3">
            {shepherdingList.map((person, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <p className="font-medium">{person.name}</p>
                </div>
                <p className="text-sm text-muted-foreground">{person.weeksAbsent} weeks absent</p>
                <Button size="sm" style={{ backgroundColor: 'hsl(186, 70%, 34%)', color: 'white', border: 'none' }} onClick={() => handleCallShepherd({ name: person.name, phone: person.phone })}>
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {shepherdingList.length === 0 && (
              <p className="text-sm text-muted-foreground">No shepherding assignments found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Middle Row: Area Chart and Stats Cards + Usher Performance */}
      <div className="grid gap-4 md:grid-cols-2">
        <AttendanceTrendsChart />

        {/* Right Column: Stats Cards + Usher Performance */}
        <div className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg flex flex-col">
              <h4 className="text-sm font-medium text-muted-foreground whitespace-nowrap">Total Teens</h4>
              <div className="self-end text-right mt-2">
                <p className="text-4xl font-bold inline">{stats.totalTeens}</p>
                <p className="text-sm text-[#1a8995] inline ml-2">+12%</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg flex flex-col">
              <h4 className="text-sm font-medium text-muted-foreground whitespace-nowrap">Today's Presence</h4>
              <div className="self-end text-right mt-2">
                <p className="text-4xl font-bold inline">{stats.todaysPresence}</p>
                <p className="text-sm text-muted-foreground inline ml-2">{stats.totalTeens > 0 ? Math.round((stats.todaysPresence / stats.totalTeens) * 100) : 0}% total</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg flex flex-col">
              <h4 className="text-sm font-medium text-muted-foreground whitespace-nowrap">First Timers</h4>
              <div className="self-end text-right mt-2">
                <p className="text-4xl font-bold inline">{stats.firstTimers}</p>
                <p className="text-sm text-muted-foreground inline ml-2">New souls</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg flex flex-col">
              <h4 className="text-sm font-medium text-muted-foreground whitespace-nowrap">Avg. Retention</h4>
              <div className="self-end text-right mt-2">
                <p className="text-4xl font-bold">{stats.avgRetention}%</p>
              </div>
            </div>
          </div>

          {/* Usher Performance */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Usher Performance (Today)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <h4 className="font-medium">Ameyaw Kofi</h4>
                <p className="text-2xl font-bold">64</p>
                <p className="text-sm text-muted-foreground">Scans</p>
                <p className="text-sm">4 entries with BOL-Key</p>
              </div>
              <div className="text-center">
                <h4 className="font-medium">Kwame Tetteh</h4>
                <p className="text-2xl font-bold">50</p>
                <p className="text-sm text-muted-foreground">Scans</p>
                <p className="text-sm">1 entry with BOL-Key</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call Modal */}
      {showCallModal && selectedPerson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl relative">
            {/* Accessibility: Screen reader title */}
            <h1 className="sr-only">Call Shepherd Contact Modal</h1>
            <h2 className="text-2xl font-bold text-black mb-4">Call Contact</h2>
      
            <button
              onClick={() => setShowCallModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
      
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
    </div>
  );
};

export default AdminMain;