import React, { useState } from 'react';
import { BarChart3, Users, UserCheck, UserPlus, TrendingUp, TrendingDown, Calendar, Clock, Activity, MapPin, Heart, CheckCircle, AlertCircle } from 'lucide-react';
import SundayAttendanceCard from '@/components/shared/ui/sunday-attendance';
import { AttendanceTrendsChart } from '@/components/shared/ui/chart';

const StatisticsPage = () => {
  const [timeRange, setTimeRange] = useState('week');

  // Mock comprehensive statistics data
  const stats = {
    overview: {
      totalMembers: 248,
      activeMembers: 220,
      todaysAttendance: 112,
      firstTimers: 7,
      retentionRate: 82,
      totalAssignments: 5,
      activeAssignments: 4,
      inactiveAssignments: 1
    },
    attendance: {
      thisWeek: 112,
      lastWeek: 108,
      change: 3.7,
      locations: [
        { name: 'Main Campus', attendance: 85, capacity: 150, percentage: 56.7 },
        { name: 'East Legon', attendance: 15, capacity: 40, percentage: 37.5 },
        { name: 'Cantonments', attendance: 8, capacity: 25, percentage: 32.0 },
        { name: 'Tema', attendance: 4, capacity: 20, percentage: 20.0 }
      ]
    },
    ushers: [
      { name: 'Ameyaw Kofi', scans: 64, bolKeyEntries: 4, efficiency: 95 },
      { name: 'Kwame Tetteh', scans: 50, bolKeyEntries: 1, efficiency: 87 },
      { name: 'Sarah Mensah', scans: 42, bolKeyEntries: 2, efficiency: 91 },
      { name: 'David Osei', scans: 38, bolKeyEntries: 0, efficiency: 83 }
    ],
    services: {
      averageDuration: '1h 45m',
      totalServices: 52,
      systemUptime: 99.8,
      averageEngagement: 78
    }
  };

  const getChangeIcon = (change) => {
    return change > 0 ? <TrendingUp size={16} className="text-green-600" /> : <TrendingDown size={16} className="text-red-600" />;
  };

  const getChangeColor = (change) => {
    return change > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Church Statistics</h1>
          <p className="text-sm text-gray-600 mt-1">Comprehensive overview of church metrics and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[hsl(186,70%,34%)]" />
            <h3 className="text-sm font-medium text-gray-700">Total Members</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.overview.totalMembers}</p>
          <div className="flex items-center gap-1 mt-1">
            {getChangeIcon(12)}
            <span className={`text-xs ${getChangeColor(12)}`}>+12%</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            <h3 className="text-sm font-medium text-gray-700">Active Members</h3>
          </div>
          <p className="text-2xl font-bold mt-2 text-green-600">{stats.overview.activeMembers}</p>
          <p className="text-xs text-gray-600 mt-1">89% of total</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-700">Today's Attendance</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.overview.todaysAttendance}</p>
          <div className="flex items-center gap-1 mt-1">
            {getChangeIcon(stats.attendance.change)}
            <span className={`text-xs ${getChangeColor(stats.attendance.change)}`}>+{stats.attendance.change}%</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-purple-600" />
            <h3 className="text-sm font-medium text-gray-700">First Timers</h3>
          </div>
          <p className="text-2xl font-bold mt-2 text-purple-600">{stats.overview.firstTimers}</p>
          <p className="text-xs text-gray-600 mt-1">New souls</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-600" />
            <h3 className="text-sm font-medium text-gray-700">Retention Rate</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.overview.retentionRate}%</p>
          <p className="text-xs text-gray-600 mt-1">Member retention</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-600" />
            <h3 className="text-sm font-medium text-gray-700">Shepherding</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.overview.totalAssignments}</p>
          <p className="text-xs text-gray-600 mt-1">{stats.overview.activeAssignments} active</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            <h3 className="text-sm font-medium text-gray-700">Avg. Service</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.services.averageDuration}</p>
          <p className="text-xs text-gray-600 mt-1">Duration</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-teal-600" />
            <h3 className="text-sm font-medium text-gray-700">System Uptime</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.services.systemUptime}%</p>
          <p className="text-xs text-gray-600 mt-1">Reliability</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <AttendanceTrendsChart />
        <SundayAttendanceCard />
      </div>

      {/* Detailed Statistics */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Usher Performance */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden">
          <div className="bg-[hsl(186,70%,34%)]/5 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 size={20} />
              Usher Performance
            </h3>
            <p className="text-sm text-gray-600">Today's scanning activity</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.ushers.map((usher, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{usher.name}</h4>
                    <p className="text-sm text-gray-600">{usher.scans} scans • {usher.bolKeyEntries} BOL-Key entries</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[hsl(186,70%,34%)]">{usher.efficiency}%</div>
                    <div className="text-xs text-gray-600">Efficiency</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Location Performance */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden">
          <div className="bg-[hsl(186,70%,34%)]/5 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin size={20} />
              Location Performance
            </h3>
            <p className="text-sm text-gray-600">Attendance by location</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.attendance.locations.map((location, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{location.name}</span>
                    <span className="text-sm text-gray-600">{location.attendance}/{location.capacity}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[hsl(186,70%,34%)] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${location.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 text-right">{location.percentage}% capacity</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden">
        <div className="bg-[hsl(186,70%,34%)]/5 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity size={20} />
            Service Analytics
          </h3>
          <p className="text-sm text-gray-600">Detailed service performance metrics</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[hsl(186,70%,34%)]">{stats.services.totalServices}</div>
              <div className="text-sm text-gray-600 mt-1">Total Services</div>
              <div className="text-xs text-green-600 mt-1">This year</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.services.averageEngagement}%</div>
              <div className="text-sm text-gray-600 mt-1">Avg. Engagement</div>
              <div className="text-xs text-gray-600 mt-1">Member interaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.services.systemUptime}%</div>
              <div className="text-sm text-gray-600 mt-1">System Uptime</div>
              <div className="text-xs text-gray-600 mt-1">Reliability</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.attendance.locations.length}</div>
              <div className="text-sm text-gray-600 mt-1">Active Locations</div>
              <div className="text-xs text-gray-600 mt-1">Service points</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;