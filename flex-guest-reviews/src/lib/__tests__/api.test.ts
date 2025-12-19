import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fetchReviews, fetchReviewById, updateReviewApproval } from '../api';
import type { ReviewResponse } from '../api';

// Save the original fetch
const originalFetch = global.fetch;

describe('API Client Functions', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch;
  });

  describe('fetchReviews', () => {
    it('should fetch reviews with default parameters', async () => {
      const mockResponse: ReviewResponse = {
        success: true,
        data: [
          {
            id: 1,
            hostaway_id: 1001,
            listing_id: 'property-001',
            listing_name: 'Test Property',
            guest_name: 'John Doe',
            rating: 9.5,
            comment: 'Amazing stay!',
            categories: { cleanliness: 10, communication: 9 },
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
          categoryAverages: { cleanliness: 10, communication: 9 },
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await fetchReviews();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/reviews/hostaway')
      );
      expect(result).toEqual(mockResponse);
    });

    it('should include query parameters in the URL', async () => {
      const mockResponse: ReviewResponse = {
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

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await fetchReviews({
        listingId: 'property-001',
        channel: 'Airbnb',
        ratingMin: 8.0,
        approvedOnly: true,
        limit: 50,
        offset: 10,
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('listingId=property-001')
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('channel=Airbnb')
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('ratingMin=8')
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('approvedOnly=true')
      );
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('limit=50'));
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('offset=10'));
    });

    it('should omit undefined parameters from query string', async () => {
      const mockResponse: ReviewResponse = {
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

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await fetchReviews({
        listingId: 'property-001',
        channel: undefined,
        ratingMin: undefined,
      });

      const fetchCall = (fetch as any).mock.calls[0][0];
      expect(fetchCall).toContain('listingId=property-001');
      expect(fetchCall).not.toContain('channel=');
      expect(fetchCall).not.toContain('ratingMin=');
    });

    it('should throw an error if the response is not ok', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(fetchReviews()).rejects.toThrow(
        'Failed to fetch reviews: Internal Server Error'
      );
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(fetchReviews()).rejects.toThrow('Network error');
    });
  });

  describe('fetchReviewById', () => {
    it('should fetch a single review by id', async () => {
      const mockReview = {
        id: 1,
        hostaway_id: 1001,
        listing_id: 'property-001',
        listing_name: 'Test Property',
        guest_name: 'John Doe',
        rating: 9.5,
        comment: 'Amazing stay!',
        categories: { cleanliness: 10, communication: 9 },
        submitted_at: '2024-01-01T00:00:00Z',
        channel: 'Airbnb',
        review_type: 'guest-to-host',
        status: 'published',
        approved_for_website: true,
      };

      const mockResponse = {
        success: true,
        data: mockReview,
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await fetchReviewById(1);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/reviews/hostaway/1')
      );
      expect(result).toEqual(mockReview);
    });

    it('should throw an error if the response is not ok', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      } as Response);

      await expect(fetchReviewById(999)).rejects.toThrow(
        'Failed to fetch review: Not Found'
      );
    });
  });

  describe('updateReviewApproval', () => {
    it('should update review approval to true', async () => {
      const mockReview = {
        id: 1,
        hostaway_id: 1001,
        listing_id: 'property-001',
        listing_name: 'Test Property',
        guest_name: 'John Doe',
        rating: 9.5,
        comment: 'Amazing stay!',
        categories: { cleanliness: 10 },
        submitted_at: '2024-01-01T00:00:00Z',
        channel: 'Airbnb',
        review_type: 'guest-to-host',
        status: 'published',
        approved_for_website: true,
      };

      const mockResponse = {
        success: true,
        data: mockReview,
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await updateReviewApproval(1, true);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/reviews/hostaway/1'),
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ approvedForWebsite: true }),
        })
      );
      expect(result).toEqual(mockReview);
    });

    it('should update review approval to false', async () => {
      const mockReview = {
        id: 1,
        hostaway_id: 1001,
        listing_id: 'property-001',
        listing_name: 'Test Property',
        guest_name: 'John Doe',
        rating: 9.5,
        comment: 'Amazing stay!',
        categories: { cleanliness: 10 },
        submitted_at: '2024-01-01T00:00:00Z',
        channel: 'Airbnb',
        review_type: 'guest-to-host',
        status: 'published',
        approved_for_website: false,
      };

      const mockResponse = {
        success: true,
        data: mockReview,
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await updateReviewApproval(1, false);

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({ approvedForWebsite: false }),
        })
      );
      expect(result.approved_for_website).toBe(false);
    });

    it('should throw an error if the response is not ok', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Bad Request',
      } as Response);

      await expect(updateReviewApproval(1, true)).rejects.toThrow(
        'Failed to update review: Bad Request'
      );
    });
  });
});
