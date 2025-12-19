const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

/**
 * Fetch reviews from the backend API
 */
export async function fetchReviews(params: ReviewQueryParams = {}): Promise<ReviewResponse> {
  const queryString = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const url = `${API_BASE_URL}/api/reviews/hostaway${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch reviews: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a single review by ID
 */
export async function fetchReviewById(id: number): Promise<Review> {
  const response = await fetch(`${API_BASE_URL}/api/reviews/hostaway/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch review: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}

/**
 * Update review approval status
 */
export async function updateReviewApproval(
  id: number,
  approved: boolean
): Promise<Review> {
  const response = await fetch(`${API_BASE_URL}/api/reviews/hostaway/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ approvedForWebsite: approved }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update review: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}

/**
 * Helper to get relative time string
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}
