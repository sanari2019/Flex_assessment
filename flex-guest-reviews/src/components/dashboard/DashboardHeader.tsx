import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bell, User, ExternalLink, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { Review } from '@/lib/api';
import theFlexLogo from '@/assets/theflex-logo.png';

interface DashboardHeaderProps {
  onMenuToggle: () => void;
  reviews?: Review[];
}

export function DashboardHeader({ onMenuToggle, reviews = [] }: DashboardHeaderProps) {
  // Get pending reviews for notifications
  const pendingReviews = reviews.filter(r => r.status === 'pending' || !r.approved_for_website);
  const unapprovedCount = pendingReviews.length;

  return (
    <header className="sticky top-0 z-30 h-[60px] bg-card border-b border-border flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={theFlexLogo} alt="The Flex" className="h-7" />
        </Link>

        <div className="hidden lg:block ml-4">
          <h1 className="text-base font-semibold text-foreground">Reviews Dashboard</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link to="/" target="_blank" className="hidden sm:block">
          <Button variant="outline" size="sm" className="gap-2 h-8">
            <ExternalLink className="h-4 w-4" />
            <span className="hidden md:inline">View Site</span>
          </Button>
        </Link>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unapprovedCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-medium">
                  {unapprovedCount > 9 ? '9+' : unapprovedCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-background border border-border shadow-lg z-[200]">
            <div className="px-3 py-2 border-b border-border">
              <p className="font-semibold text-foreground">Notifications</p>
              <p className="text-xs text-muted-foreground">{unapprovedCount} reviews pending approval</p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {pendingReviews.slice(0, 5).map((review) => (
                <DropdownMenuItem key={review.id} asChild>
                  <Link 
                    to={`/dashboard?tab=reviews&review=${review.id}`}
                    className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium text-sm">{review.guest_name}</span>
                      <span className="text-xs text-muted-foreground capitalize px-2 py-0.5 bg-muted rounded">
                        {review.status === 'pending' ? 'Pending' : 'Needs Approval'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{review.listing_name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{review.comment}</p>
                  </Link>
                </DropdownMenuItem>
              ))}
              {pendingReviews.length === 0 && (
                <div className="px-3 py-6 text-center text-muted-foreground text-sm">
                  No pending reviews
                </div>
              )}
            </div>
            {pendingReviews.length > 5 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link 
                    to="/dashboard?tab=reviews&filter=pending"
                    className="w-full text-center text-primary text-sm font-medium py-2"
                  >
                    View all {unapprovedCount} pending reviews
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-background border border-border shadow-lg z-[200]">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
