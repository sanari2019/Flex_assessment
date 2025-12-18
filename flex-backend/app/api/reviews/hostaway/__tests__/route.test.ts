import { NextRequest } from 'next/server';
import { GET } from '../route';
import * as db from '@/lib/db';

// Mock the db module
jest.mock('@/lib/db');

describe('GET /api/reviews/hostaway', () => {
  const mockGetReviews = db.getReviews as jest.MockedFunction<typeof db.getReviews>;
  const mockCalculateMetrics = db.calculateMetrics as jest.MockedFunction<typeof db.calculateMetrics>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all reviews with metrics', async () => {
    const mockReviews = [
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

    const mockMetrics = {
      averageRating: 9.5,
      categoryAverages: { cleanliness: 10, communication: 9 },
    };

    mockGetReviews.mockResolvedValue(mockReviews);
    mockCalculateMetrics.mockResolvedValue(mockMetrics);

    const request = new NextRequest('http://localhost:3001/api/reviews/hostaway');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockReviews);
    expect(data.meta).toEqual({
      total: 1,
      page: 1,
      limit: 100,
      ...mockMetrics,
    });
  });

  it('should filter by listingId query parameter', async () => {
    mockGetReviews.mockResolvedValue([]);
    mockCalculateMetrics.mockResolvedValue({ averageRating: 0, categoryAverages: {} });

    const request = new NextRequest('http://localhost:3001/api/reviews/hostaway?listingId=123');
    await GET(request);

    expect(mockGetReviews).toHaveBeenCalledWith(
      expect.objectContaining({ listingId: '123' })
    );
  });

  it('should filter by channel query parameter', async () => {
    mockGetReviews.mockResolvedValue([]);
    mockCalculateMetrics.mockResolvedValue({ averageRating: 0, categoryAverages: {} });

    const request = new NextRequest('http://localhost:3001/api/reviews/hostaway?channel=Airbnb');
    await GET(request);

    expect(mockGetReviews).toHaveBeenCalledWith(
      expect.objectContaining({ channel: 'Airbnb' })
    );
  });

  it('should filter by ratingMin query parameter', async () => {
    mockGetReviews.mockResolvedValue([]);
    mockCalculateMetrics.mockResolvedValue({ averageRating: 0, categoryAverages: {} });

    const request = new NextRequest('http://localhost:3001/api/reviews/hostaway?ratingMin=8.5');
    await GET(request);

    expect(mockGetReviews).toHaveBeenCalledWith(
      expect.objectContaining({ ratingMin: 8.5 })
    );
  });

  it('should filter by approvedOnly query parameter', async () => {
    mockGetReviews.mockResolvedValue([]);
    mockCalculateMetrics.mockResolvedValue({ averageRating: 0, categoryAverages: {} });

    const request = new NextRequest('http://localhost:3001/api/reviews/hostaway?approvedOnly=true');
    await GET(request);

    expect(mockGetReviews).toHaveBeenCalledWith(
      expect.objectContaining({ approvedOnly: true })
    );
  });

  it('should apply limit and offset query parameters', async () => {
    mockGetReviews.mockResolvedValue([]);
    mockCalculateMetrics.mockResolvedValue({ averageRating: 0, categoryAverages: {} });

    const request = new NextRequest('http://localhost:3001/api/reviews/hostaway?limit=50&offset=10');
    await GET(request);

    expect(mockGetReviews).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 50, offset: 10 })
    );
  });

  it('should handle multiple query parameters', async () => {
    mockGetReviews.mockResolvedValue([]);
    mockCalculateMetrics.mockResolvedValue({ averageRating: 0, categoryAverages: {} });

    const request = new NextRequest(
      'http://localhost:3001/api/reviews/hostaway?listingId=123&channel=Airbnb&ratingMin=8.0&approvedOnly=true'
    );
    await GET(request);

    expect(mockGetReviews).toHaveBeenCalledWith(
      expect.objectContaining({
        listingId: '123',
        channel: 'Airbnb',
        ratingMin: 8.0,
        approvedOnly: true,
      })
    );
  });

  it('should return 500 on database error', async () => {
    mockGetReviews.mockRejectedValue(new Error('Database connection failed'));

    const request = new NextRequest('http://localhost:3001/api/reviews/hostaway');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Failed to fetch reviews');
  });

  it('should use default limit of 100 when not specified', async () => {
    mockGetReviews.mockResolvedValue([]);
    mockCalculateMetrics.mockResolvedValue({ averageRating: 0, categoryAverages: {} });

    const request = new NextRequest('http://localhost:3001/api/reviews/hostaway');
    await GET(request);

    expect(mockGetReviews).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 100, offset: 0 })
    );
  });
});
