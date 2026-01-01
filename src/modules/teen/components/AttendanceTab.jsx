import React from 'react';
import { getUserAttendance } from '../../../utils/database';

const AttendanceTab = () => {
  // Get current user
  const getCurrentUser = () => {
    const userAccount = localStorage.getItem('userAccount');
    return userAccount ? JSON.parse(userAccount) : null;
  };

  const currentUser = getCurrentUser();

  // Calculate attendance data
  const getAttendanceData = () => {
    if (!currentUser?.id) {
      return {
        history: [],
        summary: { present: 0, absent: 0, rate: 0 }
      };
    }

    // Get real attendance data
    const attendanceRecords = getUserAttendance(currentUser.id);

    // Convert to display format
    const history = attendanceRecords.map(record => ({
      date: new Date(record.timestamp).toLocaleDateString(),
      service: record.service,
      status: 'Present' // All records in database are attendance records
    }));

    // Calculate summary
    const present = history.length;
    const totalWeeks = 52; // Assuming yearly calculation
    const absent = Math.max(0, totalWeeks - present);
    const rate = totalWeeks > 0 ? Math.round((present / totalWeeks) * 100) : 0;

    return {
      history,
      summary: { present, absent, rate }
    };
  };

  const { history: attendanceHistory, summary: attendanceSummary } = getAttendanceData();

  return (
    <div className="flex-1 flex flex-col space-y-4">
      <h2 className="text-xl text-center font-bold text-black">Attendance History</h2>

      <div className="bg-white/50 backdrop-blur-md rounded-lg p-4 shadow-lg border border-gray-300">
        <h3 className="text-lg font-bold text-black mb-4">Recent Attendance</h3>
        <div className="space-y-2">
          {attendanceHistory.map((record, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-black">{record.date}</p>
                <p className="text-sm text-gray-600">{record.service}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                record.status === 'Present'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {record.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/50 backdrop-blur-md rounded-lg p-4 shadow-lg border border-gray-300">
        <h3 className="text-lg font-bold text-black mb-4">Attendance Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{attendanceSummary.present}</p>
            <p className="text-sm text-gray-600">Present</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{attendanceSummary.absent}</p>
            <p className="text-sm text-gray-600">Absent</p>
          </div>
        </div>
        <p className="text-center mt-4 text-sm text-gray-600">{attendanceSummary.rate}% Attendance Rate</p>
      </div>
    </div>
  );
};

export default AttendanceTab;