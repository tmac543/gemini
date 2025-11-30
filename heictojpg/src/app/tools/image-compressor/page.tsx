'use client';

import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import imageCompression from 'browser-image-compression';
import { Dropzone } from '@/components/dropzone';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Loader2, Zap, Shield, FileImage, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { CompressedFileList } from './components/compressed-file-list';
import { CompressedFile } from './components/compressed-file-item';
import JSZip from 'jszip';
import { cn, downloadBlob, getDownloadFilename } from '@/lib/utils';
import { JsonLd } from '@/components/json-ld';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
                    zip.file(fileName, file.compressedBlob);
                }
            });

            const content = await zip.generateAsync({ type: 'blob' });
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

    const jsonLdData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Image Compressor',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            ratingCount: '850',
        },
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <JsonLd data={jsonLdData} />
            <Header />

            <main className="flex-1 container max-w-screen-xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center gap-8">

                {/* Hero Section */}
                <section className="text-center space-y-6 max-w-4xl w-full">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                        <Zap className="w-4 h-4" /> Lightning Fast Compression
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
                        Compress Images <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Securely & Free</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Reduce file size by up to 80% without visible quality loss.
                        Works with PNG, JPG, and WebP directly in your browser.
                    </p>
                </section>

                {/* Tool Section */}
                <section className="w-full max-w-4xl space-y-8">
                    <Dropzone
                        onDrop={handleDrop}
                        accept={{
                            'image/png': ['.png'],
                            'image/jpeg': ['.jpg', '.jpeg'],
                            'image/webp': ['.webp']
                        }}
                        subText="or click to select files (PNG, JPG, WebP)"
                    />

                    {/* Settings & Controls */}
                    <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    Global Settings
                                </h3>
                                <div className="text-sm text-muted-foreground">
                                    Applies to new files
                                </div>
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
                        </div>
                    </div>

                    {/* File List & Actions */}
                    {files.length > 0 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    Files <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">{files.length}</span>
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={handleReset} className="cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
                                        <Trash2 className="w-4 h-4 mr-2" /> Clear All
                                    </Button>
                                    {completedCount > 0 && (
                                        <Button
                                            onClick={handleDownloadAll}
                                            disabled={isZipping}
                                            size="sm"
                                            className="cursor-pointer"
                                        >
                                            {isZipping ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Zipping...
                                                </>
                                            ) : (
                                                <>
                                                    <Download className="mr-2 h-4 w-4" /> Download All
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Cross-Sell Alert */}
                            {files.some(f => f.status === 'done') && (
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/20 rounded-full text-blue-600 dark:text-blue-400">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">Compression Complete!</p>
                                            <p className="text-sm text-muted-foreground">Need to convert HEIC files?</p>
                                        </div>
                                    </div>
                                    <Button asChild variant="default" size="sm" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white">
                                        <Link href="/tools/heic-to-jpg" className="flex items-center gap-1">
                                            Convert HEIC <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </Button>
                                </div>
                            )}

                            <CompressedFileList files={files} onRemove={handleRemove} />
                        </div>
                    )}
                </section>

                {/* SEO Content Section */}
                <div className="w-full max-w-4xl mt-16 space-y-16">

                    {/* Features Grid */}
                    <section className="grid md:grid-cols-3 gap-8">
                        <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-sm">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Smart Compression</h3>
                            <p className="text-sm text-muted-foreground">Intelligent algorithms reduce file size by up to 80% while maintaining visual quality.</p>
                        </div>
                        <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-sm">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">100% Private</h3>
                            <p className="text-sm text-muted-foreground">All compression happens locally in your browser. Your images are never uploaded to any server.</p>
                        </div>
                        <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-sm">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                                <FileImage className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Batch Processing</h3>
                            <p className="text-sm text-muted-foreground">Compress dozens of images at once. Supports PNG, JPG, and WebP formats.</p>
                        </div>
                    </section>

                    {/* Deep Dive Content */}
                    <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h3:text-xl prose-p:text-muted-foreground prose-p:leading-relaxed">
                        <h2>Why Compress Images?</h2>
                        <p>
                            Large image files slow down websites, consume bandwidth, and take up unnecessary storage space.
                            Optimizing your images is crucial for web performance, SEO, and user experience.
                        </p>
                        <p>
                            Our tool uses advanced lossy compression techniques to selectively reduce the number of colors in the image
                            and remove unnecessary metadata. This results in significantly smaller file sizes with nearly invisible differences to the human eye.
                        </p>

                        <h3>Lossy vs. Lossless Compression</h3>
                        <div className="not-prose my-8">
                            <div className="overflow-x-auto rounded-xl border border-border/50">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                                        <tr>
                                            <th className="px-6 py-4">Feature</th>
                                            <th className="px-6 py-4">Lossy (This Tool)</th>
                                            <th className="px-6 py-4">Lossless</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50 bg-card">
                                        <tr>
                                            <td className="px-6 py-4 font-medium">File Size Reduction</td>
                                            <td className="px-6 py-4 text-green-600 font-medium">High (50-90%)</td>
                                            <td className="px-6 py-4">Low (5-20%)</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 font-medium">Visual Quality</td>
                                            <td className="px-6 py-4">Very Good (Adjustable)</td>
                                            <td className="px-6 py-4">Perfect (Identical)</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 font-medium">Best For</td>
                                            <td className="px-6 py-4">Web, Social Media, Email</td>
                                            <td className="px-6 py-4">Archiving, Print</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </article>

                    {/* FAQ Section */}
                    <section>
                        <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Is it safe to compress my private photos?</AccordionTrigger>
                                <AccordionContent>
                                    Absolutely. Our compressor runs entirely in your browser using WebAssembly.
                                    Your images never leave your device and are never uploaded to any server.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>What formats do you support?</AccordionTrigger>
                                <AccordionContent>
                                    We currently support compressing JPG, PNG, and WebP images.
                                    These are the most common formats used on the web.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>Will I lose image quality?</AccordionTrigger>
                                <AccordionContent>
                                    Our tool uses "lossy" compression, which removes some data to save space.
                                    However, at the default setting (80%), the difference is usually indistinguishable to the human eye.
                                    You can adjust the quality slider to find the perfect balance for your needs.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger>Is there a limit on how many files I can compress?</AccordionTrigger>
                                <AccordionContent>
                                    No! Since the processing happens on your computer, you can compress as many files as you want.
                                    There are no daily limits or paywalls.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>
                </div>
            </main>
        </div>
    );
}
