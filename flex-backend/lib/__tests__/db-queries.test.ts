import { getReviews, getReviewById, updateReviewApproval } from '../db';
import { createClient } from '@vercel/postgres';

// Mock the @vercel/postgres module
jest.mock('@vercel/postgres', () => ({
  createClient: jest.fn(),
}));

describe('Database Query Functions - Unit Tests', () => {
  let mockClient: any;
  let mockConnect: jest.Mock;
  let mockQuery: jest.Mock;
  let mockEnd: jest.Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Create mock functions
    mockConnect = jest.fn().mockResolvedValue(undefined);
    mockQuery = jest.fn();
    mockEnd = jest.fn().mockResolvedValue(undefined);

    // Create mock client
    mockClient = {
      connect: mockConnect,
      query: mockQuery,
      end: mockEnd,
    };

    // Mock createClient to return our mock client
    (createClient as jest.Mock).mockReturnValue(mockClient);
  });

  describe('getReviews', () => {
    it('should fetch all reviews with default parameters', async () => {
      const mockRows = [
        {
          id: 1,
          hostaway_id: 1001,
          listing_id: '123',
          listing_name: 'Test Property',
          guest_name: 'John Doe',
          rating: 9.5,
          comment: 'Amazing!',
          categories: { cleanliness: 10, communication: 9 },
          submitted_at: '2024-01-01',
          channel: 'Airbnb',
          review_type: 'guest-to-host',
          status: 'published',
          approved_for_website: true,
        },
      ];

      mockQuery.mockResolvedValue({ rows: mockRows });

      const result = await getReviews();

      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM reviews WHERE 1=1'),
        expect.arrayContaining([100, 0])
      );
      expect(mockEnd).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockRows);
    });

    it('should filter reviews by listingId', async () => {
      const mockRows = [{ id: 1, listing_id: '123' }];
      mockQuery.mockResolvedValue({ rows: mockRows });

      await getReviews({ listingId: '123' });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('AND listing_id = $1'),
        expect.arrayContaining(['123'])
      );
    });

    it('should filter reviews by channel', async () => {
      const mockRows = [{ id: 1, channel: 'Airbnb' }];
      mockQuery.mockResolvedValue({ rows: mockRows });

      await getReviews({ channel: 'Airbnb' });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('AND channel = $1'),
        expect.arrayContaining(['Airbnb'])
      );
    });

    it('should filter reviews by minimum rating', async () => {
      const mockRows = [{ id: 1, rating: 9.0 }];
      mockQuery.mockResolvedValue({ rows: mockRows });

      await getReviews({ ratingMin: 8.5 });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('AND rating >= $1'),
        expect.arrayContaining([8.5])
      );
    });

    it('should filter reviews by approved status', async () => {
      const mockRows = [{ id: 1, approved_for_website: true }];
      mockQuery.mockResolvedValue({ rows: mockRows });

      await getReviews({ approvedOnly: true });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('AND approved_for_website = true'),
        expect.any(Array)
      );
    });

    it('should apply limit and offset', async () => {
      const mockRows = [];
      mockQuery.mockResolvedValue({ rows: mockRows });

      await getReviews({ limit: 50, offset: 10 });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT'),
        expect.arrayContaining([50, 10])
      );
    });

    it('should combine multiple filters', async () => {
      const mockRows = [];
      mockQuery.mockResolvedValue({ rows: mockRows });

      await getReviews({
        listingId: '123',
        channel: 'Airbnb',
        ratingMin: 8.0,
        approvedOnly: true,
        limit: 20,
        offset: 5,
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('AND listing_id = $1'),
        expect.arrayContaining(['123', 'Airbnb', 8.0, 20, 5])
      );
    });

    it('should close connection even on error', async () => {
      mockQuery.mockRejectedValue(new Error('Database error'));

      await expect(getReviews()).rejects.toThrow('Database error');

      expect(mockEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe('getReviewById', () => {
    it('should fetch a review by id', async () => {
      const mockRow = {
        id: 1,
        hostaway_id: 1001,
        listing_id: '123',
        listing_name: 'Test Property',
        guest_name: 'John Doe',
        rating: 9.5,
        comment: 'Amazing!',
        categories: { cleanliness: 10 },
        submitted_at: '2024-01-01',
        channel: 'Airbnb',
        review_type: 'guest-to-host',
        status: 'published',
        approved_for_website: true,
      };

      mockQuery.mockResolvedValue({ rows: [mockRow] });

      const result = await getReviewById(1);

      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM reviews WHERE id = $1',
        [1]
      );
      expect(mockEnd).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockRow);
    });

    it('should return null if review not found', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await getReviewById(999);

      expect(result).toBeNull();
    });

    it('should close connection even on error', async () => {
      mockQuery.mockRejectedValue(new Error('Database error'));

      await expect(getReviewById(1)).rejects.toThrow('Database error');

      expect(mockEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateReviewApproval', () => {
    it('should approve a review', async () => {
      const mockRow = {
        id: 1,
        hostaway_id: 1001,
        listing_id: '123',
        listing_name: 'Test Property',
        guest_name: 'John Doe',
        rating: 9.5,
        comment: 'Amazing!',
        categories: { cleanliness: 10 },
        submitted_at: '2024-01-01',
        channel: 'Airbnb',
        review_type: 'guest-to-host',
        status: 'published',
        approved_for_website: true,
      };

      mockQuery.mockResolvedValue({ rows: [mockRow] });

      const result = await updateReviewApproval(1, true);

      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        'UPDATE reviews SET approved_for_website = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [true, 1]
      );
      expect(mockEnd).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockRow);
    });

    it('should unapprove a review', async () => {
      const mockRow = {
        id: 1,
        approved_for_website: false,
      };

      mockQuery.mockResolvedValue({ rows: [mockRow] });

      const result = await updateReviewApproval(1, false);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        [false, 1]
      );
      expect(result?.approved_for_website).toBe(false);
    });

    it('should return null if review not found', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await updateReviewApproval(999, true);

      expect(result).toBeNull();
    });

    it('should close connection even on error', async () => {
      mockQuery.mockRejectedValue(new Error('Database error'));

      await expect(updateReviewApproval(1, true)).rejects.toThrow('Database error');

      expect(mockEnd).toHaveBeenCalledTimes(1);
    });
  });
});
