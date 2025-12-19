import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useReviews, useReview, useUpdateReviewApproval } from '../useReviews';
import * as api from '@/lib/api';

// Mock the api module
vi.mock('@/lib/api');

// Create wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useReviews Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch reviews successfully', async () => {
    const mockData = {
      success: true,
      data: [
        {
          id: 1,
          hostaway_id: 1001,
          listing_id: 'property-001',
          listing_name: 'Test Property',
          guest_name: 'John Doe',
          rating: 9.5,
          comment: 'Amazing!',
          categories: { cleanliness: 10 },
          submitted_at: '2024-01-01T00:00:00Z',
          channel: 'Airbnb',
          review_type: 'guest-to-host',
          status: 'published',
          approved_for_website: true,
        },
      ],
      meta: {
        total: 1,
        page: 1,
        limit: 100,
        averageRating: 9.5,
        categoryAverages: { cleanliness: 10 },
      },
    };

    vi.mocked(api.fetchReviews).mockResolvedValue(mockData);

    const { result } = renderHook(() => useReviews({}), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to succeed
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('should pass query parameters to fetchReviews', async () => {
    const mockData = {
      success: true,
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 50,
        averageRating: 0,
        categoryAverages: {},
      },
    };

    vi.mocked(api.fetchReviews).mockResolvedValue(mockData);

    const params = {
      listingId: 'property-001',
      channel: 'Airbnb',
      ratingMin: 8.0,
      approvedOnly: true,
    };

    renderHook(() => useReviews(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(api.fetchReviews).toHaveBeenCalledWith(params);
    });
  });

  it('should handle errors', async () => {
    const mockError = new Error('Network error');
    vi.mocked(api.fetchReviews).mockRejectedValue(mockError);

    const { result } = renderHook(() => useReviews({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeUndefined();
  });

  it('should only call fetchReviews once for cached queries', async () => {
    const mockData = {
      success: true,
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 100,
        averageRating: 0,
        categoryAverages: {},
      },
    };

    vi.mocked(api.fetchReviews).mockResolvedValue(mockData);

    const wrapper = createWrapper();

    // First call
    const { result: result1 } = renderHook(() => useReviews({ listingId: 'property-001' }), {
      wrapper,
    });

    await waitFor(() => expect(result1.current.isSuccess).toBe(true));

    // Second hook with same params - should use cache
    const { result: result2 } = renderHook(() => useReviews({ listingId: 'property-001' }), {
      wrapper,
    });

    await waitFor(() => expect(result2.current.isSuccess).toBe(true));

    // Should have been called only once due to caching
    expect(api.fetchReviews).toHaveBeenCalledTimes(1);
    expect(result2.current.data).toEqual(mockData);
  });
});

describe('useReview Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch a single review by id', async () => {
    const mockReview = {
      id: 1,
      hostaway_id: 1001,
      listing_id: 'property-001',
      listing_name: 'Test Property',
      guest_name: 'John Doe',
      rating: 9.5,
      comment: 'Amazing!',
      categories: { cleanliness: 10 },
      submitted_at: '2024-01-01T00:00:00Z',
      channel: 'Airbnb',
      review_type: 'guest-to-host',
      status: 'published',
      approved_for_website: true,
    };

    vi.mocked(api.fetchReviewById).mockResolvedValue(mockReview);

    const { result } = renderHook(() => useReview(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockReview);
    expect(api.fetchReviewById).toHaveBeenCalledWith(1);
  });

  it('should handle errors', async () => {
    const mockError = new Error('Review not found');
    vi.mocked(api.fetchReviewById).mockRejectedValue(mockError);

    const { result } = renderHook(() => useReview(999), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
  });
});

describe('useUpdateReviewApproval Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update review approval', async () => {
    const mockUpdatedReview = {
      id: 1,
      hostaway_id: 1001,
      listing_id: 'property-001',
      listing_name: 'Test Property',
      guest_name: 'John Doe',
      rating: 9.5,
      comment: 'Amazing!',
      categories: { cleanliness: 10 },
      submitted_at: '2024-01-01T00:00:00Z',
      channel: 'Airbnb',
      review_type: 'guest-to-host',
      status: 'published',
      approved_for_website: true,
    };

    vi.mocked(api.updateReviewApproval).mockResolvedValue(mockUpdatedReview);

    const { result } = renderHook(() => useUpdateReviewApproval(), {
      wrapper: createWrapper(),
    });

    // Trigger the mutation
    result.current.mutate({ id: 1, approved: true });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.updateReviewApproval).toHaveBeenCalledWith(1, true);
    expect(result.current.data).toEqual(mockUpdatedReview);
  });

  it('should handle mutation errors', async () => {
    const mockError = new Error('Failed to update');
    vi.mocked(api.updateReviewApproval).mockRejectedValue(mockError);

    const { result } = renderHook(() => useUpdateReviewApproval(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: 1, approved: true });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
  });
});
