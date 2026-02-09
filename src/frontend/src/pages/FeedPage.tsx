import { useState } from 'react';
import PostCard from '../components/PostCard';
import { Button } from '@/components/ui/button';
import { useAuthGuard } from '../components/AuthGuard';
import { Sparkles, TrendingUp } from 'lucide-react';
import { useTemplatePosts } from '../hooks/useTemplatePosts';
import { Skeleton } from '@/components/ui/skeleton';
import type { TemplatePost } from '../types/post';

export default function FeedPage() {
  const { requireAuth } = useAuthGuard();
  const { data: posts = [], isLoading } = useTemplatePosts();
  const [activeTab, setActiveTab] = useState<'trending' | 'latest'>('trending');
  const [localPosts, setLocalPosts] = useState<TemplatePost[]>([]);

  // Merge query posts with local state for optimistic updates
  const displayPosts = localPosts.length > 0 ? localPosts : posts;

  // Update local state when query data changes
  if (posts.length > 0 && localPosts.length === 0) {
    setLocalPosts(posts);
  }

  const handleLike = (postId: string) => {
    requireAuth(() => {
      setLocalPosts((prev) =>
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
      setLocalPosts((prev) =>
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
          <div className="glass-surface rounded-lg border border-primary/20 p-4">
            <h3 className="font-semibold mb-2 text-primary">Welcome to AM EXPLORE</h3>
            <p className="text-sm text-muted-foreground">
              Discover and share amazing Alight Motion templates with the community.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Feed */}
      <main className="lg:col-span-6 space-y-4">
        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-primary/20 pb-2">
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
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-surface rounded-lg border border-primary/20 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="w-full aspect-video rounded-lg" />
                </div>
              ))}
            </>
          ) : (
            displayPosts.map((post) => (
              <PostCard key={post.id} post={post} onLike={() => handleLike(post.id)} onRepost={() => handleRepost(post.id)} />
            ))
          )}
        </div>
      </main>

      {/* Right Sidebar - Hidden on mobile */}
      <aside className="hidden lg:block lg:col-span-3">
        <div className="sticky top-20 space-y-4">
          <div className="glass-surface rounded-lg border border-primary/20 p-4">
            <h3 className="font-semibold mb-3 text-primary">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {['transitions', 'text', 'effects', 'intro', 'cinematic', 'neon'].map((tag) => (
                <span key={tag} className="text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-full cursor-pointer hover:bg-primary/30 transition-colors backdrop-blur-sm">
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
