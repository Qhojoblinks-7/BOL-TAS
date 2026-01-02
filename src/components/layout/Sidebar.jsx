import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/shared/ui/button';
import { Badge } from '@/components/shared/ui/badge';
import { cn } from '@/utils/cn';
import { BarChart3, Users, Calendar, UserCheck, List, LayoutGrid, ChevronLeft, ChevronRight, LogOut, HelpCircle } from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/overview', icon: LayoutGrid },
  { name: 'Statistics', href: '/statistics', icon: BarChart3 },
  { name: 'Members', href: '/members', icon: Users },
  { name: 'Attendance', href: '/attendance', icon: Calendar },
  { name: 'Ushers', href: '/ushers', icon: UserCheck },
  { name: 'Shepherding list', href: '/shepherding', icon: List },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

const Sidebar = ({ className, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeNav = location.pathname.replace('/', '') || 'overview';
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavClick = (href) => {
    navigate(href);
  };

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem('userAccount');
    // Dispatch logout event
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
    // Navigate to login
    navigate('/login');
  };

  return (
    <>
      {/* Toggle Badge - Positioned on the edge */}
      <div className={cn(
        "fixed top-20 z-30 transition-all duration-300",
        isCollapsed ? "left-12" : "left-60"
      )}>
        <Badge
          variant="outline"
          className="cursor-pointer text-[#ffffff] border-[#1a8995] hover:text-white bg-[hsl(186,70%,34%)] hover:border-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] flex items-center justify-center w-8 h-8"
          onClick={toggleSidebar}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Badge>
      </div>

      <div className={cn(
        "fixed left-0 top-0 h-full pb-12 bg-white/10 backdrop-blur-md border-r border-white/20 z-20 pt-16 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}>
        {/* Logo/Brand - Moved to top aligned with header */}
        {!isCollapsed && (
          <div className="absolute top-4 left-4 right-4 text-[#1a8995] font-sans">
            <h2 className="text-xl font-bold leading-tight">Bread of Life</h2>
            <p className="text-xs uppercase tracking-wider">Teens Service</p>
          </div>
        )}

        <div className="space-y-4 py-4 pt-20">

        {/* Navigation Items */}
        <div className="px-3 py-2">
          <div className="space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href.replace('/', '') === activeNav;
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  className={cn(
                    "w-full rounded-full transition-all duration-200",
                    isCollapsed ? "justify-center px-2" : "justify-start",
                    isActive
                      ? "text-white bg-[hsl(186,70%,34%)] drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                      : "text-[#1a8995] hover:text-white hover:bg-[hsl(186,70%,34%)] hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] active:text-white active:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                  )}
                  onClick={() => handleNavClick(item.href)}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Logout Button - Positioned at bottom */}
        <div className="absolute bottom-4 left-0 right-0 px-3">
          <Button
            variant="ghost"
            className={cn(
              "w-full rounded-full text-[#1a8995] hover:text-white hover:bg-[hsl(186,70%,34%)] hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] transition-all duration-200",
              isCollapsed ? "justify-center px-2" : "justify-start"
            )}
            title={isCollapsed ? "Logout" : undefined}
            onClick={handleLogout}
          >
            <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  </>
);
};

export default Sidebar;