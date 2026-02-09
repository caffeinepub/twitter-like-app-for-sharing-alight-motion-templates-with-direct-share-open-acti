import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Repeat2, ExternalLink, Download, Play } from 'lucide-react';
import { shareToAlightMotion } from '../utils/shareToAlightMotion';
import { directDownload } from '../utils/directDownload';
import PostVideo from './PostVideo';
import type { TemplatePost } from '../types/post';

interface PostCardProps {
  post: TemplatePost;
  onLike?: () => void;
  onRepost?: () => void;
}

export default function PostCard({ post, onLike, onRepost }: PostCardProps) {
  const authorInitials = post.authorName
    ? post.authorName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const handleShare = () => {
    shareToAlightMotion(post.templateLink, post.title);
  };

  const handleDownload = () => {
    directDownload(post.templateLink, post.title);
  };

  const hasVideo = post.videoId && post.videoId > 0n;

  return (
    <Card className="glass-surface overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/20 text-primary text-sm">{authorInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold leading-none">{post.authorName}</p>
              <p className="text-xs text-muted-foreground mt-1">{post.timestamp}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <Link to="/post/$postId" params={{ postId: post.id }} className="block">
        <CardContent className="space-y-3 pb-3">
          <div>
            <h3 className="text-lg font-bold leading-tight mb-1">{post.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>
          </div>

          {hasVideo ? (
            <div className="relative">
              <PostVideo videoId={post.videoId!} className="aspect-video" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
                  <Play className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ) : post.previewImageUrl ? (
            <img
              src={post.previewImageUrl}
              alt={post.title}
              className="w-full rounded-lg object-cover aspect-video"
            />
          ) : (
            <img
              src="/assets/generated/template-preview-placeholder.dim_1200x675.png"
              alt="Template preview"
              className="w-full rounded-lg object-cover aspect-video opacity-60"
            />
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, idx) => (
                <span key={idx} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full backdrop-blur-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Link>

      <CardFooter className="pt-3 border-t border-primary/20">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-destructive"
              onClick={onLike}
            >
              <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-destructive text-destructive' : ''}`} />
              <span className="text-xs">{post.likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-primary"
              onClick={onRepost}
            >
              <Repeat2 className={`h-4 w-4 ${post.isReposted ? 'text-primary' : ''}`} />
              <span className="text-xs">{post.reposts}</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button variant="default" size="sm" className="gap-2" onClick={handleShare}>
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Open in AM</span>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
