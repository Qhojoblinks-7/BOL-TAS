import React from 'react';
import { Home, Settings, Shield } from 'lucide-react';

const BottomNav = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-300 p-2 flex justify-around z-20">
      <button
        onClick={() => onTabChange('id')}
        className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
          activeTab === 'id'
            ? 'bg-[#d1e5e6] text-black transform -translate-y-1 shadow-lg'
            : 'text-gray-600 hover:text-black'
        }`}
      >
        <Home size={20} />
        <span className="text-xs mt-1">ID</span>
      </button>
      <button
        onClick={() => onTabChange('security')}
        className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
          activeTab === 'security'
            ? 'bg-[#d1e5e6] text-black transform -translate-y-1 shadow-lg'
            : 'text-gray-600 hover:text-black'
        }`}
      >
        <Settings size={20} />
        <span className="text-xs mt-1">Security</span>
      </button>
      <button
        onClick={() => onTabChange('recovery')}
        className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
          activeTab === 'recovery'
            ? 'bg-[#d1e5e6] text-black transform -translate-y-1 shadow-lg'
            : 'text-gray-600 hover:text-black'
        }`}
      >
        <Shield size={20} />
        <span className="text-xs mt-1">Recovery</span>
      </button>
    </nav>
  );
};

export default BottomNav;