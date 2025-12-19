export interface ReviewCategory {
  cleanliness: number | null;
  communication: number | null;
  checkIn: number | null;
  accuracy: number | null;
  location: number | null;
  value: number | null;
  respectHouseRules: number | null;
}

export interface Review {
  id: string;
  listingId: string;
  listingName: string;
  channel: 'airbnb' | 'booking' | 'direct' | 'vrbo' | 'google';
  type: 'guest' | 'host' | 'public';
  status: 'published' | 'pending' | 'hidden';
  submittedAt: string;
  stayDate: string;
  guestName: string;
  text: string;
  ratingOverall: number | null;
  categories: Partial<ReviewCategory>;
  approvedForWeb: boolean;
}

export interface Listing {
  id: string;
  name: string;
  address: string;
  city: string;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
}

export const mockListings: Listing[] = [
  // London Properties
  {
    id: '253093',
    name: 'Luxury Shoreditch Loft',
    address: '42 Rivington Street',
    city: 'London',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
  },
  {
    id: '253094',
    name: 'Covent Garden Studio',
    address: '15 Henrietta Street',
    city: 'London',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
  },
  {
    id: '253095',
    name: 'Notting Hill Townhouse',
    address: '78 Portobello Road',
    city: 'London',
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
  },
  {
    id: '253096',
    name: 'South Bank Penthouse',
    address: '200 Waterloo Road',
    city: 'London',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
  },
  {
    id: '253097',
    name: 'Bright Flat in Camberwell',
    address: '12 Denmark Hill',
    city: 'London',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
  },
  {
    id: '253098',
    name: 'Charming 2 Bed Flat in the Heart of Camden',
    address: '45 Camden High Street',
    city: 'London',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
  },
  // Paris Properties
  {
    id: '253200',
    name: 'Appartement Cozy et central a Paris',
    address: '25 Rue de Rivoli',
    city: 'Paris',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
  },
  {
    id: '253201',
    name: 'Luxueux Appartement Parisien - Champs-Élysées',
    address: '10 Avenue des Champs-Élysées',
    city: 'Paris',
    imageUrl: 'https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=800',
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
  },
  {
    id: '253202',
    name: 'Studio Moderne près du Louvre',
    address: '8 Rue du Louvre',
    city: 'Paris',
    imageUrl: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
    bedrooms: 0,
    bathrooms: 1,
    maxGuests: 2,
  },
  {
    id: '253203',
    name: 'Appartement avec Vue sur la Tour Eiffel',
    address: '15 Avenue de la Bourdonnais',
    city: 'Paris',
    imageUrl: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800',
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
  },
  // Algiers Properties
  {
    id: '253300',
    name: 'Luxueux 2 pièces rénové aux Sources',
    address: 'Cité Les Sources, Hydra',
    city: 'Algiers',
    imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
  },
  {
    id: '253301',
    name: 'Spacieux Appartement à Hydra',
    address: 'Rue des Frères Bouadou, Hydra',
    city: 'Algiers',
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
  },
  {
    id: '253302',
    name: 'Appartement de luxe à Hydra',
    address: '20 Chemin Mackley, Hydra',
    city: 'Algiers',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
  },
  {
    id: '253303',
    name: 'Appartement Princier 3 pièces',
    address: 'Boulevard des Martyrs',
    city: 'Algiers',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
  },
];

