import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shared/ui/avatar';
import { Input } from '@/components/shared/ui/input';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const AdminLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#d1e5e6] flex relative overflow-hidden">
      <div className={cn(
        "absolute top-20 w-80 h-80 md:w-140 md:h-140 rounded-full opacity-30 blur-3xl",
        isSidebarCollapsed ? "left-16 md:left-20" : "left-64 md:left-80"
      )} style={{ backgroundColor: 'hsl(140, 24, 85)' }}></div>
      <div className="absolute top-35 right-10 md:-right-25 w-80 h-80 md:w-140 md:h-140 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: 'hsl(248, 22%, 50%)' }}></div>
      <div className="absolute bottom-10 right-20 md:-bottom-25 md:right-100 w-80 h-80 md:w-140 md:h-140 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: 'hsl(186, 26%, 62%)' }}></div>

      
      <Sidebar onToggle={setIsSidebarCollapsed} />
      <div className={cn(
        "flex-1 flex flex-col relative z-10 transition-all duration-300",
        isSidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        <TopNav isSidebarCollapsed={isSidebarCollapsed} />
        <main className="flex-1 p-8 pt-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;