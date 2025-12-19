import { format, formatDistanceToNow } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { RatingStars } from './RatingStars';
import { ChannelBadge } from './ChannelBadge';
import { CategoryChips } from './CategoryChips';
import { cn } from '@/lib/utils';
import type { Review } from '@/lib/api';

interface ReviewCardProps {
  review: Review;
  showApprovalToggle?: boolean;
  onApprovalChange?: (id: number, approved: boolean) => void;
  compact?: boolean;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function ReviewCard({
  review,
  showApprovalToggle = false,
  onApprovalChange,
  compact = false,
  className
}: ReviewCardProps) {
  const submittedDate = new Date(review.submitted_at);
  const relativeDate = formatDistanceToNow(submittedDate, { addSuffix: true });

  return (
    <div className={cn(
      'bg-card rounded-xl border border-border p-6 transition-all duration-200',
      'hover:shadow-hover hover:-translate-y-0.5',
      className
    )}>
      {/* Card Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-semibold text-primary">
            {getInitials(review.guest_name)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-foreground">{review.guest_name}</h4>
            <RatingStars rating={review.rating || 0} size="sm" showNumber />
          </div>
          <p className="text-sm text-muted-foreground">
            {relativeDate} · via <ChannelBadge channel={review.channel} inline />
          </p>
        </div>

        {/* Approval toggle */}
        {showApprovalToggle && onApprovalChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Approved</span>
            <Switch
              checked={review.approved_for_website}
              onCheckedChange={(checked) => onApprovalChange(review.id, checked)}
              aria-label={`Approve review from ${review.guest_name}`}
            />
          </div>
        )}
      </div>

      {/* Review text */}
      <p className={cn(
        'text-foreground leading-relaxed',
        compact ? 'line-clamp-3' : ''
      )}>
        {review.comment}
        {compact && review.comment.length > 200 && (
          <span className="text-primary font-medium cursor-pointer ml-1">
            ... Read more
          </span>
        )}
      </p>

      {/* Category chips */}
      {!compact && (
        <div className="mt-4">
          <CategoryChips
            categories={review.categories}
            showAll={!compact}
          />
        </div>
      )}

      {/* Listing name for dashboard */}
      {!compact && review.listing_name && (
        <p className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
          Property: <span className="font-medium text-foreground">{review.listing_name}</span>
        </p>
      )}

      {/* Status badge for dashboard */}
      {!compact && (
        <div className="mt-3 flex items-center gap-2">
          <span className={cn(
            'badge-channel text-xs',
            review.approved_for_website ? 'badge-approved' : 'badge-pending'
          )}>
            {review.approved_for_website ? 'Published' : 'Pending Approval'}
          </span>
        </div>
      )}
    </div>
  );
}