export const mockReviews: Review[] = [
  {
    id: 'rev-001',
    listingId: '253093',
    listingName: 'Luxury Shoreditch Loft',
    channel: 'airbnb',
    type: 'guest',
    status: 'published',
    submittedAt: '2025-12-10T14:30:00Z',
    stayDate: '2025-12-05',
    guestName: 'Sarah M.',
    text: 'Absolutely stunning apartment in the heart of Shoreditch! The space was immaculately clean, beautifully designed, and had everything we needed. The host was incredibly responsive and gave us great local recommendations. Would definitely stay again!',
    ratingOverall: 5.0,
    categories: {
      cleanliness: 5,
      communication: 5,
      checkIn: 5,
      accuracy: 5,
      location: 5,
      value: 4,
    },
    approvedForWeb: true,
  },
  {
    id: 'rev-002',
    listingId: '253093',
    listingName: 'Luxury Shoreditch Loft',
    channel: 'booking',
    type: 'guest',
    status: 'published',
    submittedAt: '2025-12-08T09:15:00Z',
    stayDate: '2025-12-01',
    guestName: 'Marco R.',
    text: 'Great location and very comfortable. The loft has a wonderful industrial aesthetic. Only minor issue was some street noise at night, but earplugs were provided which was thoughtful.',
    ratingOverall: 4.5,
    categories: {
      cleanliness: 5,
      communication: 4,
      checkIn: 5,
      accuracy: 4,
      location: 5,
      value: 4,
    },
    approvedForWeb: true,
  },
  {
    id: 'rev-003',
    listingId: '253093',
    listingName: 'Luxury Shoreditch Loft',
    channel: 'direct',
    type: 'guest',
    status: 'published',
    submittedAt: '2025-11-25T16:45:00Z',
    stayDate: '2025-11-20',
    guestName: 'Emma T.',
    text: 'Perfect for our weekend getaway. The apartment exceeded our expectations. Check-in was seamless with the smart lock system.',
    ratingOverall: 5.0,
    categories: {
      cleanliness: 5,
      communication: 5,
      checkIn: 5,
      accuracy: 5,
      location: 4,
      value: 5,
    },
    approvedForWeb: false,
  },
  {
    id: 'rev-004',
    listingId: '253094',
    listingName: 'Covent Garden Studio',
    channel: 'airbnb',
    type: 'guest',
    status: 'published',
    submittedAt: '2025-12-12T11:20:00Z',
    stayDate: '2025-12-08',
    guestName: 'James K.',
    text: 'Cozy studio in an unbeatable location. Steps away from theatres and restaurants. The space is compact but cleverly designed with all essentials.',
    ratingOverall: 4.0,
    categories: {
      cleanliness: 4,
      communication: 5,
      checkIn: 4,
      accuracy: 4,
      location: 5,
      value: 4,
    },
    approvedForWeb: true,
  },
  {
    id: 'rev-005',
    listingId: '253094',
    listingName: 'Covent Garden Studio',
    channel: 'vrbo',
    type: 'guest',
    status: 'published',
    submittedAt: '2025-11-30T08:00:00Z',
    stayDate: '2025-11-25',
    guestName: 'Lisa P.',
    text: 'Wonderful little studio! Clean, well-equipped kitchen, and super central. Perfect for solo travelers or couples.',
    ratingOverall: 4.5,
    categories: {
      cleanliness: 5,
      communication: 4,
      checkIn: 5,
      accuracy: 4,
      location: 5,
      value: 4,
    },
    approvedForWeb: true,
  },
  {
    id: 'rev-006',
    listingId: '253095',
    listingName: 'Notting Hill Townhouse',
    channel: 'airbnb',
    type: 'guest',
    status: 'published',
    submittedAt: '2025-12-14T13:00:00Z',
    stayDate: '2025-12-10',
    guestName: 'David & Family',
    text: 'Spacious townhouse perfect for families! The kids loved the garden and we were close to Portobello Market. Kitchen was fully equipped for home cooking. Host was extremely helpful with local tips.',
    ratingOverall: 5.0,
    categories: {
      cleanliness: 5,
      communication: 5,
      checkIn: 5,
      accuracy: 5,
      location: 5,
      value: 5,
    },
    approvedForWeb: true,
  },
  {
    id: 'rev-007',
    listingId: '253095',
    listingName: 'Notting Hill Townhouse',
    channel: 'booking',
    type: 'guest',
    status: 'published',
    submittedAt: '2025-12-01T10:30:00Z',
    stayDate: '2025-11-28',
    guestName: 'Chen W.',
    text: 'Beautiful Victorian home with modern amenities. The area is charming and quiet. Small issue with hot water on day one but was fixed promptly.',
    ratingOverall: 4.0,
    categories: {
      cleanliness: 4,
      communication: 5,
      checkIn: 4,
      accuracy: 4,
      location: 5,
      value: 4,
    },
    approvedForWeb: false,
  },
  {
    id: 'rev-008',
    listingId: '253096',
    listingName: 'South Bank Penthouse',
    channel: 'direct',
    type: 'guest',
    status: 'published',
    submittedAt: '2025-12-11T15:45:00Z',
    stayDate: '2025-12-07',
    guestName: 'Anna S.',
    text: 'Incredible views of the Thames and the city! The penthouse is luxurious and modern. Rooftop terrace was amazing for evening drinks. Truly a special stay.',
    ratingOverall: 5.0,
    categories: {
      cleanliness: 5,
      communication: 5,
      checkIn: 5,
      accuracy: 5,
      location: 5,
      value: 4,
    },
    approvedForWeb: true,
  },
  {
    id: 'rev-009',
    listingId: '253096',
    listingName: 'South Bank Penthouse',
    channel: 'airbnb',
    type: 'guest',
    status: 'published',
    submittedAt: '2025-11-28T12:00:00Z',
    stayDate: '2025-11-24',
    guestName: 'Robert J.',
    text: 'Top-notch accommodation! Everything was high quality. Location is ideal for tourists - Tate Modern and Borough Market nearby. Highly recommend.',
    ratingOverall: 4.5,
    categories: {
      cleanliness: 5,
      communication: 4,
      checkIn: 5,
      accuracy: 5,
      location: 5,
      value: 4,
    },
    approvedForWeb: true,
  },
  {
    id: 'rev-010',
    listingId: '253093',
    listingName: 'Luxury Shoreditch Loft',
    channel: 'google',
    type: 'public',
    status: 'published',
    submittedAt: '2025-11-15T18:30:00Z',
    stayDate: '2025-11-10',
    guestName: 'Michelle D.',
    text: 'Fantastic apartment with great vibes. The Shoreditch location is perfect for exploring East London. Well maintained and stylish.',
    ratingOverall: 4.0,
    categories: {
      cleanliness: 4,
      communication: null,
      checkIn: null,
      accuracy: null,
      location: 5,
      value: 4,
    },
    approvedForWeb: true,
  },
  {
    id: 'rev-011',
    listingId: '253094',
    listingName: 'Covent Garden Studio',
    channel: 'booking',
    type: 'guest',
    status: 'pending',
    submittedAt: '2025-12-15T09:00:00Z',
    stayDate: '2025-12-12',
    guestName: 'Thomas H.',
    text: 'Good value for central London. Studio is small but functional. WiFi was fast. Would book again for short trips.',
    ratingOverall: 3.5,
    categories: {
      cleanliness: 4,
      communication: 3,
      checkIn: 4,
      accuracy: 3,
      location: 5,
      value: 4,
    },
    approvedForWeb: false,
  },
  {
    id: 'rev-012',
    listingId: '253095',
    listingName: 'Notting Hill Townhouse',
    channel: 'direct',
    type: 'guest',
    status: 'published',
    submittedAt: '2025-11-20T14:15:00Z',
    stayDate: '2025-11-15',
    guestName: 'Sophie & Tom',
    text: 'Charming house in a lovely neighborhood. Perfect for our anniversary trip. The garden was a lovely bonus. Would definitely return!',
    ratingOverall: 5.0,
    categories: {
      cleanliness: 5,
      communication: 5,
      checkIn: 5,
      accuracy: 5,
      location: 5,
      value: 5,
    },
    approvedForWeb: true,
  },
];

