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

export default function ComposePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    templateLink: '',
    tags: '',
    previewImageUrl: '',
  });

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

    setIsSubmitting(true);

    // Simulate API call - in real app this would call backend
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success('Template posted successfully!', {
      description: 'Your template is now live and visible to the community.',
    });

    setIsSubmitting(false);
    navigate({ to: '/' });
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="previewImageUrl">Preview Image URL</Label>
              <Input
                id="previewImageUrl"
                placeholder="https://example.com/preview.jpg"
                value={formData.previewImageUrl}
                onChange={(e) => setFormData({ ...formData, previewImageUrl: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Optional: A preview image for your template</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Publish Template
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate({ to: '/' })}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
