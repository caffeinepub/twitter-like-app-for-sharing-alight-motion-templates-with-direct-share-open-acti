import { useParams, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Heart, Repeat2, ExternalLink } from 'lucide-react';
import { shareToAlightMotion } from '../utils/shareToAlightMotion';
import { useAuthGuard } from '../components/AuthGuard';
import { useState } from 'react';
import type { TemplatePost } from '../types/post';

// Mock data - in real app this would come from backend
const mockPost: TemplatePost = {
  id: '1',
  title: 'Smooth Transition Pack',
  description:
    'Professional transition effects for your videos. Includes 10+ unique transitions with customizable colors and timing. Perfect for vlogs, music videos, and professional content. Each transition is carefully crafted to provide smooth, eye-catching effects that will elevate your content to the next level.',
  templateLink: 'alightmotion://template/smooth-transitions-v1',
  authorName: 'Motion Master',
  authorId: 'user1',
  timestamp: '2h ago',
  likes: 234,
  reposts: 45,
  isLiked: false,
  isReposted: false,
  tags: ['transitions', 'effects', 'professional'],
  previewImageUrl: '',
};

export default function PostDetailPage() {
  const { postId } = useParams({ from: '/post/$postId' });
  const navigate = useNavigate();
  const { requireAuth } = useAuthGuard();
  const [post, setPost] = useState<TemplatePost>(mockPost);

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

  const handleLike = () => {
    requireAuth(() => {
      setPost((prev) => ({
        ...prev,
        isLiked: !prev.isLiked,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      }));
    });
  };

  const handleRepost = () => {
    requireAuth(() => {
      setPost((prev) => ({
        ...prev,
        isReposted: !prev.isReposted,
        reposts: prev.isReposted ? prev.reposts - 1 : prev.reposts + 1,
      }));
    });
  };

  return (
    <div className="py-6 max-w-3xl mx-auto">
      <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/' })} className="mb-4 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Feed
      </Button>

      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-accent text-accent-foreground">{authorInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.authorName}</p>
              <p className="text-sm text-muted-foreground">{post.timestamp}</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold leading-tight">{post.title}</h1>
        </CardHeader>

        <CardContent className="space-y-4">
          {post.previewImageUrl ? (
            <img src={post.previewImageUrl} alt={post.title} className="w-full rounded-lg object-cover aspect-video" />
          ) : (
            <img
              src="/assets/generated/template-preview-placeholder.dim_1200x675.png"
              alt="Template preview"
              className="w-full rounded-lg object-cover aspect-video opacity-60"
            />
          )}

          <p className="text-base leading-relaxed">{post.description}</p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag, idx) => (
                <span key={idx} className="text-sm bg-accent/50 text-accent-foreground px-3 py-1.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="default"
                className="gap-2 text-muted-foreground hover:text-destructive"
                onClick={handleLike}
              >
                <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-destructive text-destructive' : ''}`} />
                <span>{post.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="default"
                className="gap-2 text-muted-foreground hover:text-primary"
                onClick={handleRepost}
              >
                <Repeat2 className={`h-5 w-5 ${post.isReposted ? 'text-primary' : ''}`} />
                <span>{post.reposts}</span>
              </Button>
            </div>

            <Button variant="default" size="default" className="gap-2" onClick={handleShare}>
              <ExternalLink className="h-5 w-5" />
              Open in Alight Motion
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
