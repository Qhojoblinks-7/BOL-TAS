import React from 'react';
import { QrCode, Keyboard, Search } from 'lucide-react';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 flex shadow-sm sticky top-[72px] z-9">
      <button
        onClick={() => setActiveTab('qr')}
        className={`flex-1 p-3 md:p-4 text-center transition-all duration-200 active:scale-95 flex flex-col items-center gap-1 border-b-2 ${
          activeTab === 'qr'
            ? 'border-[hsl(186,70%,34%)]/80 bg-[hsl(186,70%,34%)]/5 text-black'
            : 'border-transparent text-gray-600 hover:bg-gray-50'
        }`}
      >
        <QrCode size={22} />
        <span className="text-xs md:text-sm font-medium">QR Scan</span>
      </button>
      <button
        onClick={() => setActiveTab('key')}
        className={`flex-1 p-3 md:p-4 text-center transition-all duration-200 active:scale-95 flex flex-col items-center gap-1 border-b-2 ${
          activeTab === 'key'
            ? 'border-[hsl(186,70%,34%)]/80 bg-[hsl(186,70%,34%)]/5 text-black'
            : 'border-transparent text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Keyboard size={22} />
        <span className="text-xs md:text-sm font-medium">BOL-Key</span>
      </button>
      <button
        onClick={() => setActiveTab('search')}
        className={`flex-1 p-3 md:p-4 text-center transition-all duration-200 active:scale-95 flex flex-col items-center gap-1 border-b-2 ${
          activeTab === 'search'
            ? 'border-[hsl(186,70%,34%)]/80 bg-[hsl(186,70%,34%)]/5 text-black'
            : 'border-transparent text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Search size={22} />
        <span className="text-xs md:text-sm font-medium">Search</span>
      </button>
    </nav>
  );
};

export default TabNavigation;