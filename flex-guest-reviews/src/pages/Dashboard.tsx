import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { DashboardSidebar, SidebarToggle } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardFilters, type FilterState } from '@/components/dashboard/DashboardFilters';
import { KPICard } from '@/components/reviews/KPICard';
import { PropertyCard } from '@/components/dashboard/PropertyCard';
import { ReviewList } from '@/components/reviews/ReviewList';
import { ReviewsChart } from '@/components/dashboard/ReviewsChart';
import { RatingDistributionChart } from '@/components/dashboard/RatingDistributionChart';
import { PerformanceScoreChart } from '@/components/dashboard/PerformanceScoreChart';
import { CategoryRatingsChart } from '@/components/dashboard/CategoryRatingsChart';
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Star,
  MessageSquare,
  CheckCircle2,
  TrendingUp,
  Home,
  List,
  BarChart3,
} from 'lucide-react';
import { format, isWithinInterval, parseISO, subDays } from 'date-fns';
import { useReviews, useUpdateReviewApproval } from '@/hooks/useReviews';
import type { Review } from '@/lib/api';
import { detectLocationFromName } from '@/lib/locationUtils';
import { getPropertyImage } from '@/lib/propertyImages';

const initialFilters: FilterState = {
  search: '',
  channel: 'all',
  type: 'all',
  ratingMin: 0,
  approvedOnly: false,
  listingId: 'all',
  dateRange: undefined,
};

const locationFilters = ['london', 'paris', 'algiers'];

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Fetch reviews from API with filters
  const apiParams = useMemo(() => {
    const isLocationFilter = locationFilters.includes(filters.listingId);
    const dateStart = filters.dateRange?.from ? format(filters.dateRange.from, 'yyyy-MM-dd') : undefined;
    const dateEnd = filters.dateRange?.to ? format(filters.dateRange.to, 'yyyy-MM-dd') : undefined;

    return {
      listingId: !isLocationFilter && filters.listingId !== 'all' ? filters.listingId : undefined,
      channel: filters.channel !== 'all' ? filters.channel : undefined,
      type: filters.type !== 'all' ? filters.type : undefined,
      ratingMin: filters.ratingMin > 0 ? filters.ratingMin : undefined,
      approvedOnly: filters.approvedOnly || undefined,
      dateStart,
      dateEnd,
    };
  }, [filters]);

  const { data: reviewsData, isLoading, error } = useReviews(apiParams);
  const updateApproval = useUpdateReviewApproval();

  // Get tab from URL or default to overview
  const activeTab = searchParams.get('tab') || 'overview';

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const reviews = reviewsData?.data || [];

  // Client-side filtering for search (API handles other filters)
  const filteredReviews = useMemo(() => {
    let result = reviews;

    if (filters.listingId !== 'all') {
      if (locationFilters.includes(filters.listingId)) {
        result = result.filter(review => {
          const city = detectLocationFromName(review.listing_name);
          return city?.toLowerCase() === filters.listingId;
        });
      } else {
        result = result.filter(review => review.listing_id === filters.listingId);
      }
    }

    if (!filters.search) return result;

    const search = filters.search.toLowerCase();
    return result.filter(review => {
      const matchesSearch =
        review.guest_name?.toLowerCase().includes(search) ||
        review.listing_name?.toLowerCase().includes(search) ||
        review.comment?.toLowerCase().includes(search);
      return matchesSearch;
    });
  }, [reviews, filters]);

  // KPIs
  const avgRating = reviewsData?.meta?.averageRating || 0;
  const approvedCount = filteredReviews.filter(r => r.approved_for_website).length;
  const approvalRate = filteredReviews.length > 0
    ? Math.round((approvedCount / filteredReviews.length) * 100)
    : 0;

  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);
  const recentReviews = reviews.filter(r =>
    isWithinInterval(parseISO(r.submitted_at), { start: thirtyDaysAgo, end: now })
  );

  // Handle approval toggle using API
  const handleApprovalChange = (id: number, approved: boolean) => {
    updateApproval.mutate({ id, approved });
  };

  // Sort reviews by date (newest first)
  const sortedReviews = [...filteredReviews].sort(
    (a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
  );

  // Extract unique listings from reviews
  const listings = useMemo(() => {
    const listingMap = new Map<string, { id: string; name: string; imageUrl: string; city: string }>();

    reviews.forEach(review => {
      if (!listingMap.has(review.listing_id)) {
        // Detect city from listing name
        const city = detectLocationFromName(review.listing_name);

        listingMap.set(review.listing_id, {
          id: review.listing_id,
          name: review.listing_name,
          imageUrl: getPropertyImage(review.listing_id),
          city,
        });
      }
    });

    return Array.from(listingMap.values());
  }, [reviews]);

  // Loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive">Failed to load reviews</p>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Sidebar - mobile only */}
      <DashboardSidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Header */}
        <DashboardHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} reviews={reviews} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Filters */}
          <DashboardFilters
            filters={filters}
            onFiltersChange={setFilters}
            listings={listings}
            className="mb-8"
          />

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KPICard
              label="Average Rating"
              value={avgRating ? avgRating.toFixed(1) : '—'}
              subValue="out of 5.0"
              icon={Star}
            />
            <KPICard
              label="Total Reviews"
              value={filteredReviews.length}
              subValue={`${reviews.length} total`}
              icon={MessageSquare}
            />
            <KPICard
              label="Approval Rate"
              value={`${approvalRate}%`}
              subValue={`${approvedCount} approved`}
              icon={CheckCircle2}
            />
            <KPICard
              label="Last 30 Days"
              value={recentReviews.length}
              subValue="new reviews"
              icon={TrendingUp}
              trend={{ value: 12, isPositive: true }}
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-center mb-6">
              <TabsList className="bg-secondary">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="properties" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Properties</span>
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">All Reviews</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-8">
              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Review Trends */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Review Trends</h2>
                  <ReviewsChart reviews={filteredReviews} groupBy="week" chartType="bar" />
                </div>

                {/* Rating Distribution */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Rating Distribution</h2>
                  <RatingDistributionChart reviews={filteredReviews} />
                </div>

                {/* Performance Score Trend */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Performance Score Trend</h2>
                  <PerformanceScoreChart reviews={filteredReviews} />
                </div>

                {/* Category Ratings */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Category Performance</h2>
                  <CategoryRatingsChart reviews={filteredReviews} />
                </div>
              </div>

              {/* Recent reviews */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Recent Reviews</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab('reviews')}
                    className="text-primary"
                  >
                    View All
                  </Button>
                </div>
                <ReviewList
                  reviews={sortedReviews.slice(0, 5)}
                  showApprovalToggle
                  onApprovalChange={handleApprovalChange}
                  initialLimit={5}
                />
              </div>
            </TabsContent>

            <TabsContent value="properties">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listings.map((listing) => {
                  // Filter reviews for this specific listing
                  const listingReviews = reviews.filter(r => r.listing_id === listing.id);
                  return (
                    <Link key={listing.id} to={`/property/${listing.id}`}>
                      <PropertyCard
                        listing={listing}
                        reviews={listingReviews}
                      />
                    </Link>
                  );
                })}
                {listings.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-muted-foreground">
                    No properties found with reviews
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewList
                reviews={sortedReviews}
                showApprovalToggle
                onApprovalChange={handleApprovalChange}
                emptyMessage="No reviews match your current filters."
              />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsDashboard reviews={filteredReviews} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
