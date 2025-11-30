import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function downloadBlob(blob: Blob, fileName: string) {
  // Create a new Blob to strip any File properties (like a UUID name) that might interfere
  const plainBlob = new Blob([blob], { type: blob.type });
  const url = window.URL.createObjectURL(plainBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 100);
}

export function getDownloadFilename(originalName: string, blob: Blob): string {
  const lastDotIndex = originalName.lastIndexOf('.');
  const nameWithoutExt = lastDotIndex !== -1 ? originalName.substring(0, lastDotIndex) : originalName;

  let extension = 'jpg'; // Default
  const mimeType = blob.type.toLowerCase();

  if (mimeType.includes('image/png')) {
    extension = 'png';
  } else if (mimeType.includes('image/webp')) {
    extension = 'webp';
  } else if (mimeType.includes('image/jpeg') || mimeType.includes('image/jpg')) {
    extension = 'jpg';
  } else if (lastDotIndex !== -1) {
    // Fallback to original extension
    const originalExt = originalName.substring(lastDotIndex + 1);
    if (originalExt) {
      extension = originalExt.toLowerCase();
    }
  }

  return `compressed_${nameWithoutExt}.${extension}`;
}
