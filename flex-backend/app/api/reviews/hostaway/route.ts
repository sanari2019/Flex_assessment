import { NextRequest, NextResponse } from 'next/server';
import { getReviews, calculateMetrics } from '@/lib/db';
import { ReviewQueryParams } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const params: ReviewQueryParams = {
      listingId: searchParams.get('listingId') || undefined,
      channel: searchParams.get('channel') || undefined,
      type: searchParams.get('type') || undefined,
      ratingMin: searchParams.get('ratingMin') ? parseFloat(searchParams.get('ratingMin')!) : undefined,
      dateStart: searchParams.get('dateStart') || undefined,
      dateEnd: searchParams.get('dateEnd') || undefined,
      approvedOnly: searchParams.get('approvedOnly') === 'true',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    };

    const reviews = await getReviews(params);
    const metrics = await calculateMetrics(reviews);

    return NextResponse.json({
      success: true,
      data: reviews,
      meta: {
        total: reviews.length,
        page: Math.floor((params.offset || 0) / (params.limit || 100)) + 1,
        limit: params.limit || 100,
        ...metrics,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch reviews',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
