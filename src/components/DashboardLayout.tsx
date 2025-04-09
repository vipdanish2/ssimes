
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Menu, 
  LogOut, 
  User,
  ChevronRight
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { Separator } from '@/components/ui/separator';

interface SidebarItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  sidebarItems,
  title
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-card border-r border-border h-screen fixed left-0 top-0 z-30 flex flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between p-4 h-16">
          {!collapsed && (
            <Link to="/" className="text-xl font-bold text-primary">
              SSIEMS Hub
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="ml-auto"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>

        <Separator />

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center p-2 rounded-md transition-colors",
                    "hover:bg-secondary group",
                    location.pathname === item.path 
                      ? "bg-primary/10 text-primary" 
                      : "text-foreground/80"
                  )}
                >
                  <span className="flex items-center justify-center w-6 h-6">
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="ml-3 truncate">{item.title}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center">
            <Avatar>
              <AvatarFallback className="bg-primary/20 text-primary">
                {user?.name?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="ml-3 flex-1 truncate">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={logout} 
              className="ml-auto"
              title="Logout"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300",
          collapsed ? "ml-16" : "ml-64"
        )}
      >
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center px-6 sticky top-0 bg-background z-10">
          <div className="md:hidden mr-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCollapsed(!collapsed)}
            >
              <Menu size={20} />
            </Button>
          </div>
          <h1 className="text-xl font-semibold">{title}</h1>
        </header>

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
