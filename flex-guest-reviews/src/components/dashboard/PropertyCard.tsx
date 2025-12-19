import { RatingStars } from '@/components/reviews/RatingStars';
import { cn } from '@/lib/utils';
import type { Listing, Review } from '@/lib/api';
import { calculateAverageRating, getCategoryAverages } from '@/lib/reviewUtils';

interface PropertyCardProps {
  listing: Listing;
  reviews: Review[];
  onClick?: () => void;
  className?: string;
}

export function PropertyCard({ listing, reviews, onClick, className }: PropertyCardProps) {
  const avgRating = calculateAverageRating(reviews);
  const approvedCount = reviews.filter(r => r.approved_for_website).length;
  const approvalRate = reviews.length > 0 
    ? Math.round((approvedCount / reviews.length) * 100) 
    : 0;
  
  const categoryAvgs = getCategoryAverages(reviews);
  const topIssues = Object.entries(categoryAvgs)
    .filter(([_, val]) => val !== null && val < 4)
    .sort((a, b) => (a[1] || 0) - (b[1] || 0))
    .slice(0, 2);

  const categoryLabels: Record<string, string> = {
    cleanliness: 'Cleanliness',
    communication: 'Communication',
    respect_house_rules: 'House Rules',
    location: 'Location',
    value: 'Value',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'card-elevated p-4 text-left w-full transition-all hover:scale-[1.02]',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        className
      )}
    >
      <div className="flex gap-4">
        <img
          src={listing.imageUrl}
          alt={listing.name}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{listing.name}</h3>
          <p className="text-sm text-muted-foreground">{listing.city}</p>
          
          <div className="mt-2 flex items-center gap-3">
            <RatingStars rating={avgRating} size="sm" />
            <span className="text-sm text-muted-foreground">
              {reviews.length} reviews
            </span>
          </div>
          
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className={cn(
              'font-medium',
              approvalRate >= 80 ? 'text-success' : 
              approvalRate >= 50 ? 'text-warning' : 'text-destructive'
            )}>
              {approvalRate}% approved
            </span>
            {topIssues.length > 0 && (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">
                  Issues: {topIssues.map(([key]) => categoryLabels[key]).join(', ')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
