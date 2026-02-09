import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { toast } from 'sonner';

export function useGetPremiumStatus() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<boolean>({
    queryKey: ['premiumStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerPremium();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useUpgradeToPremium() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.upgradeToPremium();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['premiumStatus'] });
      toast.success('Welcome to Premium!', {
        description: 'Your subscription has been activated successfully.',
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to upgrade to Premium', {
        description: error.message || 'Please try again.',
      });
    },
  });
}

export function useCancelPremium() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.cancelPremium();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['premiumStatus'] });
      toast.success('Subscription cancelled', {
        description: 'Your Premium subscription has been cancelled.',
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to cancel subscription', {
        description: error.message || 'Please try again.',
      });
    },
  });
}
