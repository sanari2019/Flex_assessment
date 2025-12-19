import { NextRequest, NextResponse } from 'next/server';
import { fetchGoogleReviews, normalizeGoogleReview } from '@/lib/googlePlacesClient';
import { getPlaceIdForListing, googlePlaceMappings } from '@/lib/googlePlaceMappings';

/**
 * GET /api/reviews/google
 *
 * Fetch Google Reviews for a specific listing or all mapped listings
 *
 * Query params:
 * - listingId: specific listing ID (optional)
 *
 * Examples:
 * - GET /api/reviews/google?listingId=253093
 * - GET /api/reviews/google (fetches for all mapped listings)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const listingId = searchParams.get('listingId');

    // If specific listing requested
    if (listingId) {
      const placeId = getPlaceIdForListing(listingId);

      if (!placeId) {
        return NextResponse.json(
          {
            success: false,
            error: 'No Google Place ID mapping found for this listing',
            message: `Listing ${listingId} is not mapped to a Google Place. Add mapping in googlePlaceMappings.ts`,
          },
          { status: 404 }
        );
      }

      const mapping = googlePlaceMappings.find(m => m.listingId === listingId);
      if (!mapping) {
        return NextResponse.json(
          { success: false, error: 'Listing not found' },
          { status: 404 }
        );
      }

      console.log(`📍 Fetching Google reviews for ${mapping.listingName}...`);
      const reviews = await fetchGoogleReviews(placeId);

      const normalizedReviews = reviews.map(review =>
        normalizeGoogleReview(review, listingId, mapping.listingName)
      );

      return NextResponse.json({
        success: true,
        data: normalizedReviews,
        meta: {
          total: normalizedReviews.length,
          listingId: listingId,
          listingName: mapping.listingName,
          googlePlaceId: placeId,
          source: 'Google Places API',
        },
      });
    }

    // Fetch for all mapped listings
    console.log(`📍 Fetching Google reviews for all ${googlePlaceMappings.length} mapped properties...`);

    const allReviews = [];

    for (const mapping of googlePlaceMappings) {
      try {
        const reviews = await fetchGoogleReviews(mapping.googlePlaceId);
        const normalized = reviews.map(review =>
          normalizeGoogleReview(review, mapping.listingId, mapping.listingName)
        );
        allReviews.push(...normalized);
      } catch (error) {
        console.error(`Error fetching reviews for ${mapping.listingName}:`, error);
        // Continue with other properties even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      data: allReviews,
      meta: {
        total: allReviews.length,
        propertiesCount: googlePlaceMappings.length,
        source: 'Google Places API',
      },
    });
  } catch (error) {
    console.error('Error in Google reviews endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Google reviews',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
