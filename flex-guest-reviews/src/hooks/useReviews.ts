import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchReviews, fetchReviewById, updateReviewApproval, ReviewQueryParams } from '@/lib/api';
import { toast } from 'sonner';

/**
 * Hook to fetch all reviews with filters
 */
export function useReviews(params: ReviewQueryParams = {}) {
  return useQuery({
    queryKey: ['reviews', params],
    queryFn: () => fetchReviews(params),
    // For public pages (approvedOnly), use shorter staleTime for real-time updates
    // For dashboard, use longer staleTime for better performance
    staleTime: params.approvedOnly ? 1000 * 30 : 1000 * 60 * 5, // 30s for public, 5min for dashboard
    refetchOnWindowFocus: params.approvedOnly ? true : false, // Auto-refetch on focus for public pages
  });
}

/**
 * Hook to fetch a single review
 */
export function useReview(id: number) {
  return useQuery({
    queryKey: ['review', id],
    queryFn: () => fetchReviewById(id),
    enabled: !!id,
  });
}

/**
 * Hook to update review approval status with optimistic updates
 */
export function useUpdateReviewApproval() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, approved }: { id: number; approved: boolean }) =>
      updateReviewApproval(id, approved),

    // Optimistic update
    onMutate: async ({ id, approved }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['reviews'] });

      // Get all review queries and update each based on its filter params
      const queries = queryClient.getQueriesData({ queryKey: ['reviews'] });
      const previousData = new Map(queries);

      queries.forEach(([queryKey, oldData]) => {
        const params = (queryKey as any[])[1] || {};
        const isPublicQuery = params.approvedOnly === true;

        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old) return old;

          if (isPublicQuery && !approved) {
            // Remove disapproved reviews from public pages immediately
            return {
              ...old,
              data: old.data.filter((review: any) => review.id !== id),
              meta: old.meta ? {
                ...old.meta,
                total: Math.max(0, (old.meta.total || 0) - 1)
              } : old.meta
            };
          } else if (isPublicQuery && approved) {
            // For public pages, don't add newly approved reviews here
            // Let the refetch handle it to ensure proper ordering
            return old;
          } else {
            // For dashboard, just update the approval status
            return {
              ...old,
              data: old.data.map((review: any) =>
                review.id === id ? { ...review, approved_for_website: approved } : review
              ),
            };
          }
        });
      });

      return { previousData };
    },

    // On error, rollback
    onError: (err, variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to update review approval');
    },

    // On success
    onSuccess: (data, variables) => {
      toast.success(
        variables.approved
          ? 'Review approved for website'
          : 'Review removed from website'
      );
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
