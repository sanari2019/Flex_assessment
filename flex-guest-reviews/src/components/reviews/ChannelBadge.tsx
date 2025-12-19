import { cn } from '@/lib/utils';

interface ChannelBadgeProps {
  channel: string;
  inline?: boolean;
  className?: string;
}

const channelConfig: Record<string, { label: string; className: string }> = {
  airbnb: { label: 'Airbnb', className: 'badge-airbnb' },
  booking: { label: 'Booking.com', className: 'badge-booking' },
  direct: { label: 'Direct', className: 'badge-direct' },
  vrbo: { label: 'VRBO', className: 'badge-vrbo' },
  google: { label: 'Google', className: 'badge-google' },
};

export function ChannelBadge({ channel, inline = false, className }: ChannelBadgeProps) {
  const config = channelConfig[channel] || { 
    label: channel, 
    className: 'bg-muted text-muted-foreground' 
  };

  // Inline mode - just show the text
  if (inline) {
    return (
      <span className={cn('font-medium', className)}>
        {config.label}
      </span>
    );
  }

  return (
    <span className={cn('badge-channel', config.className, className)}>
      {config.label}
    </span>
  );
}
