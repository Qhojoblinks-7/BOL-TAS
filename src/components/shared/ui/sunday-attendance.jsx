import React, { useState } from 'react';
import { Progress } from './progress';
import { Button } from './button';

const SundayAttendanceCard = () => {
  const attendance = { boys: 45, girls: 55 };
  const [filter, setFilter] = useState('all');

  // Removed fetch as no backend API is available
  // Using default attendance data

  const totalAttendance = attendance.boys + attendance.girls;
  const boysPercentage = (attendance.boys / totalAttendance) * 100;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Sunday Attendance</h3>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            style={filter === 'all' ? { backgroundColor: 'hsl(186, 70%, 34%)', color: 'white', border: 'none' } : {}}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filter === 'boys' ? 'default' : 'outline'}
            onClick={() => setFilter('boys')}
            style={filter === 'boys' ? { backgroundColor: 'hsl(186, 70%, 34%)', color: 'white', border: 'none' } : {}}
          >
            Boys
          </Button>
          <Button
            size="sm"
            variant={filter === 'girls' ? 'default' : 'outline'}
            onClick={() => setFilter('girls')}
            style={filter === 'girls' ? { backgroundColor: 'hsl(186, 70%, 34%)', color: 'white', border: 'none' } : {}}
          >
            Girls
          </Button>
        </div>
      </div>

      {filter === 'all' && (
        <>
          {/* Overarching Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Total Attendance</span>
              <span>{totalAttendance}%</span>
            </div>
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full transition-all duration-1000"
                style={{
                  width: `${totalAttendance}%`,
                  background: `linear-gradient(to right, hsl(186, 70%, 34%) 0%, hsl(186, 70%, 34%) ${Math.max(0, boysPercentage - 10)}%, hsl(186, 70%, 50%) ${Math.min(100, boysPercentage + 10)}%, hsl(186, 70%, 50%) 100%)`
                }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>Boys: {attendance.boys}%</span>
              <span>Girls: {attendance.girls}%</span>
            </div>
          </div>
        </>
      )}

      {filter === 'boys' && (
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Boys Attendance</span>
            <span>{attendance.boys}%</span>
          </div>
          <div className="relative h-6 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full transition-all duration-1000"
              style={{ width: `${attendance.boys}%`, backgroundColor: 'hsl(186, 70%, 34%)' }}
            />
          </div>
        </div>
      )}

      {filter === 'girls' && (
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Girls Attendance</span>
            <span>{attendance.girls}%</span>
          </div>
          <div className="relative h-6 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full transition-all duration-1000"
              style={{ width: `${attendance.girls}%`, backgroundColor: 'hsl(186, 70%, 50%)' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SundayAttendanceCard;