import { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from 'recharts';
import type { Review } from '@/lib/api';
import { format, parseISO, startOfWeek, subWeeks, isWithinInterval } from 'date-fns';

interface PerformanceScoreChartProps {
  reviews: Review[];
}

export function PerformanceScoreChart({ reviews }: PerformanceScoreChartProps) {
  const parseRating = (rating: string | number): number => {
    return typeof rating === 'string' ? parseFloat(rating) : rating;
  };

  const chartData = useMemo(() => {
    const weeks = [];
    const now = new Date();

    // Generate last 8 weeks of data
    for (let i = 7; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 }); // Monday
      const weekEnd = startOfWeek(subWeeks(now, i - 1), { weekStartsOn: 1 });
      const weekLabel = format(weekStart, 'MMM dd');

      const weekReviews = reviews.filter(r => {
        const reviewDate = parseISO(r.submitted_at);
        return isWithinInterval(reviewDate, { start: weekStart, end: weekEnd });
      });

      // Calculate metrics
      const totalReviews = weekReviews.length;
      const avgRating = totalReviews > 0
        ? weekReviews.reduce((sum, r) => sum + parseRating(r.rating), 0) / totalReviews
        : 0;

      const approvedCount = weekReviews.filter(r => r.approved_for_website).length;
      const approvalRate = totalReviews > 0 ? (approvedCount / totalReviews) * 100 : 0;

      // Calculate category average
      let categoryTotal = 0;
      let categoryCount = 0;
      weekReviews.forEach(r => {
        if (r.categories && typeof r.categories === 'object') {
          const cats = r.categories as Record<string, number>;
          Object.values(cats).forEach(rating => {
            if (typeof rating === 'number') {
              categoryTotal += rating;
              categoryCount++;
            }
          });
        }
      });
      const avgCategoryScore = categoryCount > 0 ? categoryTotal / categoryCount : 0;

      // Performance score (weighted combination)
      // 50% avg rating + 30% approval rate (scaled to 5) + 20% category score
      const performanceScore = totalReviews > 0
        ? (avgRating * 0.5) + ((approvalRate / 100) * 5 * 0.3) + (avgCategoryScore * 0.2)
        : 0;

      weeks.push({
        week: weekLabel,
        reviews: totalReviews,
        avgRating: parseFloat(avgRating.toFixed(2)),
        approvalRate: parseFloat(approvalRate.toFixed(1)),
        categoryScore: parseFloat(avgCategoryScore.toFixed(2)),
        performanceScore: parseFloat(performanceScore.toFixed(2)),
      });
    }

    return weeks;
  }, [reviews]);

  if (reviews.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No performance data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="week"
          tick={{ fontSize: 12 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 12 }}
          stroke="hsl(var(--muted-foreground))"
          domain={[0, 5]}
          label={{ value: 'Score (0-5)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 12 }}
          stroke="hsl(var(--muted-foreground))"
          label={{ value: 'Reviews', angle: 90, position: 'insideRight', style: { fontSize: 11 } }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value: any, name: string) => {
            if (name === 'reviews') return [value, 'Review Count'];
            if (name === 'avgRating') return [value, 'Avg Rating'];
            if (name === 'approvalRate') return [`${value}%`, 'Approval Rate'];
            if (name === 'performanceScore') return [value, 'Performance Score'];
            if (name === 'categoryScore') return [value, 'Category Score'];
            return [value, name];
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px' }}
          formatter={(value) => {
            const labels: Record<string, string> = {
              reviews: 'Review Count',
              avgRating: 'Avg Rating',
              performanceScore: 'Performance Score',
            };
            return labels[value] || value;
          }}
        />

        {/* Performance Score - Area */}
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="performanceScore"
          fill="hsl(var(--primary))"
          fillOpacity={0.1}
          stroke="hsl(var(--primary))"
          strokeWidth={0}
        />

        {/* Average Rating - Line */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="avgRating"
          stroke="#10B981"
          strokeWidth={2}
          dot={{ fill: '#10B981', r: 4 }}
        />

        {/* Performance Score - Line */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="performanceScore"
          stroke="hsl(var(--primary))"
          strokeWidth={3}
          dot={{ fill: 'hsl(var(--primary))', r: 5 }}
        />

        {/* Review Count - Bars */}
        <Bar
          yAxisId="right"
          dataKey="reviews"
          fill="hsl(var(--chart-3))"
          fillOpacity={0.3}
          radius={[4, 4, 0, 0]}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
