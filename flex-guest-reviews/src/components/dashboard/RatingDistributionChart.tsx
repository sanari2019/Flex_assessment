import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { Review } from '@/lib/api';

interface RatingDistributionChartProps {
  reviews: Review[];
}

export function RatingDistributionChart({ reviews }: RatingDistributionChartProps) {
  const chartData = useMemo(() => {
    const distribution = [
      { rating: '5★', count: 0, fill: 'hsl(var(--chart-5))' },
      { rating: '4★', count: 0, fill: 'hsl(var(--chart-4))' },
      { rating: '3★', count: 0, fill: 'hsl(var(--chart-3))' },
      { rating: '2★', count: 0, fill: 'hsl(var(--chart-2))' },
      { rating: '1★', count: 0, fill: 'hsl(var(--chart-1))' },
    ];

    reviews.forEach(review => {
      if (review.rating !== null) {
        // Convert string to number if needed
        const rating = typeof review.rating === 'string' ? parseFloat(review.rating) : review.rating;
        const rounded = Math.round(rating);
        const index = 5 - rounded;
        if (index >= 0 && index < 5) {
          distribution[index].count++;
        }
      }
    });

    return distribution;
  }, [reviews]);

  const total = chartData.reduce((sum, d) => sum + d.count, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        No rating data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
        <XAxis 
          type="number"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          type="category"
          dataKey="rating"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={40}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value: number) => [`${value} reviews (${total > 0 ? Math.round((value / total) * 100) : 0}%)`, 'Count']}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
