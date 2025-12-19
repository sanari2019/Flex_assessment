import { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { format, startOfWeek, startOfMonth, parseISO, isWithinInterval, subDays } from 'date-fns';
import type { Review } from '@/lib/api';

interface ReviewsChartProps {
  reviews: Review[];
  groupBy?: 'week' | 'month';
  chartType?: 'line' | 'bar';
}

export function ReviewsChart({ 
  reviews, 
  groupBy = 'week',
  chartType = 'line'
}: ReviewsChartProps) {
  const chartData = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 90);
    
    const recentReviews = reviews.filter(r => {
      const date = parseISO(r.submitted_at);
      return isWithinInterval(date, { start: thirtyDaysAgo, end: now });
    });

    const grouped = recentReviews.reduce((acc, review) => {
      const date = parseISO(review.submitted_at);
      const key = groupBy === 'week' 
        ? format(startOfWeek(date), 'MMM d')
        : format(startOfMonth(date), 'MMM yyyy');
      
      if (!acc[key]) {
        acc[key] = { count: 0, ratings: [] };
      }
      acc[key].count++;
      if (review.rating !== null) {
        // Convert string to number if needed
        const rating = typeof review.rating === 'string' ? parseFloat(review.rating) : review.rating;
        acc[key].ratings.push(rating);
      }
      return acc;
    }, {} as Record<string, { count: number; ratings: number[] }>);

    return Object.entries(grouped)
      .map(([name, data]) => ({
        name,
        reviews: data.count,
        avgRating: data.ratings.length > 0 
          ? Number((data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length).toFixed(2))
          : null,
      }))
      .slice(-8);
  }, [reviews, groupBy]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        No review data available for the selected period
      </div>
    );
  }

  const Chart = chartType === 'bar' ? BarChart : LineChart;
  const DataComponent = chartType === 'bar' ? Bar : Line;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <Chart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="name" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        {chartType === 'bar' ? (
          <Bar 
            dataKey="reviews" 
            fill="hsl(var(--primary))" 
            radius={[4, 4, 0, 0]}
          />
        ) : (
          <Line
            type="monotone"
            dataKey="reviews"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
          />
        )}
      </Chart>
    </ResponsiveContainer>
  );
}
