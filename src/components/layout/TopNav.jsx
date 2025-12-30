import React from 'react';
import { LogOut, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shared/ui/avatar';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';

const TopNav = () => {
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 h-16 flex items-center justify-between px-4">
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 bg-white/10 border-white/20 text-[#1a8995] placeholder-gray-400 backdrop-blur-md"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar className="w-10 h-10 border-2 border-[#1a8995]">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <Button variant="ghost" size="icon" className="text-[#1a8995] hover:bg-white/20">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default TopNav;