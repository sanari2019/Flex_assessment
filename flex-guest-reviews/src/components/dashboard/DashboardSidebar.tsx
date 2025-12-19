import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Home,
  MessageSquare,
  BarChart3,
  Settings,
  X,
  ExternalLink,
  Menu,
} from 'lucide-react';
import { useEffect } from 'react';
import theFlexLogo from '@/assets/theflex-logo.png';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', tab: 'overview' },
  { icon: Home, label: 'Properties', tab: 'properties' },
  { icon: MessageSquare, label: 'All Reviews', tab: 'reviews' },
  { icon: BarChart3, label: 'Analytics', tab: 'analytics' },
];

interface DashboardSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function DashboardSidebar({ isOpen, onToggle, activeTab = 'overview', onTabChange }: DashboardSidebarProps) {
  const location = useLocation();

  // Close sidebar on route change (mobile only when open)
  useEffect(() => {
    if (window.innerWidth < 1024 && isOpen) {
      onToggle();
    }
  }, [location.pathname]);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar - Mobile only, slides from right */}
      <aside className={cn(
        'fixed top-0 right-0 h-screen bg-card border-l border-border flex flex-col z-50 transition-transform duration-300 lg:hidden',
        'w-64',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        {/* Header */}
        <div className="h-[60px] flex items-center justify-between px-4 border-b border-border">
          <Link to="/" className="flex items-center">
            <img src={theFlexLogo} alt="The Flex" className="h-7" />
          </Link>
          <button 
            onClick={onToggle}
            className="p-1 text-muted-foreground hover:text-foreground"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* View Site Link */}
        <div className="px-3 py-4 border-b border-border">
          <Link 
            to="/" 
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary hover:bg-secondary transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
            <span className="font-medium">View Site</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.tab;
              
              return (
                <li key={item.label}>
                  <button
                    onClick={() => {
                      onTabChange?.(item.tab);
                      onToggle();
                    }}
                    className={cn(
                      'nav-item w-full text-left',
                      isActive && 'active'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Settings at bottom */}
        <div className="px-3 pb-6 border-t border-border pt-4">
          <Link to="/settings" className="nav-item">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

export function SidebarToggle({ onToggle }: { onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
      aria-label="Open sidebar"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
