import React from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#d1e5e6] flex relative overflow-hidden">
      <div className="absolute top-20 left-64 md:left-80 w-80 h-80 md:w-140 md:h-140 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: 'hsl(140, 24, 85)' }}></div>
      <div className="absolute top-35 right-10 md:-right-25 w-80 h-80 md:w-140 md:h-140 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: 'hsl(248, 22%, 50%)' }}></div>
      <div className="absolute bottom-10 right-20 md:-bottom-25 md:right-100 w-80 h-80 md:w-140 md:h-140 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: 'hsl(186, 26%, 62%)' }}></div>
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-10 ml-64">
        <TopNav />
        <main className="flex-1 p-8 pt-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;