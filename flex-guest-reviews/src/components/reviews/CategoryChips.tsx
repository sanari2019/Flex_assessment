import { cn } from '@/lib/utils';
import type { ReviewCategory } from '@/lib/api';

interface CategoryChipsProps {
  categories: Partial<ReviewCategory>;
  showAll?: boolean;
  className?: string;
}

const categoryLabels: Record<keyof ReviewCategory, string> = {
  cleanliness: 'Cleanliness',
  communication: 'Communication',
  checkIn: 'Check-in',
  accuracy: 'Accuracy',
  location: 'Location',
  value: 'Value',
  respectHouseRules: 'House Rules',
};

export function CategoryChips({ categories, showAll = false, className }: CategoryChipsProps) {
  const entries = Object.entries(categories).filter(
    ([_, value]) => value !== null && value !== undefined
  ) as [keyof ReviewCategory, number][];

  // Show only top categories if not showAll
  const displayEntries = showAll ? entries : entries.slice(0, 3);

  if (displayEntries.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {displayEntries.map(([key, value]) => (
        <span
          key={key}
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md',
            value >= 4.5 
              ? 'bg-primary/10 text-primary' 
              : value >= 3.5 
                ? 'bg-muted text-muted-foreground'
                : 'bg-warning/10 text-warning'
          )}
        >
          <span>{categoryLabels[key]}</span>
          <span className="font-medium">{value.toFixed(1)}</span>
        </span>
      ))}
    </div>
  );
}
