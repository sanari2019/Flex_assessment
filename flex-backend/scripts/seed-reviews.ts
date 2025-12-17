import { sql } from '@vercel/postgres';
import mockReviews from '../lib/mockReviews.json';

async function seedReviews() {
  console.log('🌱 Seeding database with mock reviews...');

  try {
    let inserted = 0;
    let skipped = 0;

    for (const review of mockReviews) {
      try {
        // Convert reviewCategory array to JSON object
        const categories: { [key: string]: number } = {};
        review.reviewCategory.forEach((cat) => {
          categories[cat.category] = cat.rating;
        });

        await sql`
          INSERT INTO reviews (
            hostaway_id,
            listing_id,
            listing_name,
            guest_name,
            rating,
            comment,
            categories,
            submitted_at,
            channel,
            review_type,
            status,
            approved_for_website
          ) VALUES (
            ${review.id},
            ${review.listingId},
            ${review.listingName},
            ${review.guestName},
            ${review.rating},
            ${review.publicReview},
            ${JSON.stringify(categories)},
            ${review.submittedAt},
            ${review.channel},
            ${review.type},
            ${review.status},
            ${Math.random() > 0.5}
          )
          ON CONFLICT (hostaway_id) DO NOTHING
        `;
        inserted++;
        console.log(`✓ Inserted review ${review.id} - ${review.guestName}`);
      } catch (error: any) {
        if (error.message.includes('duplicate key')) {
          skipped++;
          console.log(`⊘ Skipped duplicate review ${review.id}`);
        } else {
          throw error;
        }
      }
    }

    console.log(`\n✅ Seeding completed!`);
    console.log(`   Inserted: ${inserted} reviews`);
    console.log(`   Skipped: ${skipped} reviews (duplicates)`);

    // Show summary
    const { rows } = await sql`
      SELECT
        COUNT(*) as total,
        AVG(rating) as avg_rating,
        COUNT(*) FILTER (WHERE approved_for_website = true) as approved
      FROM reviews
    `;

    console.log(`\n📊 Database Summary:`);
    console.log(`   Total reviews: ${rows[0].total}`);
    console.log(`   Average rating: ${parseFloat(rows[0].avg_rating).toFixed(2)}`);
    console.log(`   Approved for website: ${rows[0].approved}`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

seedReviews()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
