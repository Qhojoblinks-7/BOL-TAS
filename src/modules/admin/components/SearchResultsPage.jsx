import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAll } from '../../../utils/database';
import { useAddAttendanceRecordMutation } from '../../../services/attendanceApi';
import SuccessOverlay from '../../usher/components/SuccessOverlay';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchResults } = location.state || { searchResults: [] };
  const users = getAll('users');
  const [addAttendanceRecord] = useAddAttendanceRecordMutation();
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [attendanceLog, setAttendanceLog] = useState(() => {
    const cached = localStorage.getItem('adminAttendanceLog');
    return cached ? JSON.parse(cached) : [];
  });

  return (
    <div className="flex-1 flex flex-col space-y-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Search Results</h1>
          <p className="text-sm text-gray-600 mt-1">Found {searchResults.length} member(s)</p>
        </div>
        <button
          onClick={() => navigate('/check-in-terminal')}
          className="px-4 py-2 bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white rounded transition-colors"
        >
          Back to Terminal
        </button>
      </div>

      {/* Search Results Table */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden">
        <div className="bg-[hsl(186,70%,34%)]/5 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Search Results ({searchResults.length})</h3>
          <p className="text-sm text-gray-600">Click on a member to view details and check them in</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Name</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Personal Code</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Area</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Parent</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Birth Year</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((member, index) => (
                <tr key={member.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-[hsl(186,70%,34%)]/5 transition-colors`}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{member.name}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{member.personalCode}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{member.area}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{member.parent}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{member.birthYear}</td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    {(() => {
                      const user = users.find(u => u.personalCode === member.personalCode);
                      const isCheckedIn = user && attendanceLog.some(record => record.userId === user.id);
                      return isCheckedIn ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">
                          Already Checked In
                        </span>
                      ) : (
                        <button
                          onClick={async () => {
                            if (user) {
                              try {
                                const record = await addAttendanceRecord({
                                  userId: user.id,
                                  method: 'Manual Check-in',
                                  service: 'Sunday Service',
                                  location: 'Main Sanctuary'
                                }).unwrap();
                                setAttendanceLog(prev => [...prev, record]);
                                setShowSuccessOverlay(true);
                                setTimeout(() => setShowSuccessOverlay(false), 3000);
                              } catch (error) {
                                console.error('Failed to add attendance record:', error);
                              }
                            }
                          }}
                          className="px-3 py-1 bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white text-xs rounded transition-colors"
                        >
                          Confirm Check-in
                        </button>
                      );
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Success Overlay */}
      <SuccessOverlay showSuccessOverlay={showSuccessOverlay} />
    </div>
  );
};

export default SearchResultsPage;