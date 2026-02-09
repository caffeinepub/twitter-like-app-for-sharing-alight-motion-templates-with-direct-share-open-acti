import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { toast } from 'sonner';

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
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

export function useAdminLogin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      const success = await actor.loginAdmin(username, password);
      if (!success) {
        throw new Error('Invalid credentials');
      }
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
      toast.success('Admin login successful', {
        description: 'You now have admin access.',
      });
    },
    onError: (error: Error) => {
      toast.error('Admin login failed', {
        description: error.message || 'Invalid username or password.',
      });
    },
  });
}

export function useAdminLogout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.logoutAdmin();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
      toast.success('Admin logout successful', {
        description: 'You have been logged out from admin access.',
      });
    },
    onError: (error: Error) => {
      toast.error('Admin logout failed', {
        description: error.message || 'Please try again.',
      });
    },
  });
}
