import React from 'react';
import { Edit, LogOut, Menu } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/shared/ui/avatar';

const TeenPortalHeader = ({ user, onEditProfile, onLogout, onMenuClick }) => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-300 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Menu"
        >
          <Menu size={20} />
        </button>
        <Avatar className="h-12 w-12 rounded-md">
          <AvatarImage src={user.photoURL} alt={user.displayName} />
          <AvatarFallback className="rounded-md bg-gray-300 text-black font-black">
            {user.displayName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-black text-lg tracking-tight text-black">{user.displayName}</h1>
          <p className="text-sm text-gray-600 tracking-widest uppercase">Teen Member</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onEditProfile}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Edit Profile"
        >
          <Edit size={20} />
        </button>
        <button
          onClick={onLogout}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-red-600"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default TeenPortalHeader;