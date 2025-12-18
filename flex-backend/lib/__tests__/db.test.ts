import { calculateMetrics } from '../db';
import type { Review } from '../types';

describe('Database Functions - Unit Tests', () => {
  describe('calculateMetrics', () => {
    it('should return zero metrics for empty review array', async () => {
      const result = await calculateMetrics([]);

      expect(result.averageRating).toBe(0);
      expect(result.categoryAverages).toEqual({});
    });

    it('should calculate average rating correctly', async () => {
      const reviews: Review[] = [
        {
          id: 1,
          hostaway_id: 1,
          listing_id: '123',
          listing_name: 'Test Property',
          guest_name: 'John Doe',
          rating: 8.5,
          comment: 'Great!',
          categories: {},
          submitted_at: '2024-01-01',
          channel: 'Airbnb',
          review_type: 'guest-to-host',
          status: 'published',
          approved_for_website: true,
        },
        {
          id: 2,
          hostaway_id: 2,
          listing_id: '123',
          listing_name: 'Test Property',
          guest_name: 'Jane Smith',
          rating: 9.5,
          comment: 'Excellent!',
          categories: {},
          submitted_at: '2024-01-02',
          channel: 'Booking.com',
          review_type: 'guest-to-host',
          status: 'published',
          approved_for_website: true,
        },
      ];

      const result = await calculateMetrics(reviews);

      expect(result.averageRating).toBe(9.0); // (8.5 + 9.5) / 2
    });

    it('should calculate category averages correctly', async () => {
      const reviews: Review[] = [
        {
          id: 1,
          hostaway_id: 1,
          listing_id: '123',
          listing_name: 'Test Property',
          guest_name: 'John Doe',
          rating: 9.0,
          comment: 'Great!',
          categories: {
            cleanliness: 9,
            communication: 8,
            location: 10,
          },
          submitted_at: '2024-01-01',
          channel: 'Airbnb',
          review_type: 'guest-to-host',
          status: 'published',
          approved_for_website: true,
        },
        {
          id: 2,
          hostaway_id: 2,
          listing_id: '123',
          listing_name: 'Test Property',
          guest_name: 'Jane Smith',
          rating: 8.0,
          comment: 'Good!',
          categories: {
            cleanliness: 7,
            communication: 8,
            value: 9,
          },
          submitted_at: '2024-01-02',
          channel: 'Booking.com',
          review_type: 'guest-to-host',
          status: 'published',
          approved_for_website: true,
        },
      ];

      const result = await calculateMetrics(reviews);

      expect(result.categoryAverages.cleanliness).toBe(8); // (9 + 7) / 2
      expect(result.categoryAverages.communication).toBe(8); // (8 + 8) / 2
      expect(result.categoryAverages.location).toBe(10); // Only one rating
      expect(result.categoryAverages.value).toBe(9); // Only one rating
    });

    it('should handle reviews with null ratings', async () => {
      const reviews: Review[] = [
        {
          id: 1,
          hostaway_id: 1,
          listing_id: '123',
          listing_name: 'Test Property',
          guest_name: 'John Doe',
          rating: null,
          comment: 'No rating',
          categories: {},
          submitted_at: '2024-01-01',
          channel: 'Airbnb',
          review_type: 'guest-to-host',
          status: 'published',
          approved_for_website: true,
        },
        {
          id: 2,
          hostaway_id: 2,
          listing_id: '123',
          listing_name: 'Test Property',
          guest_name: 'Jane Smith',
          rating: 9.0,
          comment: 'Great!',
          categories: {},
          submitted_at: '2024-01-02',
          channel: 'Booking.com',
          review_type: 'guest-to-host',
          status: 'published',
          approved_for_website: true,
        },
      ];

      const result = await calculateMetrics(reviews);

      expect(result.averageRating).toBe(9.0); // Only counts non-null ratings
    });

    it('should handle category ratings with undefined values', async () => {
      const reviews: Review[] = [
        {
          id: 1,
          hostaway_id: 1,
          listing_id: '123',
          listing_name: 'Test Property',
          guest_name: 'John Doe',
          rating: 9.0,
          comment: 'Great!',
          categories: {
            cleanliness: 9,
            communication: undefined,
          },
          submitted_at: '2024-01-01',
          channel: 'Airbnb',
          review_type: 'guest-to-host',
          status: 'published',
          approved_for_website: true,
        },
      ];

      const result = await calculateMetrics(reviews);

      expect(result.categoryAverages.cleanliness).toBe(9);
      expect(result.categoryAverages.communication).toBeUndefined();
    });

    it('should round average rating to 2 decimal places', async () => {
      const reviews: Review[] = [
        {
          id: 1,
          hostaway_id: 1,
          listing_id: '123',
          listing_name: 'Test Property',
          guest_name: 'John Doe',
          rating: 8.333,
          comment: 'Good!',
          categories: {},
          submitted_at: '2024-01-01',
          channel: 'Airbnb',
          review_type: 'guest-to-host',
          status: 'published',
          approved_for_website: true,
        },
        {
          id: 2,
          hostaway_id: 2,
          listing_id: '123',
          listing_name: 'Test Property',
          guest_name: 'Jane Smith',
          rating: 9.666,
          comment: 'Excellent!',
          categories: {},
          submitted_at: '2024-01-02',
          channel: 'Booking.com',
          review_type: 'guest-to-host',
          status: 'published',
          approved_for_website: true,
        },
      ];

      const result = await calculateMetrics(reviews);

      expect(result.averageRating).toBe(9.0); // (8.333 + 9.666) / 2 = 9.0
    });
  });
});
