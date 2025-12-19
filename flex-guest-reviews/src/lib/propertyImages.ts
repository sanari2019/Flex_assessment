/**
 * Property image mappings for dashboard
 * Maps listing IDs to high-quality property images
 */

export const propertyImageMap: Record<string, string> = {
  // London Properties
  '253093': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop', // Modern loft
  '253094': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop', // Luxury apartment
  '253095': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop', // Contemporary flat
  '253096': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop', // Elegant home
  '253097': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop', // Modern residence
  '253098': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop', // Urban apartment

  // Paris Properties
  '253203': 'https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=400&h=300&fit=crop', // Paris apartment
  '253204': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop', // Parisian flat
  '253205': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop', // Paris residence
  '253206': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop', // Classic Paris

  // Algiers Properties
  '253313': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop', // Modern apartment
  '253314': 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop', // Coastal property
  '253315': 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop', // Mediterranean villa
  '253316': 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=400&h=300&fit=crop', // Contemporary home
};

/**
 * Get image URL for a property by listing ID
 * Returns a default placeholder if no mapping exists
 */
export function getPropertyImage(listingId: string): string {
  return propertyImageMap[listingId] ||
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop';
}
