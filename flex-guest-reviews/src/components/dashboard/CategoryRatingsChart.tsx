import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import type { Review } from '@/lib/api';

interface CategoryRatingsChartProps {
  reviews: Review[];
}

const CATEGORY_LABELS: Record<string, string> = {
  cleanliness: 'Cleanliness',
  communication: 'Communication',
  check_in: 'Check-in',
  accuracy: 'Accuracy',
  location: 'Location',
  value: 'Value',
  respect_house_rules: 'House Rules',
};

export function CategoryRatingsChart({ reviews }: CategoryRatingsChartProps) {
  const chartData = useMemo(() => {
    const categoryTotals: Record<string, { sum: number; count: number }> = {};

    reviews.forEach(review => {
      Object.entries(review.categories).forEach(([category, rating]) => {
        if (rating !== null && rating !== undefined) {
          if (!categoryTotals[category]) {
            categoryTotals[category] = { sum: 0, count: 0 };
          }
          categoryTotals[category].sum += rating;
          categoryTotals[category].count++;
        }
      });
    });

    return Object.entries(categoryTotals)
      .map(([category, data]) => ({
        category: CATEGORY_LABELS[category] || category,
        rating: data.count > 0 ? Number((data.sum / data.count).toFixed(2)) : 0,
        reviews: data.count,
      }))
      .filter(d => d.reviews > 0)
      .sort((a, b) => b.rating - a.rating);
  }, [reviews]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        No category data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
        <XAxis 
          type="number"
          domain={[0, 5]}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          ticks={[0, 1, 2, 3, 4, 5]}
        />
        <YAxis 
          type="category"
          dataKey="category"
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={85}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value: number, name: string) => {
            if (name === 'rating') return [`${value.toFixed(1)} / 5.0`, 'Avg Rating'];
            return [value, name];
          }}
        />
        <Bar 
          dataKey="rating" 
          fill="hsl(var(--primary))" 
          radius={[0, 4, 4, 0]}
          barSize={16}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
