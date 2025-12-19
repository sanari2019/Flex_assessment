import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useMemo } from 'react';
import { ReviewList } from '@/components/reviews/ReviewList';
import { RatingStars } from '@/components/reviews/RatingStars';
import { Button } from '@/components/ui/button';
import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';
import { SplashScreen } from '@/components/public/SplashScreen';
import { ImageGalleryModal } from '@/components/property/ImageGalleryModal';
import { InquiryModal } from '@/components/property/InquiryModal';
import { useReviews } from '@/hooks/useReviews';
import type { Review } from '@/lib/api';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { 
  Users, 
  Bed, 
  Bath,
  Wifi,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Maximize2,
  Calendar,
  Pencil,
  Plus,
  Minus,
  UsersRound,
  ChevronDown,
  X,
  Clock,
  Shield,
  Home,
  UtensilsCrossed,
  WashingMachine,
  Wind,
  Tv,
  Flame,
  Refrigerator,
  Coffee,
  Microwave,
  ShieldCheck,
  CircleDot,
  MessageCircle,
  CalendarIcon,
} from 'lucide-react';
import {
  getListingById, 
  getApprovedReviews, 
  calculateAverageRating,
  getCategoryAverages,
} from '@/data/mockReviews';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Amenity categories for the modal
const amenityCategories = [
  {
    title: 'Internet & office',
    icon: Wifi,
    items: ['Internet', 'Wireless'],
  },
  {
    title: 'Kitchen & dining',
    icon: UtensilsCrossed,
    items: ['Kitchen', 'Toaster', 'Microwave', 'Oven', 'Electric Kettle', 'Stove', 'Refrigerator', 'Kitchen Utensils', 'Dining Table', 'Freezer', 'Wine Glasses'],
  },
  {
    title: 'Bedroom & laundry',
    icon: WashingMachine,
    items: ['Washing Machine', 'Hangers', 'Iron', 'Dryer'],
  },
  {
    title: 'Climate control',
    icon: Wind,
    items: ['Heating', 'Air Conditioning'],
  },
  {
    title: 'Safety',
    icon: ShieldCheck,
    items: ['Smoke Detector', 'Carbon Monoxide Detector', 'Fire Extinguisher'],
  },
];

// Quick amenities display
const quickAmenities = [
  { icon: Wifi, label: 'Internet' },
  { icon: Wifi, label: 'Wireless' },
  { icon: UtensilsCrossed, label: 'Kitchen' },
  { icon: WashingMachine, label: 'Washing Machine' },
  { icon: Wind, label: 'Hair Dryer' },
  { icon: Flame, label: 'Heating' },
  { icon: ShieldCheck, label: 'Smoke Detector' },
  { icon: ShieldCheck, label: 'Carbon Monoxide Detector' },
  { icon: Home, label: 'Essentials' },
];

// Property images for the gallery (realistic apartment photos)
const propertyImages = [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
  'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
  'https://images.unsplash.com/photo-1560185008-b033106af5c3?w=800&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
  'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80',
  'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80',
  'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80',
  'https://images.unsplash.com/photo-1560185009-5bf9f2849488?w=800&q=80',
  'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
  'https://images.unsplash.com/photo-1560448075-cbc16bb4af8e?w=800&q=80',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
  'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80',
  'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80',
  'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80',
];

