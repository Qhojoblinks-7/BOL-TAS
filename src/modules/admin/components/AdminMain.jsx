import React from 'react';
import { Button } from '@/components/shared/ui/button';
import { FileSpreadsheet, UserPlus, Phone, User } from 'lucide-react';
import SundayAttendanceCard from '@/components/shared/ui/sunday-attendance';
import { AttendanceTrendsChart } from '@/components/shared/ui/chart';

const AdminMain = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex space-x-2">
          <Button size="sm" style={{ backgroundColor: 'hsl(186, 70%, 34%)', color: 'white', border: 'none' }}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button size="sm" style={{ backgroundColor: 'hsl(186, 70%, 34%)', color: 'white', border: 'none' }}>
            <UserPlus className="mr-2 h-4 w-4" />
            New Member
          </Button>
        </div>
      </div>

      {/* Top Row: Progress Bars and Shepherding List */}
      <div className="grid gap-4 md:grid-cols-2">
        <SundayAttendanceCard />
        {/* Shepherding List Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Shepherding List</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
               <div className="flex items-center">
                 <User className="mr-2 h-4 w-4" />
                 <p className="font-medium">Ama Serwaa</p>
               </div>
               <p className="text-sm text-muted-foreground">4 weeks absent</p>
               <Button size="sm" style={{ backgroundColor: 'hsl(186, 70%, 34%)', color: 'white', border: 'none' }}>
                 <Phone className="h-4 w-4" />
               </Button>
             </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <p className="font-medium">Emmanuel K.</p>
              </div>
              <p className="text-sm text-muted-foreground">2 weeks absent</p>
              <Button size="sm" style={{ backgroundColor: 'hsl(186, 70%, 34%)', color: 'white', border: 'none' }}>
                <Phone className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <p className="font-medium">John Quaye</p>
              </div>
              <p className="text-sm text-muted-foreground">Absent last week</p>
              <Button size="sm" style={{ backgroundColor: 'hsl(186, 70%, 34%)', color: 'white', border: 'none' }}>
                <Phone className="h-4 w-4" />
              </Button>
            </div>
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
                <p className="text-4xl font-bold inline">248</p>
                <p className="text-sm text-[#1a8995] inline ml-2">+12%</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg flex flex-col">
              <h4 className="text-sm font-medium text-muted-foreground whitespace-nowrap">Today's Presence</h4>
              <div className="self-end text-right mt-2">
                <p className="text-4xl font-bold inline">112</p>
                <p className="text-sm text-muted-foreground inline ml-2">45% total</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg flex flex-col">
              <h4 className="text-sm font-medium text-muted-foreground whitespace-nowrap">First Timers</h4>
              <div className="self-end text-right mt-2">
                <p className="text-4xl font-bold inline">7</p>
                <p className="text-sm text-muted-foreground inline ml-2">New souls</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg flex flex-col">
              <h4 className="text-sm font-medium text-muted-foreground whitespace-nowrap">Avg. Retention</h4>
              <div className="self-end text-right mt-2">
                <p className="text-4xl font-bold">82%</p>
              </div>
            </div>
          </div>

          {/* Usher Performance */}
          <div className="rounded-lg p-6 shadow-lg" style={{ backgroundColor: 'hsl(186, 86, 50)' }}>
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
    </div>
  );
};

export default AdminMain;