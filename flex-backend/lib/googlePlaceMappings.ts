/**
 * Google Place ID mappings for Flex Living properties
 *
 * To find Place IDs:
 * 1. Go to https://developers.google.com/maps/documentation/places/web-service/place-id
 * 2. Search for your property address
 * 3. Copy the Place ID
 *
 * Note: These are example Place IDs. Replace with actual Place IDs for your properties.
 */

export interface PlaceMapping {
  listingId: string;
  listingName: string;
  googlePlaceId: string;
  address: string;
  city: string;
}

export const googlePlaceMappings: PlaceMapping[] = [
  // London Properties
  {
    listingId: '253093',
    listingName: 'Luxury Shoreditch Loft - The Flex London',
    googlePlaceId: 'ChIJdd4hrwug2EcRmSrV3Vo6llI', // Example - Shoreditch, London
    address: '29 Shoreditch Heights, London',
    city: 'London'
  },
  {
    listingId: '253094',
    listingName: 'Covent Garden Studio - The Flex London',
    googlePlaceId: 'ChIJwZ-rKAsbdkgREB8gkVWiVkE', // Example - Covent Garden
    address: 'Covent Garden, London',
    city: 'London'
  },
  {
    listingId: '253095',
    listingName: 'Notting Hill Townhouse - The Flex London',
    googlePlaceId: 'ChIJ39UebIqHdkgRqitqJ6HRmhU', // Example - Notting Hill
    address: 'Notting Hill, London',
    city: 'London'
  },

  // Paris Properties
  {
    listingId: '253200',
    listingName: 'Appartement Cozy et central a Paris - The Flex Paris',
    googlePlaceId: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ', // Example - Central Paris
    address: 'Paris, France',
    city: 'Paris'
  },
  {
    listingId: '253201',
    listingName: 'Luxueux Appartement Parisien - Champs-Élysées - The Flex Paris',
    googlePlaceId: 'ChIJjx37cOxv5kcRP2lfJ0FbMIQ', // Example - Champs-Élysées
    address: 'Champs-Élysées, Paris',
    city: 'Paris'
  },

  // Algiers Properties
  {
    listingId: '253300',
    listingName: 'Luxueux 2 pièces rénové aux Sources - The Flex Algiers',
    googlePlaceId: 'ChIJATaHyKe6fxIRMG2I_eW9ag0', // Example - Algiers
    address: 'Les Sources, Algiers',
    city: 'Algiers'
  },
];

/**
 * Get Google Place ID for a listing
 */
export function getPlaceIdForListing(listingId: string): string | null {
  const mapping = googlePlaceMappings.find(m => m.listingId === listingId);
  return mapping?.googlePlaceId || null;
}

/**
 * Get all mapped listing IDs
 */
export function getMappedListingIds(): string[] {
  return googlePlaceMappings.map(m => m.listingId);
}

/**
 * Check if listing has Google Place mapping
 */
export function hasPlaceMapping(listingId: string): boolean {
  return googlePlaceMappings.some(m => m.listingId === listingId);
}