export default function PropertyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const listing = getListingById(id || '');

  // Fetch only approved reviews for this property from API
  const { data: reviewsData, isLoading: reviewsLoading } = useReviews({
    listingId: id,
    approvedOnly: true,
  });

  const reviews = reviewsData?.data || [];
  const avgRating = reviewsData?.meta?.averageRating || 0;
  const categoryAvgs = reviewsData?.meta?.categoryAverages || {};

  const [sortBy, setSortBy] = useState('recent');
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSelectDates, setShowSelectDates] = useState(true);
  const [guestCount, setGuestCount] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewQuoteIndex, setReviewQuoteIndex] = useState(0);
  const [isQuoteHovered, setIsQuoteHovered] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date } | undefined>(undefined);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const lastScrollY = useRef(0);

  // Max guests from listing (default to 2 if not available)
  const maxGuests = listing?.maxGuests || 2;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll to show/hide select dates modal on mobile
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 100) {
        setShowSelectDates(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        setShowSelectDates(false);
      } else {
        // Scrolling up
        setShowSelectDates(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-swipe review quote
  useEffect(() => {
    if (isQuoteHovered || reviews.length === 0) return;
    
    const interval = setInterval(() => {
      setReviewQuoteIndex((prev) => (prev + 1) % Math.min(5, reviews.length));
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isQuoteHovered, reviews.length]);


  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Property not found</h1>
          <p className="text-muted-foreground mb-4">
            The property you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    cleanliness: 'Cleanliness',
    communication: 'Communication',
    checkIn: 'Check-in',
    accuracy: 'Accuracy',
    location: 'Location',
    value: 'Value',
  };

  // Sort reviews
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
      }
      if (sortBy === 'highest') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === 'lowest') {
        return (a.rating || 0) - (b.rating || 0);
      }
      return 0;
    });
  }, [reviews, sortBy]);

  const descriptionText = `This apartment is located on Strype Street, a quiet yet convenient spot in the heart of ${listing.city}. It's a spacious unit with all the essentials you'll need, including top-quality amenities. The location is ideal, with easy access to transport and nearby shops and cafes. I've made sure everything is set up for a comfortable stay.`;

  return (
    <div className="min-h-screen bg-background">
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen onClose={() => setShowSplash(false)} />
      )}

      {/* Header */}
      <PublicHeader splashVisible={showSplash} />

      {/* Mobile Back Button */}
      <div className="md:hidden px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      {/* Desktop Image Gallery */}
      <div className={`hidden md:block ${showSplash ? 'pt-[116px]' : 'pt-24'}`}>
        <div className="flex-container py-4">
          <div className="grid grid-cols-4 gap-2 h-[400px] rounded-l-xl overflow-hidden">
            {/* Large image - takes 2 cols and 2 rows */}
            <div 
              className="col-span-2 row-span-2 relative cursor-pointer"
              onClick={() => { setGalleryStartIndex(0); setGalleryOpen(true); }}
            >
              <img
                src={propertyImages[0]}
                alt={listing.name}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
              />
            </div>
            {/* Top right images */}
            <div 
              className="relative cursor-pointer"
              onClick={() => { setGalleryStartIndex(1); setGalleryOpen(true); }}
            >
              <img
                src={propertyImages[1]}
                alt={`${listing.name} - 2`}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
              />
            </div>
            <div 
              className="relative cursor-pointer"
              onClick={() => { setGalleryStartIndex(2); setGalleryOpen(true); }}
            >
              <img
                src={propertyImages[2]}
                alt={`${listing.name} - 3`}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
              />
            </div>
            {/* Bottom right images */}
            <div 
              className="relative cursor-pointer"
              onClick={() => { setGalleryStartIndex(3); setGalleryOpen(true); }}
            >
              <img
                src={propertyImages[3]}
                alt={`${listing.name} - 4`}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
              />
            </div>
            <div 
              className="relative cursor-pointer group"
              onClick={() => { setGalleryStartIndex(4); setGalleryOpen(true); }}
            >
              <img
                src={propertyImages[4]}
                alt={`${listing.name} - 5`}
                className="w-full h-full object-cover"
              />
              {/* View all button - center with dark overlay for visibility */}
              <div className="absolute inset-0 bg-black/30 pointer-events-none" />
              <button 
                onClick={(e) => { e.stopPropagation(); setGalleryStartIndex(0); setGalleryOpen(true); }}
                className="absolute bottom-4 lg:bottom-12 xl:bottom-16 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-md shadow-lg flex items-center gap-1.5 text-xs font-medium hover:bg-gray-50 transition-colors z-10"
              >
                <Maximize2 className="h-3 w-3" />
                View all
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Image Carousel */}
      <div className="md:hidden relative">
        <div className="relative w-full aspect-[4/3]">
          <img
            src={propertyImages[currentImageIndex]}
            alt={listing.name}
            className="w-full h-full object-cover"
            onClick={() => { setGalleryStartIndex(currentImageIndex); setGalleryOpen(true); }}
          />
          
          {/* Image counter */}
          <div className="absolute top-4 right-4 bg-[#5C5C5A]/80 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {propertyImages.length}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>

          {/* View all button */}
          <button 
            onClick={() => { setGalleryStartIndex(currentImageIndex); setGalleryOpen(true); }}
            className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium"
          >
            <Maximize2 className="h-4 w-4" />
            View all
          </button>
        </div>
      </div>

      {/* Fullscreen Image Gallery Modal */}
      <ImageGalleryModal
        images={propertyImages}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        initialIndex={galleryStartIndex}
      />

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        propertyName={listing.name}
      />

      {/* Mobile Select Dates Modal - Bottom positioned */}
      <div 
        className={`md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-40 transition-transform duration-300 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] rounded-t-2xl ${
          showSelectDates ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">Select dates</h3>
          <button className="text-primary">
            <Calendar className="h-6 w-6" />
          </button>
        </div>
        
        <button className="w-full border border-border rounded-lg p-3 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">Select dates</span>
          </div>
          <Pencil className="h-4 w-4 text-muted-foreground" />
        </button>

        <div className="mb-4">
          <p className="text-sm font-medium text-foreground mb-2">Guests</p>
          <div className="border border-border rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UsersRound className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{guestCount} Guest{guestCount > 1 ? 's' : ''}</p>
                <p className="text-xs text-muted-foreground">Up to {listing.maxGuests} guests</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center font-medium">{guestCount}</span>
              <button 
                onClick={() => setGuestCount(Math.min(listing.maxGuests, guestCount + 1))}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <Button size="lg" className="w-full" disabled>
          Check availability
        </Button>
      </div>

      <main className="flex-container py-6 md:py-8">
        {/* Property Title and Stats */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
            {listing.name}
          </h1>
          
          {/* Property specs - Desktop inline, Mobile 2x2 grid */}
          <div className="hidden md:flex items-center gap-6 pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <UsersRound className="h-5 w-5 text-muted-foreground" />
              <div>
                <span className="font-semibold">{listing.maxGuests}</span>
                <span className="text-muted-foreground ml-1">Guests</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-muted-foreground" />
              <div>
                <span className="font-semibold">{listing.bedrooms}</span>
                <span className="text-muted-foreground ml-1">Bedrooms</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-5 w-5 text-muted-foreground" />
              <div>
                <span className="font-semibold">{listing.bathrooms}</span>
                <span className="text-muted-foreground ml-1">Bathrooms</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-muted-foreground" />
              <div>
                <span className="font-semibold">3</span>
                <span className="text-muted-foreground ml-1">beds</span>
              </div>
            </div>
          </div>

          {/* Mobile 2x2 grid */}
          <div className="md:hidden grid grid-cols-2 gap-4 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <UsersRound className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="font-semibold">{listing.maxGuests}</p>
                <p className="text-sm text-muted-foreground">Guests</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Bed className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="font-semibold">{listing.bedrooms}</p>
                <p className="text-sm text-muted-foreground">Bedrooms</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Bath className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="font-semibold">{listing.bathrooms}</p>
                <p className="text-sm text-muted-foreground">Bathrooms</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Home className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="font-semibold">3</p>
                <p className="text-sm text-muted-foreground">beds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* About this property */}
            <section className="bg-card rounded-xl border border-border p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <h2 className="text-xl font-semibold text-foreground mb-4">About this property</h2>
              <p className="text-foreground leading-relaxed">
                {showFullDescription ? descriptionText : `${descriptionText.slice(0, 200)}...`}
              </p>
              <button 
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-primary font-medium mt-2 hover:underline"
              >
                {showFullDescription ? 'Show less' : 'Read more'}
              </button>
            </section>

            {/* Amenities Section */}
            <section className="bg-card rounded-xl border border-border p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Amenities</h2>
              <Dialog open={amenitiesOpen} onOpenChange={setAmenitiesOpen}>
                  <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 bg-white hover:bg-gray-100 hover:text-foreground border-border">
                      View all amenities
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col p-0 [&>button]:hidden">
                    <DialogHeader className="sticky top-0 bg-background z-10 px-6 py-4 border-b border-border">
                      <div className="flex items-center justify-between w-full">
                        <DialogTitle className="text-xl font-semibold">All amenities</DialogTitle>
                        <button 
                          onClick={() => setAmenitiesOpen(false)}
                          className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </DialogHeader>
                    <div className="space-y-6 px-6 py-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                      {amenityCategories.map((category) => (
                        <div key={category.title}>
                          <div className="flex items-center gap-2 mb-3">
                            <category.icon className="h-5 w-5 text-foreground" />
                            <h3 className="font-semibold text-foreground">{category.title}</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {category.items.map((item) => (
                              <div key={item} className="flex items-center gap-2 text-muted-foreground">
                                <CircleDot className="h-2 w-2 text-primary fill-primary" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              {/* Quick Amenities Grid */}
              <div className="grid grid-cols-3 gap-4">
                {quickAmenities.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-muted-foreground">
                    <Icon className="h-5 w-5" />
                    <span className="text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Stay Policies */}
            <section className="bg-card rounded-xl border border-border p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <h2 className="text-xl font-semibold text-foreground mb-6">Stay Policies</h2>
              
              {/* Check-in & Check-out */}
              <div className="bg-[#FFF9E9] rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Check-in & Check-out</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-border">
                    <p className="text-sm text-primary mb-1">Check-in Time</p>
                    <p className="font-semibold text-foreground">3:00 PM</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-border">
                    <p className="text-sm text-primary mb-1">Check-out Time</p>
                    <p className="font-semibold text-foreground">10:00 AM</p>
                  </div>
                </div>
              </div>

              {/* House Rules */}
              <div className="bg-[#FFF9E9] rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">House Rules</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-foreground">
                    <div className="w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center">
                      <X className="h-3 w-3" />
                    </div>
                    <span>No smoking</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <div className="w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center">
                      <X className="h-3 w-3" />
                    </div>
                    <span>No pets</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <div className="w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center">
                      <X className="h-3 w-3" />
                    </div>
                    <span>No parties or events</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <div className="w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center">
                      <Shield className="h-3 w-3" />
                    </div>
                    <span>Security deposit required</span>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-[#FFF9E9] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Cancellation Policy</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-border">
                    <p className="font-semibold text-foreground mb-2">For stays less than 28 days</p>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2 text-sm text-primary">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        Full refund up to 14 days before check-in
                      </li>
                      <li className="flex items-center gap-2 text-sm text-primary">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        No refund for bookings less than 14 days before check-in
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-border">
                    <p className="font-semibold text-foreground mb-2">For stays of 28 days or more</p>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2 text-sm text-primary">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        Full refund up to 30 days before check-in
                      </li>
                      <li className="flex items-center gap-2 text-sm text-primary">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        No refund for bookings less than 30 days before check-in
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Guest Reviews Section */}
            <section className="bg-card rounded-xl border border-border p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <h2 className="text-xl font-semibold text-foreground mb-6">Guest Reviews</h2>

              {/* Reviews Summary Card */}
              {reviews.length > 0 && (
                <div className="bg-[#FFF9E9] rounded-xl p-6 mb-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Left side - Rating */}
                    <div className="md:w-2/5 flex flex-col items-center justify-center text-center">
                      <span className="text-5xl font-bold text-primary leading-none">
                        {avgRating?.toFixed(1) || '—'}
                      </span>
                      <span className="text-muted-foreground mt-1">out of 5</span>
                      <div className="flex gap-1 mt-3">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-5 w-5 ${
                              avgRating && i < Math.floor(avgRating) 
                                ? 'fill-primary text-primary' 
                                : 'text-muted-foreground/30'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground mt-2">
                        Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Right side - Category breakdown */}
                    <div className="md:w-3/5 space-y-3">
                      {Object.entries(categoryAvgs).map(([key, value]) => (
                        value !== null && (
                          <div key={key} className="flex items-center gap-3">
                            <span className="text-sm font-medium text-foreground w-24">
                              {categoryLabels[key]}
                            </span>
                            <div className="flex-1 progress-bar-bg">
                              <div 
                                className="progress-bar-fill" 
                                style={{ width: `${(value / 5) * 100}%` }} 
                              />
                            </div>
                            <span className="text-sm font-semibold text-primary w-8 text-right">
                              {value.toFixed(1)}
                            </span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Filter/Sort Bar */}
              <div className="flex items-center justify-between py-3 border-b border-border mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Showing {Math.min(2, sortedReviews.length - reviewIndex)} of {sortedReviews.length} review{sortedReviews.length !== 1 ? 's' : ''}
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setReviewIndex(Math.max(0, reviewIndex - 2))}
                      disabled={reviewIndex === 0}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setReviewIndex(Math.min(sortedReviews.length - 2, reviewIndex + 2))}
                      disabled={reviewIndex >= sortedReviews.length - 2}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <Select value={sortBy} onValueChange={(val) => { setSortBy(val); setReviewIndex(0); }}>
                  <SelectTrigger className="w-40 h-9">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="highest">Highest Rated</SelectItem>
                    <SelectItem value="lowest">Lowest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reviews List as Swipeable Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {sortedReviews.length > 0 ? (
                  sortedReviews.slice(reviewIndex, reviewIndex + 2).map((review) => (
                    <div
                      key={review.id}
                      className="bg-white rounded-xl border border-border p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.1)] transition-shadow"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {review.guest_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{review.guest_name}</p>
                          <div className="flex items-center gap-2">
                            <RatingStars rating={review.rating || 0} maxRating={5} size="sm" />
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.submitted_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-foreground text-sm leading-relaxed line-clamp-4">
                        {review.comment || 'No review text provided.'}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 text-muted-foreground">
                    No reviews published yet. Be the first to share your experience!
                  </div>
                )}
              </div>

              {sortedReviews.length > 2 && (
                <div className="flex justify-center gap-1 mt-4">
                  {Array.from({ length: Math.ceil(sortedReviews.length / 2) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setReviewIndex(i * 2)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        Math.floor(reviewIndex / 2) === i ? 'bg-primary' : 'bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Location Section */}
            <section className="bg-card rounded-xl border border-border overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <div className="p-6 pb-0">
                <h2 className="text-xl font-semibold text-foreground mb-4">Location</h2>
              </div>
              <div className="w-full h-[300px] bg-muted relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158858.47340002653!2d-0.24168120642536509!3d51.52855824155143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C%20UK!5e0!3m2!1sen!2s!4v1703091234567!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Property Location"
                />
              </div>
            </section>

            {/* Browse More Section - Desktop */}
            <section className="hidden lg:block text-center py-6">
              <p className="text-lg text-foreground">
                Browse more{' '}
                <Link to="/properties" className="text-primary hover:underline font-medium">
                  short stay apartments in London
                </Link>
              </p>
            </section>
          </div>

          {/* Right Column - Booking Card (Desktop) */}
          <div className="lg:col-span-2 hidden lg:block">
            <div className="sticky top-28 space-y-4">
              {/* Booking Card */}
              <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
                {/* Header */}
                <div className="bg-primary text-primary-foreground p-5">
                  <h3 className="text-lg font-semibold">Book Your Stay</h3>
                  <p className="text-sm opacity-90">Select dates to see prices</p>
                </div>
                
                <div className="p-5">
                  {/* Date and Guest selector row */}
                  <div className="flex gap-2 mb-4">
                    {/* Date Range Picker */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="flex-1 border border-border rounded-lg p-3 flex items-center gap-2 hover:border-primary transition-colors text-left">
                          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                          {dateRange ? (
                            dateRange.to ? (
                              <span className="text-sm text-foreground">
                                {format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d')}
                              </span>
                            ) : (
                              <span className="text-sm text-foreground">
                                {format(dateRange.from, 'MMM d, yyyy')}
                              </span>
                            )
                          ) : (
                            <span className="text-muted-foreground text-sm">Select dates</span>
                          )}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-background border border-border z-[200]" align="start">
                        <CalendarComponent
                          mode="range"
                          selected={dateRange}
                          onSelect={(range) => setDateRange(range)}
                          numberOfMonths={2}
                          className="pointer-events-auto"
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>

                    {/* Guest Selector Dropdown */}
                    <Select value={guestCount.toString()} onValueChange={(val) => setGuestCount(parseInt(val))}>
                      <SelectTrigger className="w-auto border border-border rounded-lg p-3 h-auto gap-2">
                        <UsersRound className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">{guestCount}</span>
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border z-[200]">
                        {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} Guest{num > 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Check availability button */}
                  <Button size="lg" className="w-full mb-3 gap-2" disabled={!dateRange?.from || !dateRange?.to}>
                    <Calendar className="h-5 w-5" />
                    Check availability
                  </Button>

                  {/* Send Inquiry button */}
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full gap-2" 
                    onClick={() => setInquiryOpen(true)}
                  >
                    <MessageCircle className="h-5 w-5" />
                    Send Inquiry
                  </Button>

                  {/* Instant booking confirmation */}
                  <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                    <CircleDot className="h-3 w-3" />
                    <span>Instant booking confirmation</span>
                  </div>
                </div>
              </div>

              {/* Auto-swiping Review Quote - Sticky with booking card */}
              {sortedReviews.length > 0 && (
                <div
                  className="bg-[#FFF9E9] rounded-xl p-5 border border-border overflow-hidden"
                  onMouseEnter={() => setIsQuoteHovered(true)}
                  onMouseLeave={() => setIsQuoteHovered(false)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                      {sortedReviews[reviewQuoteIndex]?.guest_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm italic text-foreground line-clamp-3 mb-2">
                        "{sortedReviews[reviewQuoteIndex]?.comment?.slice(0, 120) || 'Great stay!'}..."
                      </p>
                      <p className="text-xs text-muted-foreground">
                        — {sortedReviews[reviewQuoteIndex]?.guest_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center gap-1 mt-3">
                    {sortedReviews.slice(0, Math.min(5, sortedReviews.length)).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setReviewQuoteIndex(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          reviewQuoteIndex === i ? 'bg-primary' : 'bg-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Browse More Section - Mobile */}
        <section className="lg:hidden text-center py-6">
          <p className="text-lg text-foreground">
            Browse more{' '}
            <Link to="/properties" className="text-primary hover:underline font-medium">
              short stay apartments in London
            </Link>
          </p>
        </section>

        {/* Mobile Book your stay card - after Browse More */}
        <div className="lg:hidden bg-card rounded-xl border border-border overflow-hidden shadow-card mb-8">
          <div className="bg-primary text-primary-foreground p-5">
            <h3 className="text-lg font-semibold">Book Your Stay</h3>
            <p className="text-sm opacity-90">Select dates to see prices</p>
          </div>
          
          <div className="p-5">
            <div className="flex gap-2 mb-4">
              <button className="flex-1 border border-border rounded-lg p-3 flex items-center gap-2 hover:border-primary transition-colors text-left">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Select dates</span>
              </button>
              <button className="border border-border rounded-lg p-3 flex items-center gap-2 hover:border-primary transition-colors">
                <UsersRound className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{guestCount}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <Button size="lg" className="w-full mb-3 gap-2" disabled>
              <Calendar className="h-5 w-5" />
              Check availability
            </Button>

            <Button 
              variant="outline" 
              size="lg" 
              className="w-full gap-2" 
              onClick={() => setInquiryOpen(true)}
            >
              <MessageCircle className="h-5 w-5" />
              Send Inquiry
            </Button>

            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
              <CircleDot className="h-3 w-3" />
              <span>Instant booking confirmation</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