// Helper functions
export const getReviewsByListing = (listingId: string) => 
  mockReviews.filter(r => r.listingId === listingId);

export const getApprovedReviews = (listingId?: string) => 
  mockReviews.filter(r => r.approvedForWeb && (!listingId || r.listingId === listingId));

export const getListingById = (id: string) => 
  mockListings.find(l => l.id === id);

export const calculateAverageRating = (reviews: Review[]) => {
  const rated = reviews.filter(r => r.rating !== null);
  if (rated.length === 0) return null;
  return rated.reduce((sum, r) => {
    const rating = typeof r.rating === 'string' ? parseFloat(r.rating) : r.rating;
    return sum + (rating || 0);
  }, 0) / rated.length;
};

export const getChannelCounts = (reviews: Review[]) => {
  return reviews.reduce((acc, r) => {
    acc[r.channel] = (acc[r.channel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

export const getCategoryAverages = (reviews: Review[]) => {
  const categories = ['cleanliness', 'communication', 'checkIn', 'accuracy', 'location', 'value'] as const;
  const result: Record<string, number | null> = {};
  
  categories.forEach(cat => {
    const values = reviews
      .map(r => r.categories[cat])
      .filter((v): v is number => v !== null && v !== undefined);
    
    result[cat] = values.length > 0 
      ? values.reduce((a, b) => a + b, 0) / values.length 
      : null;
  });
  
  return result;
};
