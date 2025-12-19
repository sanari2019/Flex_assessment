import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number | string | null;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  showNumber?: boolean;
  className?: string;
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = true,
  showNumber = false,
  className
}: RatingStarsProps) {
  if (rating === null) {
    return <span className="text-muted-foreground text-sm">No rating</span>;
  }

  // Convert to number if it's a string (database returns strings)
  const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;

  // Validate rating
  if (isNaN(numericRating) || numericRating < 0) {
    return <span className="text-muted-foreground text-sm">Invalid rating</span>;
  }

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const textClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating % 1 >= 0.5;
  const emptyStars = Math.max(0, maxRating - fullStars - (hasHalfStar ? 1 : 0));

  // Show as a compact number badge
  if (showNumber) {
    return (
      <span className="rating-chip">
        <Star className="h-3 w-3 fill-current" />
        {numericRating.toFixed(1)}
      </span>
    );
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(sizeClasses[size], 'fill-primary text-primary')}
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className={cn(sizeClasses[size], 'text-muted-foreground/30')} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={cn(sizeClasses[size], 'fill-primary text-primary')} />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(sizeClasses[size], 'text-muted-foreground/30')}
          />
        ))}
      </div>
      {showValue && (
        <span className={cn('font-medium text-foreground', textClasses[size])}>
          {numericRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
