import React from 'react';

const AttendanceTab = () => {
  // Mock attendance data - in real app, this would come from localStorage or API
  const attendanceHistory = [
    { date: '2024-12-25', service: 'Sunday Service', status: 'Present' },
    { date: '2024-12-18', service: 'Sunday Service', status: 'Present' },
    { date: '2024-12-11', service: 'Sunday Service', status: 'Absent' },
    { date: '2024-12-04', service: 'Sunday Service', status: 'Present' },
    { date: '2024-11-27', service: 'Sunday Service', status: 'Present' },
  ];

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
            <p className="text-2xl font-bold text-green-600">4</p>
            <p className="text-sm text-gray-600">Present</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">1</p>
            <p className="text-sm text-gray-600">Absent</p>
          </div>
        </div>
        <p className="text-center mt-4 text-sm text-gray-600">80% Attendance Rate</p>
      </div>
    </div>
  );
};

export default AttendanceTab;