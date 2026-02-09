import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { VideoFile } from '../backend';

export function useVideoFile(videoId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<VideoFile | null>({
    queryKey: ['videoFile', videoId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getVideoFile(videoId);
    },
    enabled: !!actor && !isFetching && videoId > 0n,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
