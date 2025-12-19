/**
 * Detect the city/location from a listing name
 * Supports London, Paris, and Algiers with comprehensive pattern matching
 */
export function detectLocationFromName(listingName: string): 'London' | 'Paris' | 'Algiers' {
  const name = listingName.toLowerCase();

  // Check for Paris indicators
  if (name.includes('paris') || name.includes('parisien')) {
    return 'Paris';
  }

  // Check for Algiers indicators
  if (
    name.includes('algiers') ||
    name.includes('alger') ||
    name.includes('hydra') ||
    name.includes('sources') ||
    name.includes('appartement princier')
  ) {
    return 'Algiers';
  }

  // Check for London indicators (or default to London)
  // London neighborhoods and identifiers
  if (
    name.includes('london') ||
    name.includes('shoreditch') ||
    name.includes('morden') ||
    name.includes('fulham') ||
    name.includes('camberwell') ||
    name.includes('camden') ||
    name.includes('westminster') ||
    name.includes('bankside') ||
    name.includes('fields') ||
    name.includes('flex london')
  ) {
    return 'London';
  }

  // Default to London if no match
  return 'London';
}

/**
 * Check if a listing matches a specific location
 */
export function isListingInLocation(
  listingName: string,
  location: 'London' | 'Paris' | 'Algiers'
): boolean {
  return detectLocationFromName(listingName) === location;
}
