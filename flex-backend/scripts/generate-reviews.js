const fs = require('fs');
const path = require('path');

// Property definitions matching mockListings.ts
const properties = [
  // London Properties
  { id: '253093', name: 'Luxury Shoreditch Loft - The Flex London', city: 'London' },
  { id: '253094', name: 'Covent Garden Studio - The Flex London', city: 'London' },
  { id: '253095', name: 'Notting Hill Townhouse - The Flex London', city: 'London' },
  { id: '253096', name: 'South Bank Penthouse - The Flex London', city: 'London' },
  { id: '253097', name: 'Bright Flat in Camberwell - The Flex London', city: 'London' },
  { id: '253098', name: 'Charming 2 Bed Flat in the Heart of Camden - The Flex London', city: 'London' },
  // Paris Properties
  { id: '253200', name: 'Appartement Cozy et central a Paris - The Flex Paris', city: 'Paris' },
  { id: '253201', name: 'Luxueux Appartement Parisien - Champs-Élysées - The Flex Paris', city: 'Paris' },
  { id: '253202', name: 'Studio Moderne près du Louvre - The Flex Paris', city: 'Paris' },
  { id: '253203', name: 'Appartement avec Vue sur la Tour Eiffel - The Flex Paris', city: 'Paris' },
  // Algiers Properties
  { id: '253300', name: 'Luxueux 2 pièces rénové aux Sources - The Flex Algiers', city: 'Algiers' },
  { id: '253301', name: 'Spacieux Appartement à Hydra - The Flex Algiers', city: 'Algiers' },
  { id: '253302', name: 'Appartement de luxe à Hydra - The Flex Algiers', city: 'Algiers' },
  { id: '253303', name: 'Appartement Princier 3 pièces - The Flex Algiers', city: 'Algiers' },
];

// Guest names pool
const guestNames = [
  'Sarah Mitchell', 'Michael Chen', 'Emma Thompson', 'David Rodriguez',
  'Jessica Park', 'Thomas Anderson', 'Olivia Martinez', 'James Wilson',
  'Sophia Lewis', 'Daniel Kim', 'Isabella Garcia', 'Matthew Taylor',
  'Ava Brown', 'Ryan Johnson', 'Mia Davis', 'Christopher Lee',
  'Charlotte Moore', 'Andrew White', 'Amelia Harris', 'Joshua Martin',
  'Emily Clark', 'Nathan Wright', 'Harper Robinson', 'Ethan Walker',
  'Ella Scott', 'Lucas Young', 'Grace King', 'Benjamin Adams',
  'Lily Nelson', 'Alexander Baker', 'Hannah Hall', 'William Hill',
  'Zoe Allen', 'Samuel Green', 'Chloe Campbell', 'Jack Turner',
  'Victoria Parker', 'Henry Evans', 'Aria Collins', 'Dylan Stewart',
  'Madison Morris', 'Logan Murphy', 'Scarlett Rivera', 'Mason Cooper',
  'Layla Reed', 'Jacob Bailey', 'Nora Howard', 'Sebastian Ward',
  'Evelyn Russell', 'Oliver Hughes', 'Abigail Price', 'Noah Bennett',
  'Aubrey Wood', 'Elijah Barnes', 'Addison Foster', 'Liam Sanders',
  'Luna Myers', 'Aiden Jenkins', 'Hazel Perry', 'Jackson Powell',
  'Penelope Long', 'Carter Patterson', 'Aurora Hughes', 'Wyatt Cox'
];

