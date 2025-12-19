import { useState } from 'react';
import { ReviewCard } from './ReviewCard';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquareText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Review } from '@/lib/api';

interface ReviewListProps {
  reviews: Review[];
  showApprovalToggle?: boolean;
  onApprovalChange?: (id: number, approved: boolean) => void;
  compact?: boolean;
  initialLimit?: number;
  isLoading?: boolean;
  emptyMessage?: string;
  gridLayout?: boolean;
}

export function ReviewList({
  reviews,
  showApprovalToggle = false,
  onApprovalChange,
  compact = false,
  initialLimit = 6,
  isLoading = false,
  emptyMessage = 'No reviews found.',
  gridLayout = false,
}: ReviewListProps) {
  const [visibleCount, setVisibleCount] = useState(initialLimit);

  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + initialLimit, reviews.length));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 col-span-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-16 min-h-[400px]">
        <MessageSquareText className="h-20 w-20 text-muted-foreground/40 mb-4" strokeWidth={1} />
        <h3 className="text-2xl font-semibold text-muted-foreground mb-2">No reviews published yet</h3>
        <p className="text-sm text-muted-foreground/80">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      {visibleReviews.map((review, index) => (
        <div 
          key={review.id} 
          className="animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ReviewCard
            review={review}
            showApprovalToggle={showApprovalToggle}
            onApprovalChange={onApprovalChange}
            compact={compact}
          />
        </div>
      ))}

      {hasMore && (
        <div className="col-span-full flex justify-center pt-8">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="min-w-[200px] border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
          >
            Load More Reviews
          </Button>
        </div>
      )}

      {!hasMore && reviews.length > 0 && (
        <div className="col-span-full text-center pt-8">
          <p className="text-sm text-muted-foreground">You've seen all {reviews.length} reviews</p>
        </div>
      )}
    </>
  );
}
