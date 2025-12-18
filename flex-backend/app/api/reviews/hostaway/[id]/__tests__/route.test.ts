import { NextRequest } from 'next/server';
import { GET, PATCH } from '../route';
import * as db from '@/lib/db';

// Mock the db module
jest.mock('@/lib/db');

describe('GET /api/reviews/hostaway/:id', () => {
  const mockGetReviewById = db.getReviewById as jest.MockedFunction<typeof db.getReviewById>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a review by id', async () => {
    const mockReview = {
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
    };

    mockGetReviewById.mockResolvedValue(mockReview);

    const request = new NextRequest('http://localhost:3001/api/reviews/hostaway/1');
    const response = await GET(request, { params: { id: '1' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockReview);
    expect(mockGetReviewById).toHaveBeenCalledWith(1);
  });

  it('should return 404 if review not found', async () => {
    mockGetReviewById.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3001/api/reviews/hostaway/999');
    const response = await GET(request, { params: { id: '999' } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Review not found');
  });

  it('should return 500 for invalid id (NaN)', async () => {
    // parseInt('invalid') returns NaN, which causes getReviewById to fail
    mockGetReviewById.mockRejectedValue(new Error('Invalid input'));

    const request = new NextRequest('http://localhost:3001/api/reviews/hostaway/invalid');
    const response = await GET(request, { params: { id: 'invalid' } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Failed to fetch review');
  });

  it('should return 500 on database error', async () => {
    mockGetReviewById.mockRejectedValue(new Error('Database connection failed'));

    const request = new NextRequest('http://localhost:3001/api/reviews/hostaway/1');
    const response = await GET(request, { params: { id: '1' } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Failed to fetch review');
  });
});

describe('PATCH /api/reviews/hostaway/:id', () => {
  const mockUpdateReviewApproval = db.updateReviewApproval as jest.MockedFunction<typeof db.updateReviewApproval>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should approve a review', async () => {
    const mockReview = {
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

    mockUpdateReviewApproval.mockResolvedValue(mockReview);

    const request = new NextRequest('http://localhost:3001/api/reviews/hostaway/1', {
      method: 'PATCH',
      body: JSON.stringify({ approvedForWebsite: true }),
    });

    const response = await PATCH(request, { params: { id: '1' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockReview);
    expect(data.message).toContain('approved');
    expect(mockUpdateReviewApproval).toHaveBeenCalledWith(1, true);
  });

  it('should unapprove a review', async () => {
    const mockReview = {
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
      approved_for_website: false,
    };

    mockUpdateReviewApproval.mockResolvedValue(mockReview);

    const request = new NextRequest('http://localhost:3001/api/reviews/hostaway/1', {
      method: 'PATCH',
      body: JSON.stringify({ approvedForWebsite: false }),
    });

    const response = await PATCH(request, { params: { id: '1' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain('unapproved');
    expect(mockUpdateReviewApproval).toHaveBeenCalledWith(1, false);
  });

  it('should return 500 for invalid id (NaN)', async () => {
    // parseInt('invalid') returns NaN, which causes updateReviewApproval to fail
    mockUpdateReviewApproval.mockRejectedValue(new Error('Invalid input'));

    const request = new NextRequest('http://localhost:3001/api/reviews/hostaway/invalid', {
      method: 'PATCH',
      body: JSON.stringify({ approvedForWebsite: true }),
    });

    const response = await PATCH(request, { params: { id: 'invalid' } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Failed to update review');
  });

  it('should return 400 if approvedForWebsite is missing', async () => {
    const request = new NextRequest('http://localhost:3001/api/reviews/hostaway/1', {
      method: 'PATCH',
      body: JSON.stringify({}),
    });

    const response = await PATCH(request, { params: { id: '1' } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('approvedForWebsite must be a boolean');
  });

  it('should return 400 if approvedForWebsite is not a boolean', async () => {
    const request = new NextRequest('http://localhost:3001/api/reviews/hostaway/1', {
      method: 'PATCH',
      body: JSON.stringify({ approvedForWebsite: 'yes' }),
    });

    const response = await PATCH(request, { params: { id: '1' } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('approvedForWebsite must be a boolean');
  });

  it('should return 404 if review not found', async () => {
    mockUpdateReviewApproval.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3001/api/reviews/hostaway/999', {
      method: 'PATCH',
      body: JSON.stringify({ approvedForWebsite: true }),
    });

    const response = await PATCH(request, { params: { id: '999' } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Review not found');
  });

  it('should return 500 on database error', async () => {
    mockUpdateReviewApproval.mockRejectedValue(new Error('Database connection failed'));

    const request = new NextRequest('http://localhost:3001/api/reviews/hostaway/1', {
      method: 'PATCH',
      body: JSON.stringify({ approvedForWebsite: true }),
    });

    const response = await PATCH(request, { params: { id: '1' } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Failed to update review');
  });
});
