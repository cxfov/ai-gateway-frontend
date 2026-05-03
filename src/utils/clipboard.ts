import toast from 'react-hot-toast';

export async function copyToClipboard(text: string, successMsg = 'Copied!'): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    toast.success(successMsg);
    return true;
  } catch {
    toast.error('Copy failed');
    return false;
  }
}