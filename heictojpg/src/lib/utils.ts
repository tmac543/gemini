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
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getDownloadFilename(originalName: string, blob: Blob): string {
  const lastDotIndex = originalName.lastIndexOf('.');
  const nameWithoutExt = lastDotIndex !== -1 ? originalName.substring(0, lastDotIndex) : originalName;

  let extension = 'jpg'; // Default
  const mimeType = blob.type;

  if (mimeType === 'image/png') {
    extension = 'png';
  } else if (mimeType === 'image/webp') {
    extension = 'webp';
  } else if (mimeType === 'image/jpeg') {
    extension = 'jpg';
  } else if (lastDotIndex !== -1) {
    // Fallback to original extension
    extension = originalName.substring(lastDotIndex + 1);
  }

  return `compressed_${nameWithoutExt}.${extension}`;
}
