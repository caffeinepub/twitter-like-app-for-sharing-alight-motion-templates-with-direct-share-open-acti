import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useUploadVideo, usePublishTemplatePost } from '../hooks/useQueries';
import VideoUploadField from '../components/VideoUploadField';

export default function ComposePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const uploadVideoMutation = useUploadVideo();
  const publishPostMutation = usePublishTemplatePost();

  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    templateLink: '',
    tags: '',
    previewImageUrl: '',
  });

  const isSubmitting = uploadVideoMutation.isPending || publishPostMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity) {
      toast.error('Please sign in to create a post');
      return;
    }

    if (!formData.title.trim() || !formData.description.trim() || !formData.templateLink.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let videoId: bigint | undefined;
      let videoContentType: string | undefined;
      let videoFileName: string | undefined;

      // Upload video first if selected
      if (selectedVideo) {
        setUploadProgress(0);
        videoId = await uploadVideoMutation.mutateAsync({
          file: selectedVideo,
          onProgress: (percentage) => setUploadProgress(percentage),
        });
        videoContentType = selectedVideo.type;
        videoFileName = selectedVideo.name;
      }

      // Parse tags
      const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Publish the post
      await publishPostMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        templateLink: formData.templateLink,
        tags,
        previewImageUrl: formData.previewImageUrl || undefined,
        videoId,
        videoContentType,
        videoFileName,
      });

      // Navigate back to feed
      navigate({ to: '/' });
    } catch (error) {
      // Error toasts are handled by the mutations
      console.error('Failed to create post:', error);
    }
  };

  return (
    <div className="py-6 max-w-2xl mx-auto">
      <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/' })} className="mb-4 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Feed
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create New Template Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Smooth Transition Pack"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your template, what it includes, and how to use it..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="templateLink">
                Template Link <span className="text-destructive">*</span>
              </Label>
              <Input
                id="templateLink"
                placeholder="alightmotion://template/your-template-id"
                value={formData.templateLink}
                onChange={(e) => setFormData({ ...formData, templateLink: e.target.value })}
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                The deep link that opens your template in Alight Motion
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="transitions, effects, professional (comma-separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            <VideoUploadField onVideoSelect={setSelectedVideo} selectedVideo={selectedVideo} />

            <div className="space-y-2">
              <Label htmlFor="previewImageUrl">Preview Image URL</Label>
              <Input
                id="previewImageUrl"
                placeholder="https://example.com/preview.jpg"
                value={formData.previewImageUrl}
                onChange={(e) => setFormData({ ...formData, previewImageUrl: e.target.value })}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">Optional: A preview image for your template</p>
            </div>

            {uploadVideoMutation.isPending && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Uploading video...</span>
                  <span className="font-medium">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {uploadVideoMutation.isPending
                  ? 'Uploading Video...'
                  : publishPostMutation.isPending
                  ? 'Publishing...'
                  : 'Publish Template'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/' })}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
