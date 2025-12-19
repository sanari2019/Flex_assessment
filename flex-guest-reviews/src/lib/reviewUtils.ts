import type { Review } from '@/lib/api';

/**
 * Calculate the average rating from a list of reviews
 */
export const calculateAverageRating = (reviews: Review[]): number | null => {
  const rated = reviews.filter(r => r.rating !== null);
  if (rated.length === 0) return null;

  return rated.reduce((sum, r) => {
    const rating = typeof r.rating === 'string' ? parseFloat(r.rating) : r.rating;
    return sum + (rating || 0);
  }, 0) / rated.length;
};

/**
 * Calculate average ratings for each category across reviews
 */
export const getCategoryAverages = (reviews: Review[]): Record<string, number | null> => {
  const categoryKeys = ['cleanliness', 'communication', 'respect_house_rules', 'location', 'value'] as const;
  const result: Record<string, number | null> = {};

  categoryKeys.forEach(key => {
    const values = reviews
      .map(r => r.categories?.[key])
      .filter((v): v is number => v !== null && v !== undefined);

    result[key] = values.length > 0
      ? values.reduce((a, b) => a + b, 0) / values.length
      : null;
  });

  return result;
};

/**
 * Get count of reviews by channel
 */
export const getChannelCounts = (reviews: Review[]): Record<string, number> => {
  return reviews.reduce((acc, r) => {
    acc[r.channel] = (acc[r.channel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};
