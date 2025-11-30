'use client';

import { FileIcon, Loader2, CheckCircle2, XCircle, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatBytes, getDownloadFilename, downloadBlob } from '@/lib/utils';
import { saveAs } from 'file-saver';

export type FileStatus = 'pending' | 'processing' | 'done' | 'error';

export interface FileWithStatus {
    id: string;
    file: File;
    status: FileStatus;
    convertedBlob?: Blob;
    convertedUrl?: string;
    error?: string;
    outputFormat?: 'image/jpeg' | 'image/png';
}

interface FileItemProps {
    fileData: FileWithStatus;
    onRemove: (id: string) => void;
}

export function FileItem({ fileData, onRemove }: FileItemProps) {
    const handleDownload = () => {
        if (fileData.convertedBlob) {
            // Use the shared utility to get the correct filename with extension
            const fileName = getDownloadFilename(fileData.file.name, fileData.convertedBlob);
            downloadBlob(fileData.convertedBlob, fileName);
        }
    };

    return (
        <div className="group flex items-center gap-4 p-3 bg-card rounded-lg border shadow-sm hover:bg-muted/30 transition-colors">
            {/* Preview / Icon */}
            <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center shrink-0 overflow-hidden border">
                {fileData.convertedUrl ? (
                    <img
                        src={fileData.convertedUrl}
                        alt={fileData.file.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <FileIcon className="h-6 w-6 text-muted-foreground" />
                )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="min-w-0">
                    <p className="text-sm font-medium truncate" title={fileData.file.name}>
                        {fileData.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {formatBytes(fileData.file.size)}
                    </p>
                </div>

                {/* Status */}
                <div className="flex items-center md:justify-center">
                    {fileData.status === 'pending' && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">Pending</span>
                    )}
                    {fileData.status === 'processing' && (
                        <span className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            <Loader2 className="h-3 w-3 animate-spin" /> Converting...
                        </span>
                    )}
                    {fileData.status === 'done' && (
                        <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <CheckCircle2 className="h-3 w-3" /> Ready
                        </span>
                    )}
                    {fileData.status === 'error' && (
                        <span className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            <XCircle className="h-3 w-3" /> Failed
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                    {fileData.status === 'done' && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleDownload}
                            className="h-8 text-xs"
                        >
                            <Download className="h-3.5 w-3.5 mr-1.5" />
                            Download
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onRemove(fileData.id)}
                        disabled={fileData.status === 'processing'}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
