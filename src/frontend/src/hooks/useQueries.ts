import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '../backend';
import { toast } from 'sonner';

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to save profile', {
        description: error.message || 'Please try again.',
      });
    },
  });
}

export function useLikeTemplatePost() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.likeTemplatePost(postId);
    },
    onError: (error: Error) => {
      toast.error('Failed to like post', {
        description: error.message || 'Please try again.',
      });
    },
  });
}

export function useRepostTemplate() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.repostTemplate(postId);
    },
    onError: (error: Error) => {
      toast.error('Failed to repost', {
        description: error.message || 'Please try again.',
      });
    },
  });
}
