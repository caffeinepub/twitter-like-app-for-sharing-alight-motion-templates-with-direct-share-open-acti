export interface TemplatePost {
  id: string;
  title: string;
  description: string;
  templateLink: string;
  authorName: string;
  authorId: string;
  timestamp: string;
  likes: number;
  reposts: number;
  isLiked: boolean;
  isReposted: boolean;
  tags?: string[];
  previewImageUrl?: string;
}
