import { useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import type { Review } from '@/lib/api';

interface ChannelDistributionChartProps {
  reviews: Review[];
}

const CHANNEL_COLORS: Record<string, string> = {
  airbnb: 'hsl(var(--chart-1))',
  booking: 'hsl(var(--chart-2))',
  direct: 'hsl(var(--chart-3))',
  vrbo: 'hsl(var(--chart-4))',
  expedia: 'hsl(var(--chart-5))',
};

const CHANNEL_LABELS: Record<string, string> = {
  airbnb: 'Airbnb',
  booking: 'Booking.com',
  direct: 'Direct',
  vrbo: 'VRBO',
  expedia: 'Expedia',
};

export function ChannelDistributionChart({ reviews }: ChannelDistributionChartProps) {
  const chartData = useMemo(() => {
    const channelCounts: Record<string, number> = {};
    
    reviews.forEach(review => {
      channelCounts[review.channel] = (channelCounts[review.channel] || 0) + 1;
    });

    return Object.entries(channelCounts)
      .map(([channel, count]) => ({
        name: CHANNEL_LABELS[channel] || channel,
        value: count,
        fill: CHANNEL_COLORS[channel] || 'hsl(var(--muted))',
      }))
      .sort((a, b) => b.value - a.value);
  }, [reviews]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        No channel data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={70}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value: number) => [`${value} reviews`, 'Count']}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
