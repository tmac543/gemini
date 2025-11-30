'use client';

import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { ArrowRight, Trash2, CheckCircle2, FileImage, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dropzone } from '@/components/dropzone';
import { FileList } from '@/components/file-list';
import { ConverterSettings } from '@/components/converter-settings';
import { Header } from '@/components/header';
import { DownloadButton } from '@/components/download-button';
import { FileWithStatus } from '@/components/file-item';
import { convertHeicToImage, ConversionFormat } from '@/lib/converter-logic';
import { toast } from 'sonner';
import { JsonLd } from '@/components/json-ld';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Concurrency limit to prevent browser freezing
const CONCURRENCY_LIMIT = 3;

export default function Home() {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [format, setFormat] = useState<ConversionFormat>('image/jpeg');

  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: FileWithStatus[] = acceptedFiles.map((file) => ({
      id: uuidv4(),
      file,
      status: 'pending',
      outputFormat: format, // Initial format, can be updated if we allow per-file settings (not implemented yet)
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, [format]);

  const handleRemove = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleClearAll = () => {
    setFiles([]);
  };

  // Process queue
  useEffect(() => {
    const processQueue = async () => {
      if (isProcessing) return;

      const pendingFiles = files.filter((f) => f.status === 'pending');
      if (pendingFiles.length === 0) return;

      setIsProcessing(true);

      // Process in chunks
      const chunk = pendingFiles.slice(0, CONCURRENCY_LIMIT);

      // Mark as processing
      setFiles((prev) =>
        prev.map((f) =>
          chunk.find((c) => c.id === f.id) ? { ...f, status: 'processing' } : f
        )
      );

      await Promise.all(
        chunk.map(async (fileData) => {
          try {
            const blob = await convertHeicToImage(fileData.file, {
              format: format, // Use current global format
              quality: 1.0, // Force 100% quality
            });

            const url = URL.createObjectURL(blob);

            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileData.id
                  ? {
                    ...f,
                    status: 'done',
                    convertedBlob: blob,
                    convertedUrl: url,
                    outputFormat: format,
                  }
                  : f
              )
            );
          } catch (error) {
            console.error(`Error converting ${fileData.file.name}:`, error);
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileData.id
                  ? { ...f, status: 'error', error: 'Conversion failed' }
                  : f
              )
            );
            toast.error(`Failed to convert ${fileData.file.name}`);
          }
        })
      );

      setIsProcessing(false);
    };

    processQueue();
  }, [files, isProcessing, format]);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.convertedUrl) {
          URL.revokeObjectURL(file.convertedUrl);
        }
      });
    };
  }, []);

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'HEIC to JPG Converter',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
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
            <Shield className="w-4 h-4" /> 100% Private & Secure
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            Convert HEIC to JPG <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Instantly & Free</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The fastest way to convert iPhone photos to widely supported formats.
            No server uploads, no file limits, works offline.
          </p>
        </section>

        {/* Tool Section */}
        <section className="w-full max-w-4xl space-y-8">
          <Dropzone onDrop={handleDrop} />

          {/* Settings & Controls */}
          <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
            <ConverterSettings
              format={format}
              setFormat={setFormat}

              disabled={files.some(f => f.status === 'processing')}
            />
          </div>

          {/* File List & Actions */}
          {files.length > 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  Files <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">{files.length}</span>
                </h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleClearAll} className="cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
                    <Trash2 className="w-4 h-4 mr-2" /> Clear All
                  </Button>
                  <DownloadButton files={files} />
                </div>
              </div>

              {/* Cross-Sell Alert */}
              {files.some(f => f.status === 'done') && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-full text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Conversion Complete!</p>
                      <p className="text-sm text-muted-foreground">Need to reduce file size?</p>
                    </div>
                  </div>
                  <Button asChild variant="default" size="sm" className="cursor-pointer bg-green-600 hover:bg-green-700 text-white">
                    <Link href="/tools/image-compressor" className="flex items-center gap-1">
                      Compress Now <ArrowRight className="w-3 h-3" />
                    </Link>
                  </Button>
                </div>
              )}

              <FileList files={files} onRemove={handleRemove} />
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
              <h3 className="font-bold text-lg mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">Conversions happen instantly on your device using WebAssembly technology. No waiting for uploads.</p>
            </div>
            <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Privacy First</h3>
              <p className="text-sm text-muted-foreground">Your photos never leave your browser. We don't store, view, or share your personal images.</p>
            </div>
            <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                <FileImage className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">High Quality</h3>
              <p className="text-sm text-muted-foreground">Advanced conversion algorithms ensure your JPGs look just as good as the original HEICs.</p>
            </div>
          </section>

          {/* Deep Dive Content */}
          <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h3:text-xl prose-p:text-muted-foreground prose-p:leading-relaxed">
            <h2>What is a HEIC file?</h2>
            <p>
              HEIC (High Efficiency Image Container) is the default image format for photos taken on iPhones and iPads running iOS 11 or later.
              It uses advanced compression technology to store high-quality images at about half the file size of a standard JPEG.
            </p>
            <p>
              While efficient, HEIC files are not natively supported by many platforms, including older versions of Windows, Android, and many web browsers.
              This is why converting HEIC to JPG is often necessary for sharing and compatibility.
            </p>

            <h3>HEIC vs JPG: Which is better?</h3>
            <div className="not-prose my-8">
              <div className="overflow-x-auto rounded-xl border border-border/50">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground font-medium">
                    <tr>
                      <th className="px-6 py-4">Feature</th>
                      <th className="px-6 py-4">HEIC</th>
                      <th className="px-6 py-4">JPG</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 bg-card">
                    <tr>
                      <td className="px-6 py-4 font-medium">File Size</td>
                      <td className="px-6 py-4 text-green-600 font-medium">Smaller (Better)</td>
                      <td className="px-6 py-4">Larger</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Quality</td>
                      <td className="px-6 py-4">High (16-bit color)</td>
                      <td className="px-6 py-4">Good (8-bit color)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Compatibility</td>
                      <td className="px-6 py-4">Limited (Apple ecosystem)</td>
                      <td className="px-6 py-4 text-green-600 font-medium">Universal (Best)</td>
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
                <AccordionTrigger>How do I convert HEIC to JPG on Windows?</AccordionTrigger>
                <AccordionContent>
                  Simply open this page in your browser (Chrome, Edge, or Firefox), drag and drop your HEIC files into the upload area,
                  and click download. No software installation is required.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Can I convert multiple files at once?</AccordionTrigger>
                <AccordionContent>
                  Yes! Our tool supports batch processing. You can select hundreds of HEIC files at once, and we'll convert them all in parallel.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Does converting HEIC to JPG lose quality?</AccordionTrigger>
                <AccordionContent>
                  Any conversion from a lossy format like HEIC to another lossy format like JPG involves some theoretical quality loss.
                  However, our converter uses high-quality settings (default 80%) to ensure the difference is visually indistinguishable for most users.
                  You can also adjust the quality setting to 100% for maximum fidelity.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Is there a file size limit?</AccordionTrigger>
                <AccordionContent>
                  Since we process files in your browser, there is no strict file size limit imposed by us.
                  However, very large files or huge batches might be limited by your device's available memory (RAM).
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </main>
    </div>
  );
}
