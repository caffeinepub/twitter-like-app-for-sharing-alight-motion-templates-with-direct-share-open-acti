import { toast } from 'sonner';

/**
 * Attempts to directly download/open a template link.
 * Falls back to clipboard copy if the browser blocks the action.
 */
export function directDownload(templateLink: string, templateTitle: string) {
  // Try to open the link directly
  const windowRef = window.open(templateLink, '_blank', 'noopener,noreferrer');
  
  // Check if the window was blocked
  setTimeout(() => {
    if (!windowRef || windowRef.closed || typeof windowRef.closed === 'undefined') {
      // Pop-up was blocked or failed to open
      toast.info('Download blocked', {
        description: 'Your browser blocked the download. Link copied to clipboard instead.',
      });
      copyToClipboard(templateLink);
    } else {
      // Successfully opened
      toast.success('Opening template', {
        description: 'The template link is being opened.',
      });
    }
  }, 100);
}

function copyToClipboard(templateLink: string) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(templateLink)
      .then(() => {
        toast.success('Link copied to clipboard', {
          description: 'Paste the link to download the template.',
        });
      })
      .catch(() => {
        fallbackCopy(templateLink);
      });
  } else {
    fallbackCopy(templateLink);
  }
}

function fallbackCopy(templateLink: string) {
  const textArea = document.createElement('textarea');
  textArea.value = templateLink;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.select();
  
  try {
    document.execCommand('copy');
    toast.success('Link copied to clipboard', {
      description: 'Paste the link to download the template.',
    });
  } catch (error) {
    toast.error('Failed to copy link', {
      description: 'Please copy the link manually: ' + templateLink,
    });
  }
  
  document.body.removeChild(textArea);
}
