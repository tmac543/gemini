'use client';

import { useCallback } from 'react';
import { useDropzone, FileRejection, DropEvent } from 'react-dropzone';
import { UploadCloud, FileWarning } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DropzoneProps {
    onDrop: (acceptedFiles: File[]) => void;
    className?: string;
    accept?: Record<string, string[]>;
    text?: string;
    subText?: string;
}

export function Dropzone({
    onDrop,
    className,
    accept = {
        'image/heic': ['.heic'],
        'image/heif': ['.heif'],
    },
    text = 'Drag & drop files here',
    subText = 'or click to select files (.heic, .heif)'
}: DropzoneProps) {
    const handleDrop = useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
            if (fileRejections.length > 0) {
                fileRejections.forEach((rejection) => {
                    toast.error(`${rejection.file.name}: ${rejection.errors[0].message}`);
                });
            }
            onDrop(acceptedFiles);
        },
        [onDrop]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept,
        multiple: true,
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                'flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 ease-in-out',
                isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
                className
            )}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-4 text-center">
                <div className="p-4 rounded-full bg-background shadow-sm ring-1 ring-muted">
                    {isDragActive ? (
                        <UploadCloud className="w-8 h-8 text-primary animate-bounce" />
                    ) : (
                        <UploadCloud className="w-8 h-8 text-muted-foreground" />
                    )}
                </div>
                <div className="space-y-1">
                    <p className="text-lg font-medium text-foreground">
                        {isDragActive ? 'Drop files here' : text}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {subText}
                    </p>
                </div>
            </div>
        </div>
    );
}
