# Specification

## Summary
**Goal:** Add support for uploading and playing back videos (with sound) as optional attachments on posts.

**Planned changes:**
- Extend the post data model (backend + frontend types) to include an optional video attachment reference and basic metadata, while keeping existing posts rendering unchanged.
- Add backend endpoints for authenticated video upload (returning a stable video id) and for serving stored video bytes by id/content type, including a maximum upload size and user-safe errors.
- Update `/compose` to include a “Video file” input, show an in-form HTML5 `<video>` preview with controls (not forcibly muted), and upload the video before publishing the post.
- Render video attachments in the feed PostCard and PostDetail using an HTML5 `<video>` player with controls, while preserving existing behavior for non-video posts.
- Add/extend React Query mutations for video upload and post publish with video reference, including success/error toasts in English and feed refresh after publishing.
- If required due to persisted stable state changes, add a conditional backend migration to preserve existing data on upgrade.

**User-visible outcome:** Signed-in users can select and preview a video (with audio) when composing a post, publish it, and other users can play the video with sound from the feed and post detail pages; existing non-video posts appear exactly as before.
