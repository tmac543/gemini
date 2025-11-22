'use client';

import { FileIcon, Loader2, CheckCircle2, XCircle, Download, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatBytes, cn, downloadBlob, getDownloadFilename } from '@/lib/utils';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

export interface CompressedFile {
    id: string;
    originalFile: File;
    compressedBlob?: Blob;
    status: 'pending' | 'compressing' | 'done' | 'error';
    compressionLevel: number;
    error?: string;
}

interface CompressedFileItemProps {
    fileData: CompressedFile;
    onRemove: (id: string) => void;
}

export function CompressedFileItem({ fileData, onRemove }: CompressedFileItemProps) {
    const handleDownload = () => {
        if (fileData.compressedBlob) {
            const fileName = getDownloadFilename(fileData.originalFile.name, fileData.compressedBlob);
            console.log('Downloading single file:', fileName);
            downloadBlob(fileData.compressedBlob, fileName);
        }
    };

    const reduction = fileData.compressedBlob
        ? Math.round((1 - fileData.compressedBlob.size / fileData.originalFile.size) * 100)
        : 0;

    return (
        <div className="group flex flex-col md:flex-row items-center gap-4 p-4 bg-card rounded-lg border shadow-sm hover:bg-muted/30 transition-colors">
            {/* Comparison View */}
            {/* Comparison View */}
            <div className="flex-1 w-full min-w-0">
                <div className="space-y-3">
                    <div className="relative aspect-video bg-muted rounded-md overflow-hidden border">
                        {fileData.compressedBlob ? (
                            <ReactCompareSlider
                                itemOne={<ReactCompareSliderImage src={URL.createObjectURL(fileData.originalFile)} alt="Original" />}
                                itemTwo={<ReactCompareSliderImage src={URL.createObjectURL(fileData.compressedBlob)} alt="Compressed" />}
                                className="w-full h-full"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                {fileData.status === 'compressing' ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                ) : fileData.status === 'error' ? (
                                    <XCircle className="w-6 h-6 text-destructive" />
                                ) : (
                                    <img
                                        src={URL.createObjectURL(fileData.originalFile)}
                                        alt="Original"
                                        className="w-full h-full object-contain opacity-50"
                                    />
                                )}
                            </div>
                        )}

                        {/* Labels Overlay */}
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full pointer-events-none">
                            Original
                        </div>
                        {fileData.compressedBlob && (
                            <div className="absolute top-2 right-2 bg-green-600/90 text-white text-[10px] px-2 py-0.5 rounded-full pointer-events-none">
                                Compressed
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between px-1">
                        <div className="text-xs text-muted-foreground">
                            {formatBytes(fileData.originalFile.size)}
                        </div>

                        {fileData.compressedBlob ? (
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground">
                                    {formatBytes(fileData.compressedBlob.size)}
                                </span>
                                <span className="text-lg font-bold text-green-600">
                                    -{reduction}%
                                </span>
                            </div>
                        ) : (
                            <span className="text-xs text-muted-foreground">Processing...</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex md:flex-col items-center gap-2 w-full md:w-auto border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4">
                {fileData.status === 'done' && (
                    <Button
                        size="sm"
                        variant="default"
                        onClick={handleDownload}
                        className="w-full md:w-auto cursor-pointer"
                    >
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        Download
                    </Button>
                )}

                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full md:w-auto text-muted-foreground hover:text-destructive cursor-pointer"
                    onClick={() => onRemove(fileData.id)}
                    disabled={fileData.status === 'compressing'}
                >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Remove
                </Button>
            </div>
        </div>
    );
}
