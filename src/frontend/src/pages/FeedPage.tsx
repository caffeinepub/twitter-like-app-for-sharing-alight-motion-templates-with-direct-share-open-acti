import { useState } from 'react';
import PostCard from '../components/PostCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthGuard } from '../components/AuthGuard';
import { Sparkles, TrendingUp } from 'lucide-react';
import type { TemplatePost } from '../types/post';

// Mock data for demonstration since backend doesn't have post storage yet
const mockPosts: TemplatePost[] = [
  {
    id: '1',
    title: 'Smooth Transition Pack',
    description: 'Professional transition effects for your videos. Includes 10+ unique transitions with customizable colors and timing.',
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
  },
  {
    id: '2',
    title: 'Neon Glow Text Animation',
    description: 'Eye-catching neon text effects perfect for intros and titles. Fully customizable colors and glow intensity.',
    templateLink: 'alightmotion://template/neon-glow-text',
    authorName: 'Creative Studio',
    authorId: 'user2',
    timestamp: '5h ago',
    likes: 567,
    reposts: 89,
    isLiked: true,
    isReposted: false,
    tags: ['text', 'neon', 'animation'],
    previewImageUrl: '',
  },
  {
    id: '3',
    title: 'Cinematic Intro Template',
    description: 'Hollywood-style cinematic intro with dramatic effects and professional typography.',
    templateLink: 'alightmotion://template/cinematic-intro',
    authorName: 'Film Effects Pro',
    authorId: 'user3',
    timestamp: '1d ago',
    likes: 892,
    reposts: 156,
    isLiked: false,
    isReposted: true,
    tags: ['cinematic', 'intro', 'professional'],
    previewImageUrl: '',
  },
];

export default function FeedPage() {
  const { requireAuth } = useAuthGuard();
  const [posts, setPosts] = useState<TemplatePost[]>(mockPosts);
  const [activeTab, setActiveTab] = useState<'trending' | 'latest'>('trending');

  const handleLike = (postId: string) => {
    requireAuth(() => {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              }
            : post
        )
      );
    });
  };

  const handleRepost = (postId: string) => {
    requireAuth(() => {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isReposted: !post.isReposted,
                reposts: post.isReposted ? post.reposts - 1 : post.reposts + 1,
              }
            : post
        )
      );
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-6">
      {/* Left Sidebar - Hidden on mobile */}
      <aside className="hidden lg:block lg:col-span-3">
        <div className="sticky top-20 space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">Welcome to AM Templates</h3>
            <p className="text-sm text-muted-foreground">
              Discover and share amazing Alight Motion templates with the community.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Feed */}
      <main className="lg:col-span-6 space-y-4">
        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <Button
            variant={activeTab === 'trending' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('trending')}
            className="gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Trending
          </Button>
          <Button
            variant={activeTab === 'latest' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('latest')}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Latest
          </Button>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={() => handleLike(post.id)} onRepost={() => handleRepost(post.id)} />
          ))}
        </div>
      </main>

      {/* Right Sidebar - Hidden on mobile */}
      <aside className="hidden lg:block lg:col-span-3">
        <div className="sticky top-20 space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-3">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {['transitions', 'text', 'effects', 'intro', 'cinematic', 'neon'].map((tag) => (
                <span key={tag} className="text-xs bg-accent/50 text-accent-foreground px-3 py-1.5 rounded-full cursor-pointer hover:bg-accent transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
