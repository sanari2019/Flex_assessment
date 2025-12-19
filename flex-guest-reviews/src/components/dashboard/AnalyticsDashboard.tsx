import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { TrendingUp, TrendingDown, MapPin, Users, Star, Calendar, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Review } from '@/lib/api';
import { format, parseISO, startOfMonth, subMonths, differenceInDays } from 'date-fns';
import { isListingInLocation } from '@/lib/locationUtils';

interface AnalyticsDashboardProps {
  reviews: Review[];
}

const LOCATIONS = ['London', 'Paris', 'Algiers'];
const LOCATION_COLORS: Record<string, string> = {
  London: 'hsl(var(--primary))',
  Paris: 'hsl(var(--chart-2))',
  Algiers: 'hsl(var(--chart-3))',
};

const CHANNEL_COLORS: Record<string, string> = {
  Airbnb: '#FF5A5F',
  'Booking.com': '#003580',
  Direct: '#10B981',
  Google: '#4285F4',
};

export function AnalyticsDashboard({ reviews }: AnalyticsDashboardProps) {
  // Parse ratings from strings
  const parseRating = (rating: string | number): number => {
    return typeof rating === 'string' ? parseFloat(rating) : rating;
  };

  // Generate monthly data by location (REAL DATA)
  const monthlyLocationData = useMemo(() => {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i));
      const monthEnd = startOfMonth(subMonths(now, i - 1));
      const monthLabel = format(monthStart, 'MMM yyyy');

      const monthData: Record<string, any> = { month: monthLabel };

      LOCATIONS.forEach(location => {
        const locationReviews = reviews.filter(r => {
          const reviewDate = parseISO(r.submitted_at);
          const isInMonth = reviewDate >= monthStart && reviewDate < monthEnd;
          const locationMatch = isListingInLocation(r.listing_name, location as 'London' | 'Paris' | 'Algiers');
          return isInMonth && locationMatch;
        });

        monthData[`${location}_reviews`] = locationReviews.length;
        monthData[`${location}_rating`] = locationReviews.length > 0
          ? (locationReviews.reduce((acc, r) => acc + parseRating(r.rating), 0) / locationReviews.length).toFixed(1)
          : null;
      });

      months.push(monthData);
    }

    return months;
  }, [reviews]);

  // Location performance summary (REAL DATA)
  const locationSummary = useMemo(() => {
    const prevMonthStart = startOfMonth(subMonths(new Date(), 1));
    const currentMonthStart = startOfMonth(new Date());

    return LOCATIONS.map(location => {
      const locationReviews = reviews.filter(r =>
        isListingInLocation(r.listing_name, location as 'London' | 'Paris' | 'Algiers')
      );

      const currentMonthReviews = locationReviews.filter(r =>
        parseISO(r.submitted_at) >= currentMonthStart
      );

      const prevMonthReviews = locationReviews.filter(r => {
        const date = parseISO(r.submitted_at);
        return date >= prevMonthStart && date < currentMonthStart;
      });

      const avgRating = locationReviews.length > 0
        ? locationReviews.reduce((acc, r) => acc + parseRating(r.rating), 0) / locationReviews.length
        : 0;

      const change = prevMonthReviews.length > 0
        ? ((currentMonthReviews.length - prevMonthReviews.length) / prevMonthReviews.length * 100)
        : 0;

      return {
        name: location,
        reviews: locationReviews.length,
        avgRating: parseFloat(avgRating.toFixed(1)),
        trend: change >= 0 ? 'up' : 'down',
        change: Math.abs(change).toFixed(1),
      };
    });
  }, [reviews]);

  // Channel distribution by location (REAL DATA)
  const channelByLocation = useMemo(() => {
    return LOCATIONS.map(location => {
      const locationReviews = reviews.filter(r =>
        isListingInLocation(r.listing_name, location as 'London' | 'Paris' | 'Algiers')
      );

      const channelCounts = locationReviews.reduce((acc, r) => {
        acc[r.channel] = (acc[r.channel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        name: location,
        Airbnb: channelCounts['Airbnb'] || 0,
        'Booking.com': channelCounts['Booking.com'] || 0,
        Direct: channelCounts['Direct'] || 0,
        Google: channelCounts['Google'] || 0,
      };
    });
  }, [reviews]);

  // Rating trends over time (REAL DATA)
  const ratingTrends = useMemo(() => {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i));
      const monthEnd = startOfMonth(subMonths(now, i - 1));
      const monthLabel = format(monthStart, 'MMM');

      const monthData: Record<string, any> = { month: monthLabel };

      LOCATIONS.forEach(location => {
        const locationReviews = reviews.filter(r => {
          const reviewDate = parseISO(r.submitted_at);
          const isInMonth = reviewDate >= monthStart && reviewDate < monthEnd;
          const locationMatch = isListingInLocation(r.listing_name, location as 'London' | 'Paris' | 'Algiers');
          return isInMonth && locationMatch;
        });

        monthData[location] = locationReviews.length > 0
          ? (locationReviews.reduce((acc, r) => acc + parseRating(r.rating), 0) / locationReviews.length).toFixed(1)
          : null;
      });

      months.push(monthData);
    }

    return months;
  }, [reviews]);

  // Review volume distribution (REAL DATA)
  const volumeDistribution = useMemo(() => {
    const totalReviews = reviews.length;

    return LOCATIONS.map(location => {
      const locationReviews = reviews.filter(r =>
        isListingInLocation(r.listing_name, location as 'London' | 'Paris' | 'Algiers')
      );

      const percentage = totalReviews > 0
        ? Math.round((locationReviews.length / totalReviews) * 100)
        : 0;

      return {
        name: location,
        value: percentage,
        count: locationReviews.length,
        fill: LOCATION_COLORS[location],
      };
    });
  }, [reviews]);

  // Category performance radar chart (REAL DATA)
  const categoryPerformance = useMemo(() => {
    const categories = ['cleanliness', 'communication', 'location', 'value', 'respect_house_rules'];

    return categories.map(category => {
      const categoryData: Record<string, any> = {
        category: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
      };

      LOCATIONS.forEach(location => {
        const locationReviews = reviews.filter(r =>
          isListingInLocation(r.listing_name, location as 'London' | 'Paris' | 'Algiers')
        );

        const ratingsWithCategory = locationReviews.filter(r =>
          r.categories && typeof r.categories === 'object' && category in r.categories
        );

        if (ratingsWithCategory.length > 0) {
          const avg = ratingsWithCategory.reduce((acc, r) => {
            const catRating = (r.categories as any)[category];
            return acc + (typeof catRating === 'number' ? catRating : 0);
          }, 0) / ratingsWithCategory.length;
          categoryData[location] = parseFloat(avg.toFixed(1));
        } else {
          categoryData[location] = 0;
        }
      });

      return categoryData;
    });
  }, [reviews]);

  // Approval rate insights (REAL DATA)
  const approvalInsights = useMemo(() => {
    return LOCATIONS.map(location => {
      const locationReviews = reviews.filter(r =>
        isListingInLocation(r.listing_name, location as 'London' | 'Paris' | 'Algiers')
      );

      const approved = locationReviews.filter(r => r.approved_for_website).length;
      const total = locationReviews.length;
      const rate = total > 0 ? Math.round((approved / total) * 100) : 0;

      return {
        name: location,
        approvalRate: rate,
        approved,
        total,
      };
    });
  }, [reviews]);

  // Response time analysis (REAL DATA - based on review frequency)
  const responseTimeData = useMemo(() => {
    const reviewsByProperty = reviews.reduce((acc, review) => {
      if (!acc[review.listing_id]) {
        acc[review.listing_id] = [];
      }
      acc[review.listing_id].push(review);
      return acc;
    }, {} as Record<string, Review[]>);

    const avgDaysBetweenReviews = Object.values(reviewsByProperty).map(propReviews => {
      if (propReviews.length < 2) return null;

      const sorted = propReviews
        .map(r => parseISO(r.submitted_at))
        .sort((a, b) => a.getTime() - b.getTime());

      let totalDays = 0;
      for (let i = 1; i < sorted.length; i++) {
        totalDays += differenceInDays(sorted[i], sorted[i - 1]);
      }

      return totalDays / (sorted.length - 1);
    }).filter(v => v !== null);

    const avgDays = avgDaysBetweenReviews.length > 0
      ? avgDaysBetweenReviews.reduce((a, b) => a + (b || 0), 0) / avgDaysBetweenReviews.length
      : 0;

    return {
      avgDaysBetween: Math.round(avgDays),
      activeProperties: Object.keys(reviewsByProperty).length,
      reviewsPerProperty: (reviews.length / Object.keys(reviewsByProperty).length).toFixed(1),
    };
  }, [reviews]);

  // Sentiment distribution (based on ratings - REAL DATA)
  const sentimentData = useMemo(() => {
    const excellent = reviews.filter(r => parseRating(r.rating) >= 4.5).length;
    const good = reviews.filter(r => parseRating(r.rating) >= 3.5 && parseRating(r.rating) < 4.5).length;
    const average = reviews.filter(r => parseRating(r.rating) >= 2.5 && parseRating(r.rating) < 3.5).length;
    const poor = reviews.filter(r => parseRating(r.rating) < 2.5).length;

    return [
      { name: 'Excellent (4.5-5.0)', value: excellent, fill: '#10B981' },
      { name: 'Good (3.5-4.4)', value: good, fill: '#3B82F6' },
      { name: 'Average (2.5-3.4)', value: average, fill: '#F59E0B' },
      { name: 'Poor (<2.5)', value: poor, fill: '#EF4444' },
    ].filter(item => item.value > 0);
  }, [reviews]);

  // Channel performance comparison (REAL DATA)
  const channelPerformance = useMemo(() => {
    const channels = Array.from(new Set(reviews.map(r => r.channel)));

    return channels.map(channel => {
      const channelReviews = reviews.filter(r => r.channel === channel);
      const avgRating = channelReviews.length > 0
        ? channelReviews.reduce((acc, r) => acc + parseRating(r.rating), 0) / channelReviews.length
        : 0;

      return {
        channel,
        count: channelReviews.length,
        avgRating: parseFloat(avgRating.toFixed(2)),
        approvalRate: Math.round(
          (channelReviews.filter(r => r.approved_for_website).length / channelReviews.length) * 100
        ),
      };
    }).sort((a, b) => b.count - a.count);
  }, [reviews]);

  return (
    <div className="space-y-6">
      {/* Key Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Avg Review Frequency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{responseTimeData.avgDaysBetween}</p>
            <p className="text-xs text-muted-foreground">days between reviews</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Reviews per Property
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{responseTimeData.reviewsPerProperty}</p>
            <p className="text-xs text-muted-foreground">average reviews</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Best Approval Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {Math.max(...approvalInsights.map(a => a.approvalRate))}%
            </p>
            <p className="text-xs text-muted-foreground">
              {approvalInsights.find(a => a.approvalRate === Math.max(...approvalInsights.map(x => x.approvalRate)))?.name}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Top Performing Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {locationSummary.reduce((max, loc) => loc.avgRating > max.avgRating ? loc : max).name}
            </p>
            <p className="text-xs text-muted-foreground">
              {locationSummary.reduce((max, loc) => loc.avgRating > max.avgRating ? loc : max).avgRating} avg rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Location Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {locationSummary.map((loc) => (
          <Card key={loc.name} className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {loc.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{loc.reviews}</p>
                  <p className="text-xs text-muted-foreground">Total Reviews</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-lg font-semibold text-foreground">{loc.avgRating}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${loc.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                    {loc.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {loc.change}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reviews by Location Over Time */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Reviews by Location (Monthly)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyLocationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                {LOCATIONS.map((location) => (
                  <Line
                    key={location}
                    type="monotone"
                    dataKey={`${location}_reviews`}
                    name={location}
                    stroke={LOCATION_COLORS[location]}
                    strokeWidth={2}
                    dot={{ fill: LOCATION_COLORS[location], r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Average Rating Trends */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Rating Trends by Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={ratingTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                {LOCATIONS.map((location) => (
                  <Area
                    key={location}
                    type="monotone"
                    dataKey={location}
                    stroke={LOCATION_COLORS[location]}
                    fill={LOCATION_COLORS[location]}
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Channel Distribution by Location */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Channel Distribution by Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelByLocation}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="Airbnb" fill={CHANNEL_COLORS.Airbnb} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Booking.com" fill={CHANNEL_COLORS['Booking.com']} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Direct" fill={CHANNEL_COLORS.Direct} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Google" fill={CHANNEL_COLORS.Google} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Review Volume Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Review Volume Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={volumeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value, count }) => `${name}: ${value}% (${count})`}
                >
                  {volumeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Performance Radar */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Category Performance by Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={categoryPerformance}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                />
                <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                {LOCATIONS.map((location) => (
                  <Radar
                    key={location}
                    name={location}
                    dataKey={location}
                    stroke={LOCATION_COLORS[location]}
                    fill={LOCATION_COLORS[location]}
                    fillOpacity={0.2}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sentiment Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Review Sentiment Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Channel Performance Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Channel Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Channel</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Total Reviews</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Avg Rating</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Approval Rate</th>
                </tr>
              </thead>
              <tbody>
                {channelPerformance.map((channel, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CHANNEL_COLORS[channel.channel] || '#6B7280' }}
                      />
                      <span className="font-medium text-foreground">{channel.channel}</span>
                    </td>
                    <td className="text-right py-3 px-4 text-foreground">{channel.count}</td>
                    <td className="text-right py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium text-foreground">{channel.avgRating}</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4">
                      <span className={`font-medium ${
                        channel.approvalRate >= 70 ? 'text-green-600' :
                        channel.approvalRate >= 50 ? 'text-yellow-600' : 'text-red-500'
                      }`}>
                        {channel.approvalRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Approval Rate by Location */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Approval Rates by Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {approvalInsights.map((location) => (
              <div key={location.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{location.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {location.approved} / {location.total} approved
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      location.approvalRate >= 70 ? 'bg-green-600' :
                      location.approvalRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${location.approvalRate}%` }}
                  />
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {location.approvalRate}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
