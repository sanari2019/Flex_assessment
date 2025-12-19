/**
 * Geographic coordinates and addresses for all properties
 * Used for map display on the properties listing page
 */

export interface PropertyLocation {
  id: string;
  name: string;
  city: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  price: number;
  rating: number;
  imageUrl: string;
}

export const propertyLocations: PropertyLocation[] = [
  // London Properties
  {
    id: '253093',
    name: 'Luxury Shoreditch Loft - The Flex London',
    city: 'London',
    address: '29 Shoreditch Heights, London E1 6JE, UK',
    coordinates: { lat: 51.5244, lng: -0.0799 },
    price: 250,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
  },
  {
    id: '253094',
    name: 'Elegant Mayfair Suite - The Flex London',
    city: 'London',
    address: '45 Park Lane, Mayfair, London W1K 1PN, UK',
    coordinates: { lat: 51.5074, lng: -0.1489 },
    price: 320,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
  },
  {
    id: '253095',
    name: 'Contemporary Camden Flat - The Flex London',
    city: 'London',
    address: '78 Camden High Street, London NW1 0LT, UK',
    coordinates: { lat: 51.5392, lng: -0.1426 },
    price: 200,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
  },
  {
    id: '253096',
    name: 'Chic Notting Hill Home - The Flex London',
    city: 'London',
    address: '12 Portobello Road, Notting Hill, London W11 2DZ, UK',
    coordinates: { lat: 51.5155, lng: -0.2052 },
    price: 280,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
  },
  {
    id: '253097',
    name: 'Stylish Kensington Residence - The Flex London',
    city: 'London',
    address: '23 Kensington Church Street, London W8 4EP, UK',
    coordinates: { lat: 51.5010, lng: -0.1932 },
    price: 310,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
  },
  {
    id: '253098',
    name: 'Modern Covent Garden Apartment - The Flex London',
    city: 'London',
    address: '56 Long Acre, Covent Garden, London WC2E 9JE, UK',
    coordinates: { lat: 51.5128, lng: -0.1243 },
    price: 290,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
  },

  // Paris Properties
  {
    id: '253203',
    name: 'Appartement avec Vue sur la Tour Eiffel - The Flex Paris',
    city: 'Paris',
    address: '15 Avenue de la Bourdonnais, 75007 Paris, France',
    coordinates: { lat: 48.8584, lng: 2.2945 },
    price: 270,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=400&h=300&fit=crop',
  },
  {
    id: '253204',
    name: 'Studio Moderne Marais - The Flex Paris',
    city: 'Paris',
    address: '32 Rue des Francs Bourgeois, 75003 Paris, France',
    coordinates: { lat: 48.8570, lng: 2.3639 },
    price: 220,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop',
  },
  {
    id: '253205',
    name: 'Luxe Latin Quarter Flat - The Flex Paris',
    city: 'Paris',
    address: '8 Rue de la Huchette, 75005 Paris, France',
    coordinates: { lat: 48.8530, lng: 2.3458 },
    price: 240,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop',
  },
  {
    id: '253206',
    name: 'Charming Saint-Germain Apartment - The Flex Paris',
    city: 'Paris',
    address: '42 Rue Bonaparte, 75006 Paris, France',
    coordinates: { lat: 48.8543, lng: 2.3330 },
    price: 260,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
  },

  // Algiers Properties
  {
    id: '253313',
    name: 'Modern Mediterranean Villa - The Flex Algiers',
    city: 'Algiers',
    address: '25 Rue Didouche Mourad, Algiers 16000, Algeria',
    coordinates: { lat: 36.7538, lng: 3.0588 },
    price: 180,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
  },
  {
    id: '253314',
    name: 'Coastal Luxury Apartment - The Flex Algiers',
    city: 'Algiers',
    address: '15 Boulevard Mohamed V, Algiers 16030, Algeria',
    coordinates: { lat: 36.7650, lng: 3.0500 },
    price: 160,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop',
  },
  {
    id: '253315',
    name: 'Contemporary Algiers Residence - The Flex Algiers',
    city: 'Algiers',
    address: '8 Avenue Pasteur, Algiers 16000, Algeria',
    coordinates: { lat: 36.7489, lng: 3.0544 },
    price: 170,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop',
  },
  {
    id: '253316',
    name: 'Elegant City Center Flat - The Flex Algiers',
    city: 'Algiers',
    address: '12 Rue Ben M\'hidi, Algiers 16000, Algeria',
    coordinates: { lat: 36.7696, lng: 3.0633 },
    price: 190,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=400&h=300&fit=crop',
  },
];

/**
 * Get center coordinates for a city
 */
export const getCityCenter = (city: string): { lat: number; lng: number } => {
  const centers: Record<string, { lat: number; lng: number }> = {
    london: { lat: 51.5074, lng: -0.1278 },
    paris: { lat: 48.8566, lng: 2.3522 },
    algiers: { lat: 36.7538, lng: 3.0588 },
  };

  return centers[city.toLowerCase()] || centers.london;
};

/**
 * Get properties filtered by city
 */
export const getPropertiesByCity = (city: string): PropertyLocation[] => {
  if (city === 'all') return propertyLocations;
  return propertyLocations.filter(
    p => p.city.toLowerCase() === city.toLowerCase()
  );
};
