import { useCallback } from 'react';
import { useDropzone, FileRejection, DropEvent } from 'react-dropzone';
import { FilePlus } from 'lucide-react';
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
                'group relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ease-out overflow-hidden',
                isDragActive
                    ? 'border-primary bg-primary/5 scale-[1.02] shadow-xl shadow-primary/10'
                    : 'border-border/60 hover:border-primary/50 hover:bg-muted/30 hover:shadow-lg hover:shadow-primary/5',
                className
            )}
        >
            <input {...getInputProps()} />

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />

            <div className="relative z-10 flex flex-col items-center justify-center gap-6 text-center p-8">
                <div className={cn(
                    "p-6 rounded-2xl bg-background shadow-sm ring-1 ring-border/50 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md",
                    isDragActive && "scale-110 ring-primary/50 shadow-primary/20"
                )}>
                    {isDragActive ? (
                        <FilePlus className="w-10 h-10 text-primary animate-pulse" />
                    ) : (
                        <FilePlus className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                </div>
                <div className="space-y-2 max-w-md">
                    <p className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {isDragActive ? 'Drop files now' : text}
                    </p>
                    <p className="text-base text-muted-foreground/80">
                        {subText}
                    </p>
                </div>
                <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    Processed locally on your device
                </div>
            </div>
        </div>
    );
}
