import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { LogOut, Search, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shared/ui/avatar';
import { Input } from '@/components/shared/ui/input';

const TopNav = ({ isSidebarCollapsed }) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  // Get current page for context-specific search
  const getCurrentPage = () => {
    const path = location.pathname.replace('/', '');
    switch (path) {
      case 'members': return 'members';
      case 'attendance': return 'attendance';
      case 'ushers': return 'ushers';
      case 'shepherding': return 'shepherding';
      case 'statistics': return 'statistics';
      case 'overview':
      case '': return 'overview';
      default: return 'overview';
    }
  };

  const currentPage = getCurrentPage();

  // Get placeholder text based on current page
  const getSearchPlaceholder = () => {
    switch (currentPage) {
      case 'members': return 'Search members by name, email, or ID...';
      case 'attendance': return 'Search attendance by name or ID...';
      case 'ushers': return 'Search ushers...';
      case 'shepherding': return 'Search shepherding records...';
      case 'statistics': return 'Search statistics...';
      default: return 'Search...';
    }
  };

  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Dispatch custom event for page-specific search
    const searchEvent = new CustomEvent('globalSearch', {
      detail: { searchTerm: value, page: currentPage }
    });
    window.dispatchEvent(searchEvent);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    const searchEvent = new CustomEvent('globalSearch', {
      detail: { searchTerm: '', page: currentPage }
    });
    window.dispatchEvent(searchEvent);
    searchInputRef.current?.focus();
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      clearSearch();
    }
  };

  return (
    <header className={`fixed top-0 ${isSidebarCollapsed ? 'left-16' : 'left-64'} right-0 z-30 bg-white/10 backdrop-blur-md border-b border-white/20 h-16 flex items-center justify-between px-4`}>
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder={getSearchPlaceholder()}
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-10 bg-white/10 border-white/20 text-[#1a8995] placeholder-gray-400 backdrop-blur-md focus:ring-2 focus:ring-[hsl(186,70%,34%)]/30"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar className="w-10 h-10 border-2 border-[#1a8995]">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback className="bg-[hsl(186,70%,34%)] text-white">A</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;