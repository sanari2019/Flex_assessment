import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function KPICard({ 
  label, 
  value, 
  subValue, 
  icon: Icon, 
  trend, 
  className 
}: KPICardProps) {
  return (
    <div className={cn('kpi-card relative', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label mb-1 text-xs">{label}</p>
          <p className="stat-value">{value}</p>
          {subValue && (
            <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>
          )}
          {trend && (
            <p className={cn(
              'text-xs font-medium mt-2',
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {Icon && (
          <div className="absolute top-4 right-4">
            <Icon className="h-6 w-6 text-primary/20" strokeWidth={1.5} />
          </div>
        )}
      </div>
    </div>
  );
}
