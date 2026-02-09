import { toast } from 'sonner';

export function shareToAlightMotion(templateLink: string, templateTitle: string) {
  // Try to open the deep link
  const link = document.createElement('a');
  link.href = templateLink;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  
  // Attempt to open
  try {
    link.click();
    
    // Fallback: Copy to clipboard after a short delay
    setTimeout(() => {
      copyToClipboard(templateLink, templateTitle);
    }, 1000);
  } catch (error) {
    // If opening fails, copy to clipboard
    copyToClipboard(templateLink, templateTitle);
  }
}

function copyToClipboard(templateLink: string, templateTitle: string) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(templateLink)
      .then(() => {
        toast.success('Template link copied!', {
          description: 'Open Alight Motion and paste the link to import the template.',
        });
      })
      .catch(() => {
        fallbackCopy(templateLink, templateTitle);
      });
  } else {
    fallbackCopy(templateLink, templateTitle);
  }
}

function fallbackCopy(templateLink: string, templateTitle: string) {
  const textArea = document.createElement('textarea');
  textArea.value = templateLink;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.select();
  
  try {
    document.execCommand('copy');
    toast.success('Template link copied!', {
      description: 'Open Alight Motion and paste the link to import the template.',
    });
  } catch (error) {
    toast.error('Failed to copy link', {
      description: 'Please copy the link manually: ' + templateLink,
    });
  }
  
  document.body.removeChild(textArea);
}
