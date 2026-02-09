import { useVideoFile } from '../hooks/useVideoFile';
import { Loader2 } from 'lucide-react';

interface PostVideoProps {
  videoId: bigint;
  className?: string;
}

export default function PostVideo({ videoId, className = '' }: PostVideoProps) {
  const { data: videoFile, isLoading, error } = useVideoFile(videoId);

  if (isLoading) {
    return (
      <div className={`w-full aspect-video bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !videoFile) {
    return (
      <div className={`w-full aspect-video bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-sm text-muted-foreground">Video unavailable</p>
      </div>
    );
  }

  const videoUrl = videoFile.blob.getDirectURL();

  return (
    <video
      src={videoUrl}
      controls
      className={`w-full rounded-lg ${className}`}
    >
      Your browser does not support the video tag.
    </video>
  );
}
