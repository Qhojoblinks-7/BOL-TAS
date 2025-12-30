import React from 'react';
import { LogOut } from 'lucide-react';

const UsherHeader = () => {
  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b-2 border-[hsl(186,70%,34%)]/30 p-4 md:p-5 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-black">Usher Terminal</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-0.5">Church Attendance Check-in</p>
      </div>
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('userLoggedOut'))}
        className="p-2.5 rounded-full hover:bg-red-50 transition-colors text-red-600 hover:text-red-700 active:scale-95"
        title="Logout"
      >
        <LogOut size={24} />
      </button>
    </header>
  );
};

export default UsherHeader;