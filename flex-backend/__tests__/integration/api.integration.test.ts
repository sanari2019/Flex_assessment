/**
 * Integration Tests for Reviews API
 *
 * These tests verify the full API flow including:
 * - Database connection
 * - Query parameter parsing
 * - Response formatting
 * - Error handling
 *
 * Note: These tests use the actual database connection.
 * Ensure your .env.local is properly configured.
 */

import { createClient } from '@vercel/postgres';

describe('Reviews API Integration Tests', () => {
  let client: any;

  beforeAll(async () => {
    // Verify database connection is available
    client = createClient({
      connectionString: process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL,
    });

    try {
      await client.connect();
      await client.end();
    } catch (error) {
      console.warn('Database connection not available. Skipping integration tests.');
    }
  });

  describe('GET /api/reviews/hostaway', () => {
    it('should fetch reviews from database', async () => {
      const baseUrl = process.env.API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/reviews/hostaway`);

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.meta).toBeDefined();
      expect(data.meta.averageRating).toBeDefined();
      expect(data.meta.categoryAverages).toBeDefined();
      expect(data.meta.total).toBeDefined();
      expect(data.meta.page).toBeDefined();
      expect(data.meta.limit).toBeDefined();
    });

    it('should filter reviews by listingId', async () => {
      const baseUrl = process.env.API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/reviews/hostaway?listingId=property-001`);

      const data = await response.json();
      expect(data.success).toBe(true);

      // All returned reviews should have the matching listingId
      data.data.forEach((review: any) => {
        expect(review.listing_id).toBe('property-001');
      });
    });

    it('should filter reviews by minimum rating', async () => {
      const baseUrl = process.env.API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/reviews/hostaway?ratingMin=9.0`);

      const data = await response.json();
      expect(data.success).toBe(true);

      // All returned reviews should have rating >= 9.0
      data.data.forEach((review: any) => {
        if (review.rating !== null) {
          const rating = typeof review.rating === 'string' ? parseFloat(review.rating) : review.rating;
          expect(rating).toBeGreaterThanOrEqual(9.0);
        }
      });
    });

    it('should filter approved reviews only', async () => {
      const baseUrl = process.env.API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/reviews/hostaway?approvedOnly=true`);

      const data = await response.json();
      expect(data.success).toBe(true);

      // All returned reviews should be approved
      data.data.forEach((review: any) => {
        expect(review.approved_for_website).toBe(true);
      });
    });

    it('should respect limit parameter', async () => {
      const baseUrl = process.env.API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/reviews/hostaway?limit=5`);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.length).toBeLessThanOrEqual(5);
      expect(data.meta.limit).toBe(5);
    });

    it('should handle offset parameter for pagination', async () => {
      const baseUrl = process.env.API_URL || 'http://localhost:3001';

      // Get first page
      const response1 = await fetch(`${baseUrl}/api/reviews/hostaway?limit=3&offset=0`);
      const data1 = await response1.json();

      // Get second page
      const response2 = await fetch(`${baseUrl}/api/reviews/hostaway?limit=3&offset=3`);
      const data2 = await response2.json();

      expect(data1.success).toBe(true);
      expect(data2.success).toBe(true);

      // Pages should have different reviews (if enough data exists)
      if (data1.data.length > 0 && data2.data.length > 0) {
        expect(data1.data[0].id).not.toBe(data2.data[0].id);
      }

      expect(data1.meta.page).toBe(1);
      expect(data2.meta.page).toBe(2);
    });
  });

  describe('GET /api/reviews/hostaway/:id', () => {
    let existingReviewId: number;

    beforeAll(async () => {
      // Get an existing review ID from the database
      const baseUrl = process.env.API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/reviews/hostaway?limit=1`);
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        existingReviewId = data.data[0].id;
      }
    });

    it('should fetch a single review by id', async () => {
      if (!existingReviewId) {
        console.warn('No reviews in database. Skipping test.');
        return;
      }

      const baseUrl = process.env.API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/reviews/hostaway/${existingReviewId}`);

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.id).toBe(existingReviewId);
      expect(data.data.listing_id).toBeDefined();
      expect(data.data.guest_name).toBeDefined();
    });

    it('should return 404 for non-existent review', async () => {
      const baseUrl = process.env.API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/reviews/hostaway/999999`);

      expect(response.status).toBe(404);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Review not found');
    });
  });

  describe('PATCH /api/reviews/hostaway/:id', () => {
    let testReviewId: number;

    beforeAll(async () => {
      // Get an existing review ID from the database
      const baseUrl = process.env.API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/reviews/hostaway?limit=1`);
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        testReviewId = data.data[0].id;
      }
    });

    it('should update review approval status to true', async () => {
      if (!testReviewId) {
        console.warn('No reviews in database. Skipping test.');
        return;
      }

      const baseUrl = process.env.API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/reviews/hostaway/${testReviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approvedForWebsite: true }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.approved_for_website).toBe(true);
      expect(data.message).toContain('approved');
    });

    it('should update review approval status to false', async () => {
      if (!testReviewId) {
        console.warn('No reviews in database. Skipping test.');
        return;
      }

      const baseUrl = process.env.API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/reviews/hostaway/${testReviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approvedForWebsite: false }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.approved_for_website).toBe(false);
      expect(data.message).toContain('unapproved');
    });

    it('should return 400 for invalid payload', async () => {
      if (!testReviewId) {
        console.warn('No reviews in database. Skipping test.');
        return;
      }

      const baseUrl = process.env.API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/reviews/hostaway/${testReviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approvedForWebsite: 'invalid' }),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('approvedForWebsite must be a boolean');
    });

    it('should return 404 for non-existent review', async () => {
      const baseUrl = process.env.API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/reviews/hostaway/999999`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approvedForWebsite: true }),
      });

      expect(response.status).toBe(404);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Review not found');
    });
  });

  describe('API Response Format Validation', () => {
    it('should return consistent response format for successful requests', async () => {
      const baseUrl = process.env.API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/reviews/hostaway`);
      const data = await response.json();

      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('meta');
      expect(typeof data.success).toBe('boolean');
    });

    it('should return consistent error format for failed requests', async () => {
      const baseUrl = process.env.API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/reviews/hostaway/999999`);
      const data = await response.json();

      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('error');
      expect(data.success).toBe(false);
      expect(typeof data.error).toBe('string');
    });
  });
});
