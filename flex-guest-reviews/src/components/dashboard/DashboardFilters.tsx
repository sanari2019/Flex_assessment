import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterState {
  search: string;
  channel: string;
  type: string;
  ratingMin: number;
  approvedOnly: boolean;
  listingId: string;
  dateRange?: DateRange;
}

interface DashboardFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  listings: { id: string; name: string }[];
  className?: string;
}

const channels = [
  { value: 'all', label: 'All Channels' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'booking', label: 'Booking.com' },
  { value: 'direct', label: 'Direct' },
  { value: 'vrbo', label: 'VRBO' },
  { value: 'google', label: 'Google' },
];

const types = [
  { value: 'all', label: 'All Types' },
  { value: 'guest', label: 'Guest' },
  { value: 'host', label: 'Host' },
  { value: 'public', label: 'Public' },
];

const propertyLocations = [
  { value: 'all', label: 'All Properties' },
  { value: 'london', label: 'London' },
  { value: 'paris', label: 'Paris' },
  { value: 'algiers', label: 'Algiers' },
];

export function DashboardFilters({ 
  filters, 
  onFiltersChange, 
  listings,
  className 
}: DashboardFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      channel: 'all',
      type: 'all',
      ratingMin: 0,
      approvedOnly: false,
      listingId: 'all',
      dateRange: undefined,
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.channel !== 'all' || 
    filters.type !== 'all' || 
    filters.ratingMin > 0 || 
    filters.approvedOnly ||
    filters.listingId !== 'all' ||
    filters.dateRange?.from ||
    filters.dateRange?.to;

  return (
    <div className={cn('filter-panel space-y-4', className)}>
      {/* Search and toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by guest, listing, or review text..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-9 border-border focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'relative overflow-hidden',
              isExpanded && 'bg-primary text-primary-foreground'
            )}
          >
            <SlidersHorizontal 
              className={cn(
                "h-4 w-4 absolute transition-all duration-300 ease-in-out",
                isExpanded 
                  ? "rotate-90 opacity-0 scale-50" 
                  : "rotate-0 opacity-100 scale-100"
              )} 
            />
            <X 
              className={cn(
                "h-4 w-4 absolute transition-all duration-300 ease-in-out",
                isExpanded 
                  ? "rotate-0 opacity-100 scale-100" 
                  : "-rotate-90 opacity-0 scale-50"
              )} 
            />
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary">
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Expanded filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border animate-fade-in">
          {/* Property */}
          <div className="space-y-2">
            <Label>Property</Label>
            <Select
              value={filters.listingId}
              onValueChange={(value) => updateFilter('listingId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                {propertyLocations.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
                {listings.map((listing) => (
                  <SelectItem key={listing.id} value={listing.id}>
                    {listing.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Channel */}
          <div className="space-y-2">
            <Label>Channel</Label>
            <Select
              value={filters.channel}
              onValueChange={(value) => updateFilter('channel', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Channels" />
              </SelectTrigger>
              <SelectContent>
                {channels.map((channel) => (
                  <SelectItem key={channel.value} value={channel.value}>
                    {channel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={filters.type}
              onValueChange={(value) => updateFilter('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Min Rating */}
          <div className="space-y-2">
            <Label>Min Rating: {filters.ratingMin.toFixed(1)}</Label>
            <Slider
              value={[filters.ratingMin]}
              onValueChange={([value]) => updateFilter('ratingMin', value)}
              min={0}
              max={5}
              step={0.5}
              className="py-2"
            />
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <Label>Dates</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {filters.dateRange?.from ? (
                      filters.dateRange.to ? (
                        `${format(filters.dateRange.from, 'MMM d')} - ${format(filters.dateRange.to, 'MMM d')}`
                      ) : (
                        format(filters.dateRange.from, 'MMM d, yyyy')
                      )
                    ) : (
                      <span className="text-muted-foreground">Select dates</span>
                    )}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={filters.dateRange}
                  onSelect={(range) => updateFilter('dateRange', range)}
                  numberOfMonths={2}
                  defaultMonth={filters.dateRange?.from}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Approved Only */}
          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="approvedOnly"
              checked={filters.approvedOnly}
              onCheckedChange={(checked) => 
                updateFilter('approvedOnly', checked as boolean)
              }
            />
            <Label htmlFor="approvedOnly" className="cursor-pointer">
              Approved for web only
            </Label>
          </div>
        </div>
      )}
    </div>
  );
}