// Review templates by rating range
const reviewTemplates = {
  excellent: [
    'Absolutely loved this place! The location was perfect and the apartment was spotlessly clean. Host was very responsive and helpful throughout our stay.',
    'Exceptional experience from start to finish. The property exceeded our expectations in every way. Modern, stylish, and incredibly well-maintained.',
    'Wonderful stay! The apartment was beautifully furnished and had everything we needed. Check-in was seamless and the location couldn\'t be better.',
    'Outstanding property! Every detail was thought through. Super clean, beautifully decorated, and in the best neighborhood.',
    'Fantastic apartment! Very spacious and well-equipped. The bed was super comfortable. Would absolutely stay again on my next visit.',
    'Perfect location and absolutely beautiful apartment. Everything was exactly as described. The host was wonderful and very accommodating.',
    'Amazing stay! The apartment is stunning, clean, and has all the amenities you could need. Great communication from the host.',
    'Couldn\'t have asked for a better place to stay. The apartment was pristine, modern, and in an excellent location.',
    'This place is incredible! Beautiful decor, spotlessly clean, and the perfect base for exploring the city.',
    'Exceptional apartment in a prime location. Everything was perfect from check-in to check-out. Highly recommend!'
  ],
  good: [
    'Great apartment in a fantastic location. A few minor issues but overall a very comfortable stay. Would definitely recommend.',
    'Really enjoyed our time here. The space was clean, modern, and comfortable. Only minor complaint was noise on weekends.',
    'Good experience overall. The apartment matched the photos and was in a convenient location. Host was quick to respond.',
    'Nice stay overall. The apartment was well-maintained and the location was convenient. Would stay here again.',
    'Lovely apartment with good amenities. Clean and comfortable. The area is great with lots of restaurants nearby.',
    'Solid choice for accommodation. The apartment was clean and had everything we needed. Check-in process was smooth.',
    'Pleasant stay in a good location. The apartment was as described and the host was helpful with recommendations.',
    'Comfortable apartment with a great location. Minor issues with WiFi but otherwise everything was good.',
    'Well-maintained apartment in a convenient area. Good value for money and the host was responsive.',
    'Nice place with good facilities. The location is excellent for getting around. Would recommend to friends.'
  ],
  average: [
    'Decent place for the price. Location is good but the apartment could use some updates. Staff were helpful when we had questions.',
    'Average stay. The location was convenient but the apartment felt a bit cramped. WiFi was excellent though.',
    'Okay apartment, nothing special. It was clean and functional but lacking character. Good for a short stay.',
    'Fair value for money. The apartment was decent but could use better maintenance. Location was the main positive.',
    'Reasonable place to stay. Met basic needs but not as comfortable as hoped. Good location though.',
    'Standard apartment, nothing particularly great or bad. Clean enough and functional for our purposes.',
    'Acceptable accommodation. The apartment was fine for a few nights but wouldn\'t choose for a longer stay.',
    'Mixed feelings about this place. Location is good but the apartment needs updates. Host was responsive at least.',
    'Just okay. The apartment served its purpose but was quite basic. Price was fair for what you get.',
    'Adequate for a short stay. Clean but dated. The main advantage is the location which is very convenient.'
  ]
};

const channels = ['Airbnb', 'Booking.com', 'Direct', 'Google'];
const statuses = ['published', 'published', 'published', 'pending']; // 75% published

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRating() {
  // Generate ratings with realistic distribution (scale 0-5)
  const rand = Math.random();
  if (rand < 0.5) return parseFloat((4.5 + Math.random() * 0.5).toFixed(1)); // 50% excellent (4.5-5.0)
  if (rand < 0.85) return parseFloat((3.5 + Math.random()).toFixed(1)); // 35% good (3.5-4.5)
  return parseFloat((2.5 + Math.random()).toFixed(1)); // 15% average (2.5-3.5)
}

function generateCategoryRating(overallRating) {
  // Category ratings slightly vary from overall (scale 0-5)
  const base = Math.round(overallRating);
  const variance = getRandomInt(-1, 1);
  return Math.max(1, Math.min(5, base + variance));
}

function getReviewText(rating) {
  if (rating >= 4.5) return getRandomElement(reviewTemplates.excellent);
  if (rating >= 3.5) return getRandomElement(reviewTemplates.good);
  return getRandomElement(reviewTemplates.average);
}

function generateDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

// Generate reviews
const reviews = [];
let reviewId = 7453;

properties.forEach((property, propIndex) => {
  // Generate 10-12 reviews per property
  const reviewCount = getRandomInt(10, 12);

  for (let i = 0; i < reviewCount; i++) {
    const rating = generateRating();
    const daysAgo = getRandomInt(1, 180); // Reviews from last 6 months

    const review = {
      id: reviewId++,
      type: 'guest-to-host',
      status: getRandomElement(statuses),
      rating: rating,
      publicReview: getReviewText(rating),
      reviewCategory: [
        { category: 'cleanliness', rating: generateCategoryRating(rating) },
        { category: 'communication', rating: generateCategoryRating(rating) },
        { category: 'respect_house_rules', rating: generateCategoryRating(rating) },
        { category: 'location', rating: generateCategoryRating(rating) },
        { category: 'value', rating: generateCategoryRating(rating) }
      ],
      submittedAt: generateDate(daysAgo),
      guestName: getRandomElement(guestNames),
      listingName: property.name,
      listingId: property.id,
      channel: getRandomElement(channels)
    };

    reviews.push(review);
  }
});

// Sort by date (newest first)
reviews.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

// Write to file
const outputPath = path.join(__dirname, '../lib/mockReviews.json');
fs.writeFileSync(outputPath, JSON.stringify(reviews, null, 2));

console.log(`✅ Generated ${reviews.length} reviews for ${properties.length} properties`);
console.log(`📊 Reviews per property: ${Math.floor(reviews.length / properties.length)}-${Math.ceil(reviews.length / properties.length)}`);
console.log(`💾 Saved to: ${outputPath}`);
