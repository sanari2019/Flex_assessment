import { sql } from '@vercel/postgres';
import { Review, ReviewQueryParams } from './types';

export async function getReviews(params: ReviewQueryParams = {}): Promise<Review[]> {
  const {
    listingId,
    channel,
    type,
    ratingMin,
    dateStart,
    dateEnd,
    approvedOnly,
    limit = 100,
    offset = 0,
  } = params;

  let query = 'SELECT * FROM reviews WHERE 1=1';
  const queryParams: any[] = [];
  let paramIndex = 1;

  if (listingId) {
    queryParams.push(listingId);
    query += ` AND listing_id = $${paramIndex++}`;
  }

  if (channel) {
    queryParams.push(channel);
    query += ` AND channel = $${paramIndex++}`;
  }

  if (type) {
    queryParams.push(type);
    query += ` AND review_type = $${paramIndex++}`;
  }

  if (ratingMin !== undefined) {
    queryParams.push(ratingMin);
    query += ` AND rating >= $${paramIndex++}`;
  }

  if (dateStart) {
    queryParams.push(dateStart);
    query += ` AND submitted_at >= $${paramIndex++}`;
  }

  if (dateEnd) {
    queryParams.push(dateEnd);
    query += ` AND submitted_at <= $${paramIndex++}`;
  }

  if (approvedOnly) {
    query += ' AND approved_for_website = true';
  }

  query += ' ORDER BY submitted_at DESC';

  queryParams.push(limit);
  query += ` LIMIT $${paramIndex++}`;

  queryParams.push(offset);
  query += ` OFFSET $${paramIndex++}`;

  const { rows } = await sql.query(query, queryParams);
  return rows as Review[];
}

export async function getReviewById(id: number): Promise<Review | null> {
  const { rows } = await sql.query('SELECT * FROM reviews WHERE id = $1', [id]);
  return rows.length > 0 ? (rows[0] as Review) : null;
}

export async function updateReviewApproval(id: number, approved: boolean): Promise<Review | null> {
  const { rows } = await sql.query(
    'UPDATE reviews SET approved_for_website = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [approved, id]
  );
  return rows.length > 0 ? (rows[0] as Review) : null;
}

export async function calculateMetrics(reviews: Review[]) {
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      categoryAverages: {},
    };
  }

  const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  const averageRating = totalRating / reviews.filter(r => r.rating !== null).length || 0;

  const categoryTotals: { [key: string]: { sum: number; count: number } } = {};

  reviews.forEach(review => {
    if (review.categories) {
      Object.entries(review.categories).forEach(([category, rating]) => {
        if (rating !== undefined && rating !== null) {
          if (!categoryTotals[category]) {
            categoryTotals[category] = { sum: 0, count: 0 };
          }
          categoryTotals[category].sum += rating;
          categoryTotals[category].count += 1;
        }
      });
    }
  });

  const categoryAverages: { [key: string]: number } = {};
  Object.entries(categoryTotals).forEach(([category, { sum, count }]) => {
    categoryAverages[category] = parseFloat((sum / count).toFixed(2));
  });

  return {
    averageRating: parseFloat(averageRating.toFixed(2)),
    categoryAverages,
  };
}
