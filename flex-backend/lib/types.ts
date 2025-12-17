export interface Review {
  id: number;
  hostaway_id: number;
  listing_id: string;
  listing_name: string;
  guest_name: string;
  rating: number | null;
  comment: string;
  categories: {
    cleanliness?: number;
    communication?: number;
    respect_house_rules?: number;
    location?: number;
    value?: number;
    [key: string]: number | undefined;
  };
  submitted_at: string;
  channel: 'Airbnb' | 'Booking.com' | 'Direct' | string;
  review_type: 'host-to-guest' | 'guest-to-host';
  status: 'published' | 'pending';
  approved_for_website: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ReviewQueryParams {
  listingId?: string;
  channel?: string;
  type?: string;
  ratingMin?: number;
  dateStart?: string;
  dateEnd?: string;
  approvedOnly?: boolean;
  limit?: number;
  offset?: number;
}

export interface ReviewResponse {
  success: boolean;
  data: Review[];
  meta: {
    total: number;
    page?: number;
    limit?: number;
    averageRating: number;
    categoryAverages: {
      [key: string]: number;
    };
  };
}

export interface HostawayReview {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: Array<{
    category: string;
    rating: number;
  }>;
  submittedAt: string;
  guestName: string;
  listingName: string;
}
