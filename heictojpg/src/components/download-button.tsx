'use client';

import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FileWithStatus } from './file-item';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DownloadButtonProps {
    files: FileWithStatus[];
    className?: string;
}

export function DownloadButton({ files, className }: DownloadButtonProps) {
    const [isZipping, setIsZipping] = useState(false);

    const completedFiles = files.filter((f) => f.status === 'done' && f.convertedBlob);

    if (completedFiles.length === 0) return null;

    const handleDownloadAll = async () => {
        setIsZipping(true);
        try {
            const zip = new JSZip();

            completedFiles.forEach((file) => {
                if (file.convertedBlob) {
                    const extension = file.outputFormat === 'image/png' ? 'png' : 'jpg';
                    const fileName = file.file.name.replace(/\.(heic|heif)$/i, '') + `.${extension}`;
                    zip.file(fileName, file.convertedBlob);
                }
            });

            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, 'converted_images.zip');
            toast.success('Batch download started!');
        } catch (error) {
            console.error('Zip error:', error);
            toast.error('Failed to create ZIP file.');
        } finally {
            setIsZipping(false);
        }
    };

    return (
        <Button
            size="lg"
            onClick={handleDownloadAll}
            disabled={isZipping}
            className={cn("shadow-sm cursor-pointer", className)} // Added cursor-pointer explicitly just in case, though Button usually has it.
        >
            {isZipping ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Zipping...
                </>
            ) : (
                <>
                    <Download className="mr-2 h-4 w-4" />
                    Download All ({completedFiles.length})
                </>
            )}
        </Button>
    );
}
