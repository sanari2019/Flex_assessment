import { sql } from '@vercel/postgres';

async function setupDatabase() {
  console.log('🔧 Setting up database...');

  try {
    // Drop existing table if needed (comment out in production)
    // await sql`DROP TABLE IF EXISTS reviews CASCADE`;
    // console.log('✓ Dropped existing table');

    // Create reviews table
    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        hostaway_id INTEGER UNIQUE NOT NULL,
        listing_id VARCHAR(255) NOT NULL,
        listing_name TEXT NOT NULL,
        guest_name VARCHAR(255),
        rating DECIMAL(3,1),
        comment TEXT,
        categories JSONB,
        submitted_at TIMESTAMP NOT NULL,
        channel VARCHAR(50),
        review_type VARCHAR(50),
        status VARCHAR(50),
        approved_for_website BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✓ Created reviews table');

    // Create indexes
    await sql`
      CREATE INDEX IF NOT EXISTS idx_listing_approved
      ON reviews(listing_id, approved_for_website)
    `;
    console.log('✓ Created index: idx_listing_approved');

    await sql`
      CREATE INDEX IF NOT EXISTS idx_approved_date
      ON reviews(approved_for_website, submitted_at DESC)
    `;
    console.log('✓ Created index: idx_approved_date');

    await sql`
      CREATE INDEX IF NOT EXISTS idx_channel
      ON reviews(channel)
    `;
    console.log('✓ Created index: idx_channel');

    await sql`
      CREATE INDEX IF NOT EXISTS idx_rating
      ON reviews(rating)
    `;
    console.log('✓ Created index: idx_rating');

    console.log('✅ Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  }
}

setupDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
