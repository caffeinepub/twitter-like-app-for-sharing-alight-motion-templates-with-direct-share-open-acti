import { useQuery } from '@tanstack/react-query';
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

// In-memory storage for newly created posts
let createdPosts: TemplatePost[] = [];

export function useTemplatePosts() {
  return useQuery<TemplatePost[]>({
    queryKey: ['templatePosts'],
    queryFn: async () => {
      // Combine mock posts with newly created posts
      return [...createdPosts, ...mockPosts];
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function addTemplatePost(post: TemplatePost) {
  createdPosts = [post, ...createdPosts];
}
