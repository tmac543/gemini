'use client';

import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';
import { Dropzone } from '@/components/dropzone';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { CompressedFileList } from './components/compressed-file-list';
import { CompressedFile } from './components/compressed-file-item';
import JSZip from 'jszip';
import { cn, downloadBlob, getDownloadFilename } from '@/lib/utils';

const CONCURRENCY_LIMIT = 3;

export default function ImageCompressor() {
    const [files, setFiles] = useState<CompressedFile[]>([]);
    const [compressionLevel, setCompressionLevel] = useState<number>(80);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isZipping, setIsZipping] = useState(false);

    const handleDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles: CompressedFile[] = acceptedFiles.map((file) => ({
            id: uuidv4(),
            originalFile: file,
            status: 'pending',
            compressionLevel: compressionLevel,
        }));

        setFiles((prev) => [...prev, ...newFiles]);
    }, [compressionLevel]);

    const handleRemove = useCallback((id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    }, []);

    const handleReset = () => {
        setFiles([]);
        setCompressionLevel(80);
    };

    // Process Queue
    useEffect(() => {
        const processQueue = async () => {
            if (isProcessing) return;

            const pendingFiles = files.filter((f) => f.status === 'pending');
            if (pendingFiles.length === 0) return;

            setIsProcessing(true);

            const chunk = pendingFiles.slice(0, CONCURRENCY_LIMIT);

            setFiles((prev) =>
                prev.map((f) =>
                    chunk.find((c) => c.id === f.id) ? { ...f, status: 'compressing' } : f
                )
            );

            await Promise.all(
                chunk.map(async (fileData) => {
                    try {
                        const options = {
                            maxSizeMB: 10,
                            maxWidthOrHeight: 4096,
                            useWebWorker: true,
                            initialQuality: compressionLevel / 100,
                        };

                        const compressedBlob = await imageCompression(fileData.originalFile, options);

                        setFiles((prev) =>
                            prev.map((f) =>
                                f.id === fileData.id
                                    ? {
                                        ...f,
                                        status: 'done',
                                        compressedBlob,
                                    }
                                    : f
                            )
                        );
                    } catch (error) {
                        console.error(`Error compressing ${fileData.originalFile.name}:`, error);
                        setFiles((prev) =>
                            prev.map((f) =>
                                f.id === fileData.id
                                    ? { ...f, status: 'error', error: 'Compression failed' }
                                    : f
                            )
                        );
                        toast.error(`Failed to compress ${fileData.originalFile.name}`);
                    }
                })
            );

            setIsProcessing(false);
        };

        processQueue();
    }, [files, isProcessing, compressionLevel]);

    // Batch Download
    const handleDownloadAll = async () => {
        const completedFiles = files.filter((f) => f.status === 'done' && f.compressedBlob);
        if (completedFiles.length === 0) return;

        setIsZipping(true);
        try {
            const zip = new JSZip();

            completedFiles.forEach((file) => {
                if (file.compressedBlob) {
                    const fileName = getDownloadFilename(file.originalFile.name, file.compressedBlob);
                    console.log('Adding to zip:', fileName);
                    zip.file(fileName, file.compressedBlob);
                }
            });

            const content = await zip.generateAsync({ type: 'blob' });
            // Explicitly cast to Blob if needed, but generateAsync returns Promise<Blob> which is compatible.
            // The issue might be browser blocking or something else.
            // Let's try adding a small delay or ensuring it's treated as a user action (which it is).
            downloadBlob(content, 'compressed_images.zip');
            toast.success('Batch download started!');
        } catch (error) {
            console.error('Zip error:', error);
            toast.error('Failed to create ZIP file.');
        } finally {
            setIsZipping(false);
        }
    };

    const completedCount = files.filter(f => f.status === 'done').length;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 container max-w-screen-xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center gap-8">
                <section className="text-center space-y-4 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
                        Image <span className="text-primary">Compressor</span>
                    </h1>

                    {/* Ad Space Placeholder */}
                    <div className="w-full h-[100px] bg-muted/30 border border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center text-muted-foreground text-sm mx-auto max-w-[728px]">
                        Ad Space
                    </div>

                    <p className="text-xl text-muted-foreground">
                        Batch compress PNG and JPG images locally.
                    </p>
                </section>

                {/* Global Settings */}
                <Card className="w-full max-w-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Global Settings</h3>
                        <Button variant="ghost" size="sm" onClick={handleReset} className="cursor-pointer">
                            <RefreshCw className="w-4 h-4 mr-2" /> Reset All
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Compression Quality: {compressionLevel}%</span>
                            <span className="text-muted-foreground">
                                {compressionLevel < 50 ? 'High Compression' : 'High Quality'}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={compressionLevel}
                            onChange={(e) => {
                                setCompressionLevel(Number(e.target.value));
                            }}
                            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                </Card>

                <section className="w-full max-w-4xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Files ({files.length})</h3>
                        {completedCount > 0 && (
                            <Button
                                onClick={handleDownloadAll}
                                disabled={isZipping}
                                className="cursor-pointer"
                            >
                                {isZipping ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Zipping...
                                    </>
                                ) : (
                                    <>
                                        <Download className="mr-2 h-4 w-4" /> Download All ({completedCount})
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                    <Dropzone
                        onDrop={handleDrop}
                        className="h-48"
                        accept={{
                            'image/png': ['.png'],
                            'image/jpeg': ['.jpg', '.jpeg'],
                            'image/webp': ['.webp']
                        }}
                        subText="or click to select files (PNG, JPG, WebP)"
                    />
                    <CompressedFileList files={files} onRemove={handleRemove} />
                </section >
            </main >
        </div >
    );
}
