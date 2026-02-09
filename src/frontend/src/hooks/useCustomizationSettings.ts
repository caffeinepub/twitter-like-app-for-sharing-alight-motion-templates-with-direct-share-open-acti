import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CustomizationSettings } from '../backend';
import { toast } from 'sonner';

export function useGetCustomizationSettings() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<CustomizationSettings | null>({
    queryKey: ['customizationSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCustomizationSettings();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCustomizationSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: CustomizationSettings) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCustomizationSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customizationSettings'] });
      toast.success('Settings saved successfully!', {
        description: 'Your customization settings have been updated.',
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to save settings', {
        description: error.message || 'Please try again.',
      });
    },
  });
}
