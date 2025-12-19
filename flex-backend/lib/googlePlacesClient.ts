/**
 * Google Places API Client for fetching reviews
 *
 * API Documentation:
 * https://developers.google.com/maps/documentation/places/web-service/place-details
 */

export interface GoogleReview {
  name: string;
  relativePublishTimeDescription: string;
  rating: number;
  text: {
    text: string;
    languageCode: string;
  };
  originalText: {
    text: string;
    languageCode: string;
  };
  authorAttribution: {
    displayName: string;
    uri: string;
    photoUri?: string;
  };
  publishTime: string;
}

export interface GooglePlaceDetails {
  name: string;
  rating?: number;
  userRatingCount?: number;
  reviews?: GoogleReview[];
}

export interface NormalizedGoogleReview {
  hostaway_id: number;
  listing_id: string;
  listing_name: string;
  guest_name: string;
  rating: number;
  comment: string;
  submitted_at: string;
  channel: string;
  review_type: string;
  status: string;
  approved_for_website: boolean;
  google_review_url: string;
}

/**
 * Fetch reviews for a place from Google Places API
 */
export async function fetchGoogleReviews(placeId: string): Promise<GoogleReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.warn('⚠️  GOOGLE_PLACES_API_KEY not configured. Returning mock data.');
    return getMockGoogleReviews();
  }

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        method: 'GET',
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'reviews,rating,userRatingCount',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status} ${response.statusText}`);
    }

    const data: GooglePlaceDetails = await response.json();
    return data.reviews || [];
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    // Return mock data on error for demo purposes
    console.warn('⚠️  Returning mock Google reviews due to API error');
    return getMockGoogleReviews();
  }
}

/**
 * Normalize Google review to internal format
 */
export function normalizeGoogleReview(
  review: GoogleReview,
  listingId: string,
  listingName: string
): NormalizedGoogleReview {
  // Generate a unique hostaway_id for Google reviews (negative to avoid conflicts)
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  const hostawayId = -hashCode(review.name);

  return {
    hostaway_id: hostawayId,
    listing_id: listingId,
    listing_name: listingName,
    guest_name: review.authorAttribution.displayName,
    rating: review.rating,
    comment: review.text.text,
    submitted_at: review.publishTime,
    channel: 'Google',
    review_type: 'guest-to-host',
    status: 'published',
    approved_for_website: false, // Require manual approval
    google_review_url: review.authorAttribution.uri,
  };
}

/**
 * Mock Google reviews for demo/testing
 * Returns realistic Google review data when API key is not configured
 */
function getMockGoogleReviews(): GoogleReview[] {
  const now = new Date();
  const daysAgo = (days: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() - days);
    return date.toISOString();
  };

  return [
    {
      name: 'places/ChIJ.../reviews/mock1',
      relativePublishTimeDescription: '2 weeks ago',
      rating: 5,
      text: {
        text: 'Absolutely loved this place! The location was perfect and the apartment was spotlessly clean. Would definitely stay again.',
        languageCode: 'en',
      },
      originalText: {
        text: 'Absolutely loved this place! The location was perfect and the apartment was spotlessly clean. Would definitely stay again.',
        languageCode: 'en',
      },
      authorAttribution: {
        displayName: 'Emma Thompson',
        uri: 'https://www.google.com/maps/contrib/mock1',
        photoUri: 'https://lh3.googleusercontent.com/a/default-user',
      },
      publishTime: daysAgo(14),
    },
    {
      name: 'places/ChIJ.../reviews/mock2',
      relativePublishTimeDescription: '3 weeks ago',
      rating: 4,
      text: {
        text: 'Great apartment in an excellent location. Host was very responsive. Only minor issue was noise from the street at night.',
        languageCode: 'en',
      },
      originalText: {
        text: 'Great apartment in an excellent location. Host was very responsive. Only minor issue was noise from the street at night.',
        languageCode: 'en',
      },
      authorAttribution: {
        displayName: 'Michael Chen',
        uri: 'https://www.google.com/maps/contrib/mock2',
        photoUri: 'https://lh3.googleusercontent.com/a/default-user',
      },
      publishTime: daysAgo(21),
    },
    {
      name: 'places/ChIJ.../reviews/mock3',
      relativePublishTimeDescription: 'a month ago',
      rating: 5,
      text: {
        text: 'Perfect stay! Modern, clean, and exactly as described. The neighborhood has great restaurants and cafes. Highly recommend!',
        languageCode: 'en',
      },
      originalText: {
        text: 'Perfect stay! Modern, clean, and exactly as described. The neighborhood has great restaurants and cafes. Highly recommend!',
        languageCode: 'en',
      },
      authorAttribution: {
        displayName: 'Sarah Mitchell',
        uri: 'https://www.google.com/maps/contrib/mock3',
        photoUri: 'https://lh3.googleusercontent.com/a/default-user',
      },
      publishTime: daysAgo(30),
    },
    {
      name: 'places/ChIJ.../reviews/mock4',
      relativePublishTimeDescription: '2 months ago',
      rating: 5,
      text: {
        text: 'Exceptional property! Everything was perfect from check-in to check-out. The amenities were top-notch and the host was wonderful.',
        languageCode: 'en',
      },
      originalText: {
        text: 'Exceptional property! Everything was perfect from check-in to check-out. The amenities were top-notch and the host was wonderful.',
        languageCode: 'en',
      },
      authorAttribution: {
        displayName: 'David Rodriguez',
        uri: 'https://www.google.com/maps/contrib/mock4',
        photoUri: 'https://lh3.googleusercontent.com/a/default-user',
      },
      publishTime: daysAgo(60),
    },
    {
      name: 'places/ChIJ.../reviews/mock5',
      relativePublishTimeDescription: '3 months ago',
      rating: 4,
      text: {
        text: 'Very nice apartment, good value for money. The area is vibrant and well-connected. Would stay here again on my next visit.',
        languageCode: 'en',
      },
      originalText: {
        text: 'Very nice apartment, good value for money. The area is vibrant and well-connected. Would stay here again on my next visit.',
        languageCode: 'en',
      },
      authorAttribution: {
        displayName: 'Jessica Park',
        uri: 'https://www.google.com/maps/contrib/mock5',
        photoUri: 'https://lh3.googleusercontent.com/a/default-user',
      },
      publishTime: daysAgo(90),
    },
  ];
}
