import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';
import { SplashScreen } from '@/components/public/SplashScreen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { mockListings } from '@/data/mockReviews';
import { getPropertiesByCity } from '@/data/propertyLocations';
import { PropertyMap } from '@/components/property/PropertyMap';
import { MapPin, CalendarIcon, Users, SlidersHorizontal, ChevronRight, ChevronLeft, Star, Bed, Bath, List, Map } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function PropertiesPage() {
  const [splashVisible, setSplashVisible] = useState(true);
  const [mapOpen, setMapOpen] = useState(true);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [location, setLocation] = useState('london');
  const [guests, setGuests] = useState(1);
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date } | undefined>(undefined);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [bedrooms, setBedrooms] = useState<string>('any');
  const [bathrooms, setBathrooms] = useState<string>('any');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [showMobileControls, setShowMobileControls] = useState(true);
  const lastScrollY = useRef(0);

  // Scroll direction detection for mobile
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current;
      const scrollThreshold = 10; // Minimum scroll distance to trigger
      
      if (Math.abs(currentScrollY - lastScrollY.current) > scrollThreshold) {
        setShowMobileControls(!scrollingDown || currentScrollY < 100);
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAmenity = (amenity: string) => {
    setAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const resetFilters = () => {
    setPriceRange([0, 10000]);
    setBedrooms('any');
    setBathrooms('any');
    setAmenities([]);
  };

  // Generate mock properties with prices and filter them
  const properties = useMemo(() => {
    // First, add prices and ratings to all listings
    const allProperties = mockListings.map((listing, index) => ({
      ...listing,
      price: 200 + (index * 40),
      rating: 4.5 + (Math.random() * 0.5),
      reviewCount: Math.floor(20 + Math.random() * 80),
    }));

    // Apply filters
    return allProperties.filter((property) => {
      // Location filter
      if (location !== 'all') {
        const locationMatch = property.city.toLowerCase() === location.toLowerCase();
        if (!locationMatch) return false;
      }

      // Price range filter
      if (property.price < priceRange[0] || property.price > priceRange[1]) {
        return false;
      }

      // Guests filter
      if (property.maxGuests < guests) {
        return false;
      }

      // Bedrooms filter
      if (bedrooms !== 'any') {
        if (bedrooms === '4+') {
          if (property.bedrooms < 4) return false;
        } else {
          if (property.bedrooms !== parseInt(bedrooms)) return false;
        }
      }

      // Bathrooms filter
      if (bathrooms !== 'any') {
        if (bathrooms === '4+') {
          if (property.bathrooms < 4) return false;
        } else {
          if (property.bathrooms !== parseInt(bathrooms)) return false;
        }
      }

      // All filters passed
      return true;
    });
  }, [location, priceRange, guests, bedrooms, bathrooms]);

  // Get properties for map display
  const mapProperties = useMemo(() => {
    return getPropertiesByCity(location);
  }, [location]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SplashScreen 
        isVisible={splashVisible} 
        onClose={() => setSplashVisible(false)} 
      />
      <PublicHeader splashVisible={splashVisible} />

      <main className={cn(
        "pt-[72px] transition-all duration-300 flex-1 flex flex-col",
        splashVisible && "pt-[120px]"
      )}>
        {/* Mobile View Toggle */}
        <div className={cn(
          "md:hidden sticky top-[72px] z-40 bg-background py-3 flex justify-center border-b border-border transition-transform duration-300",
          !showMobileControls && "-translate-y-full opacity-0"
        )}>
          <div className="inline-flex rounded-full border border-border bg-card p-1">
            <button
              onClick={() => setMobileView('list')}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors",
                mobileView === 'list' 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="h-4 w-4" />
              List
            </button>
            <button
              onClick={() => setMobileView('map')}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors",
                mobileView === 'map' 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Map className="h-4 w-4" />
              Map
            </button>
          </div>
        </div>

        {/* Filters Bar - only show when map is closed (centered) */}
        {!mapOpen && (
          <div className={cn(
            "border-b border-border bg-card sticky z-30 transition-all duration-300",
            "top-[72px] md:top-[72px]",
            !showMobileControls && "md:translate-y-0 -translate-y-full md:opacity-100 opacity-0",
            mobileView === 'map' && "hidden md:block"
          )}>
            <div className="max-w-[1920px] mx-auto px-4 py-4">
              <div className="flex items-center gap-3 flex-nowrap">
                {/* Location */}
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="bg-background w-[140px] md:w-[180px]">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-[200]">
                    <SelectItem value="london">LONDON</SelectItem>
                    <SelectItem value="paris">PARIS</SelectItem>
                    <SelectItem value="algiers">ALGIERS</SelectItem>
                  </SelectContent>
                </Select>

                {/* Dates */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start bg-background w-[100px] md:w-[200px]">
                      <CalendarIcon className="h-4 w-4 md:mr-2 text-muted-foreground" />
                      <span className="hidden md:inline">
                        {dateRange ? (
                          dateRange.to ? (
                            <span className="text-sm">
                              {format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d')}
                            </span>
                          ) : (
                            format(dateRange.from, 'MMM d, yyyy')
                          )
                        ) : (
                          <span className="text-muted-foreground">Dates</span>
                        )}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border border-border z-[200]" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => setDateRange(range)}
                      numberOfMonths={2}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                {/* Guests - Inline on desktop, popover on mobile */}
                <div className="hidden md:flex items-center gap-2 border border-border rounded-md px-3 py-2 bg-background">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                  >
                    -
                  </Button>
                  <div className="flex items-center gap-2 min-w-[80px] justify-center">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{guests} Guest{guests > 1 ? 's' : ''}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => setGuests(guests + 1)}
                  >
                    +
                  </Button>
                </div>

                {/* Guests - Mobile popover */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="md:hidden bg-background" size="icon">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3 bg-background border border-border z-[200]" align="start">
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                      >
                        -
                      </Button>
                      <div className="flex items-center gap-2 min-w-[80px] justify-center">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{guests} Guest{guests > 1 ? 's' : ''}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setGuests(guests + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Filters Toggle - Icon only on mobile */}
                <Button 
                  variant={filtersOpen ? "default" : "outline"}
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="w-30 md:px-4 relative overflow-hidden"
                  size="icon"
                >
                  <SlidersHorizontal className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Filters</span>
                </Button>
              </div>

              {/* Extended Filters */}
              {filtersOpen && (
                <div className="mt-4 pt-4 border-t border-border space-y-6 animate-fade-in">
                  {/* Price Range */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Price Range (GBP)</span>
                      <span className="text-sm text-muted-foreground">
                        £{priceRange[0]} - £{priceRange[1]}
                      </span>
                    </div>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={10000}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>£0</span>
                      <span>£10,000</span>
                    </div>
                  </div>

                  {/* Bedrooms & Bathrooms */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <span className="text-sm font-medium mb-3 block">Bedrooms</span>
                      <div className="flex flex-wrap gap-2">
                        {['any', '0', '1', '2', '3', '4+'].map((opt) => (
                          <Button
                            key={opt}
                            variant={bedrooms === opt ? "default" : "outline"}
                            size="sm"
                            onClick={() => setBedrooms(opt)}
                            className="min-w-[50px]"
                          >
                            {opt === 'any' ? 'Any' : opt}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium mb-3 block">Bathrooms</span>
                      <div className="flex flex-wrap gap-2">
                        {['any', '1', '2', '3', '4+'].map((opt) => (
                          <Button
                            key={opt}
                            variant={bathrooms === opt ? "default" : "outline"}
                            size="sm"
                            onClick={() => setBathrooms(opt)}
                            className="min-w-[50px]"
                          >
                            {opt === 'any' ? 'Any' : opt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <span className="text-sm font-medium mb-3 block">Amenities</span>
                    <div className="flex flex-wrap gap-4">
                      {['Elevator', 'Balcony', 'Dishwasher', 'Parking', 'Gym', 'Pool'].map((amenity) => (
                        <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox 
                            checked={amenities.includes(amenity)}
                            onCheckedChange={() => toggleAmenity(amenity)}
                          />
                          <span className="text-sm">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Reset */}
                  <Button variant="outline" onClick={resetFilters} className="w-full">
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-1 relative">
          {/* Properties List */}
          <div className={cn(
            "transition-all duration-300 flex flex-col",
            mobileView === 'map' ? "hidden md:flex" : "flex",
            mapOpen ? "md:w-1/2 w-full overflow-y-auto" : "w-full flex-1"
          )}>
            {/* Filters Bar inside listing when map is open */}
            {mapOpen && (
              <div className={cn(
                "border-b border-border bg-card z-30 transition-transform duration-300",
                "md:sticky md:top-0",
                "sticky top-[120px]",
                !showMobileControls && "-translate-y-full opacity-0 md:translate-y-0 md:opacity-100",
                mobileView === 'map' && "hidden md:block"
              )}>
                <div className="px-4 py-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Location */}
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger className="bg-background w-[130px]">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border z-[200]">
                        <SelectItem value="london">LONDON</SelectItem>
                        <SelectItem value="paris">PARIS</SelectItem>
                        <SelectItem value="algiers">ALGIERS</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Dates */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start bg-background w-[100px] md:w-[150px]">
                          <CalendarIcon className="h-4 w-4 md:mr-2 text-muted-foreground" />
                          <span className="text-sm hidden md:inline">
                            {dateRange ? (
                              dateRange.to ? (
                                <>
                                  {format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d')}
                                </>
                              ) : (
                                format(dateRange.from, 'MMM d')
                              )
                            ) : (
                              <span className="text-muted-foreground">Dates</span>
                            )}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-background border border-border z-[200]" align="start">
                        <Calendar
                          mode="range"
                          selected={dateRange}
                          onSelect={(range) => setDateRange(range)}
                          numberOfMonths={1}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>

                    {/* Guests - Inline on desktop, popover on mobile */}
                    <div className="hidden md:flex items-center gap-2 border border-border rounded-md px-3 py-1.5 bg-background">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                      >
                        -
                      </Button>
                      <div className="flex items-center gap-2 min-w-[70px] justify-center">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{guests}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => setGuests(guests + 1)}
                      >
                        +
                      </Button>
                    </div>

                    {/* Guests - Mobile popover */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="md:hidden bg-background" size="icon">
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3 bg-background border border-border z-[200]" align="start">
                        <div className="flex items-center gap-3">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                          >
                            -
                          </Button>
                          <div className="flex items-center gap-2 min-w-[80px] justify-center">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{guests} Guest{guests > 1 ? 's' : ''}</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setGuests(guests + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>

                    {/* Filters Toggle - Icon only on mobile */}
                    <Button 
                      variant={filtersOpen ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFiltersOpen(!filtersOpen)}
                      className="md:px-3"
                    >
                      <SlidersHorizontal className="h-4 w-4 md:mr-1" />
                      <span className="hidden md:inline">Filters</span>
                    </Button>
                  </div>

                  {/* Extended Filters */}
                  {filtersOpen && (
                    <div className="mt-4 pt-4 border-t border-border space-y-4 animate-fade-in">
                      {/* Price Range */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Price Range (GBP)</span>
                          <span className="text-sm text-muted-foreground">
                            £{priceRange[0]} - £{priceRange[1]}
                          </span>
                        </div>
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          min={0}
                          max={10000}
                          step={100}
                          className="w-full"
                        />
                      </div>

                      {/* Bedrooms & Bathrooms */}
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <span className="text-sm font-medium mb-2 block">Bedrooms</span>
                          <div className="flex flex-wrap gap-2">
                            {['any', '0', '1', '2', '3', '4+'].map((opt) => (
                              <Button
                                key={opt}
                                variant={bedrooms === opt ? "default" : "outline"}
                                size="sm"
                                onClick={() => setBedrooms(opt)}
                                className="min-w-[40px] h-8"
                              >
                                {opt === 'any' ? 'Any' : opt}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium mb-2 block">Bathrooms</span>
                          <div className="flex flex-wrap gap-2">
                            {['any', '1', '2', '3', '4+'].map((opt) => (
                              <Button
                                key={opt}
                                variant={bathrooms === opt ? "default" : "outline"}
                                size="sm"
                                onClick={() => setBathrooms(opt)}
                                className="min-w-[40px] h-8"
                              >
                                {opt === 'any' ? 'Any' : opt}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div>
                        <span className="text-sm font-medium mb-2 block">Amenities</span>
                        <div className="flex flex-wrap gap-3">
                          {['Elevator', 'Balcony', 'Dishwasher', 'Parking', 'Gym', 'Pool'].map((amenity) => (
                            <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox 
                                checked={amenities.includes(amenity)}
                                onCheckedChange={() => toggleAmenity(amenity)}
                              />
                              <span className="text-sm">{amenity}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Reset */}
                      <Button variant="outline" onClick={resetFilters} size="sm" className="w-full">
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={cn(
              "px-4 py-6 flex-1",
              mapOpen ? "" : "max-w-[1920px] mx-auto"
            )}>
              {/* Description - hidden on mobile */}
              <p className="text-muted-foreground text-sm mb-4 hidden md:block">
                {location === 'paris'
                  ? "Furnished, flexible apartments available for short- to medium-term rent by The Flex in Paris. From Champs-Élysées to the Louvre, our serviced apartments span iconic Parisian neighbourhoods. Book nightly, weekly, or monthly stays and enjoy expertly designed spaces, high-speed Wi-Fi, fully equipped kitchens and 24/7 local support—your perfect Paris rental is ready whenever you are."
                  : location === 'algiers'
                  ? "Furnished, flexible apartments available for short- to medium-term rent by The Flex in Algiers. From Hydra to the city center, our serviced apartments offer the best of Algerian hospitality. Book nightly, weekly, or monthly stays and enjoy expertly designed spaces, high-speed Wi-Fi, fully equipped kitchens and 24/7 local support—your perfect Algiers rental is ready whenever you are."
                  : "Furnished, flexible apartments available for short- to medium-term rent by The Flex. From Covent Garden lofts to Canary Wharf executive suites, our serviced apartments span every neighbourhood in London. Book nightly, weekly, or monthly stays and enjoy expertly designed spaces, high-speed Wi-Fi, fully equipped kitchens and 24/7 local support—your perfect London rental is ready whenever you are."
                }
              </p>

              {/* Results Count */}
              <div className="mb-6">
                <p className="font-medium">{properties.length} {properties.length === 1 ? 'property' : 'properties'} found</p>
                <p className="text-sm text-muted-foreground hidden md:block">
                  {properties.length === 0
                    ? "Try adjusting your filters to see more results"
                    : "Showing properties that match your filters"}
                </p>
              </div>

              {/* Properties Grid */}
              <div className={cn(
                "grid gap-6",
                mapOpen ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              )}>
                {properties.map((property) => (
                  <Link 
                    key={property.id} 
                    to={`/property/${property.id}`}
                    className="group"
                  >
                    <div className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img 
                          src={property.imageUrl} 
                          alt={property.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-md">
                          <span className="font-semibold text-primary">£{property.price}</span>
                          <span className="text-xs text-muted-foreground"> per night</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {property.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{property.city}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            {property.bedrooms}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            {property.bathrooms}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {property.maxGuests}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-3">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="font-medium">{property.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground text-sm">({property.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                {properties.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                    <MapPin className="h-16 w-16 text-muted-foreground/40 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No properties found</h3>
                    <p className="text-muted-foreground max-w-md">
                      Try adjusting your filters or search criteria to find available properties.
                    </p>
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      className="mt-4"
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map Panel */}
          <div className={cn(
            "bg-muted transition-all duration-300 relative",
            mobileView === 'list' ? "hidden md:block" : "block w-full md:w-auto",
            mapOpen ? "md:w-1/2 sticky top-[72px] h-[calc(100vh-72px)]" : "md:w-0 md:overflow-hidden"
          )}>
            {/* Close Map Toggle Button - only show when map is open */}
            {mapOpen && (
              <button
                onClick={() => setMapOpen(false)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}

            {mapOpen && (
              <PropertyMap
                properties={mapProperties}
                selectedCity={location}
                onPropertyClick={(propertyId) => {
                  // Navigate to property page
                  window.location.href = `/property/${propertyId}`;
                }}
              />
            )}
          </div>

          {/* Open Map Toggle Button - only show when map is closed on desktop */}
          {!mapOpen && (
            <button
              onClick={() => setMapOpen(true)}
              className="hidden md:block fixed right-0 top-1/2 -translate-y-1/2 z-10 bg-primary text-primary-foreground p-2 rounded-l-full shadow-lg hover:scale-110 transition-transform"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Footer - always outside scrollable area */}
        <PublicFooter />
      </main>
    </div>
  );
}
