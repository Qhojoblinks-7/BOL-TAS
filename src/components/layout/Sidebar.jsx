import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/shared/ui/button';
import { cn } from '@/utils/cn';
import { BarChart3, Users, Calendar, UserCheck, List } from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/overview', icon: BarChart3 },
  { name: 'Members', href: '/members', icon: Users },
  { name: 'Attendance', href: '/attendance', icon: Calendar },
  { name: 'Ushers', href: '/ushers', icon: UserCheck },
  { name: 'Shepherding list', href: '/shepherding', icon: List },
];

const Sidebar = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeNav = location.pathname.replace('/', '') || 'overview';

  const handleNavClick = (href) => {
    navigate(href);
  };

  return (
    <div className={cn("fixed left-0 top-0 h-full pb-12 w-64 bg-white/10 backdrop-blur-md border-r border-white/20 z-20 pt-16", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mb-4 px-4 text-[#1a8995] font-sans">
            <h2 className="text-xl font-bold leading-tight">Bread of Life</h2>
            <p className="text-xs uppercase tracking-wider">Teens Service</p>
          </div>
          <div className="space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href.replace('/', '') === activeNav;
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start rounded-full",
                    isActive
                      ? "text-white bg-[hsl(186,70%,34%)] drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                      : "text-[#1a8995] hover:text-white hover:bg-[hsl(186,70%,34%)] hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] active:text-white active:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                  )}
                  onClick={() => handleNavClick(item.href)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;