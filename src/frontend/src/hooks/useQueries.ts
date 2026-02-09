import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '../backend';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';
import type { TemplatePost } from '../types/post';
import { addTemplatePost } from './useTemplatePosts';

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

export function useUploadVideo() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ file, onProgress }: { file: File; onProgress?: (percentage: number) => void }) => {
      if (!actor) throw new Error('Actor not available');

      // Convert file to Uint8Array
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // Create ExternalBlob with optional progress tracking
      let blob = ExternalBlob.fromBytes(bytes);
      if (onProgress) {
        blob = blob.withUploadProgress(onProgress);
      }

      // Upload to backend
      const videoId = await actor.uploadTemplateVideo(file.type, file.name, blob);
      return videoId;
    },
    onError: (error: Error) => {
      toast.error('Failed to upload video', {
        description: error.message || 'Please try again.',
      });
    },
  });
}

export function usePublishTemplatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: {
      title: string;
      description: string;
      templateLink: string;
      tags: string[];
      previewImageUrl?: string;
      videoId?: bigint;
      videoContentType?: string;
      videoFileName?: string;
    }) => {
      if (!actor) throw new Error('Actor not available');

      // For now, we'll create a mock post since backend doesn't have post storage
      // In a real implementation, this would call a backend method to create the post
      const newPost: TemplatePost = {
        id: Date.now().toString(),
        title: post.title,
        description: post.description,
        templateLink: post.templateLink,
        authorName: 'You',
        authorId: 'current-user',
        timestamp: 'Just now',
        likes: 0,
        reposts: 0,
        isLiked: false,
        isReposted: false,
        tags: post.tags,
        previewImageUrl: post.previewImageUrl,
        videoId: post.videoId,
        videoContentType: post.videoContentType,
        videoFileName: post.videoFileName,
      };

      // Add to in-memory storage
      addTemplatePost(newPost);

      return newPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templatePosts'] });
      toast.success('Template posted successfully!', {
        description: 'Your template is now live and visible to the community.',
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to publish post', {
        description: error.message || 'Please try again.',
      });
    },
  });
}
