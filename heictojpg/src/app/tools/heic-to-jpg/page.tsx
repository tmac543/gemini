'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dropzone } from '@/components/dropzone';
import { FileList } from '@/components/file-list';
import { ConverterSettings } from '@/components/converter-settings';
import { Header } from '@/components/header';
import { DownloadButton } from '@/components/download-button';
import { FileWithStatus } from '@/components/file-item';
import { convertHeicToImage, ConversionFormat } from '@/lib/converter-logic';
import { toast } from 'sonner';

// Concurrency limit to prevent browser freezing
const CONCURRENCY_LIMIT = 3;

export default function Home() {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [format, setFormat] = useState<ConversionFormat>('image/jpeg');
  const [quality, setQuality] = useState<number>(0.8);
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
              quality: quality, // Use current global quality
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
  }, [files, isProcessing, format, quality]);

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container max-w-screen-xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center gap-8">
        <section className="text-center space-y-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Convert HEIC to JPG <span className="text-primary">Instantly</span>
          </h1>

          {/* Ad Space Placeholder */}
          <div className="w-full h-[100px] bg-muted/30 border border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center text-muted-foreground text-sm mx-auto max-w-[728px]">
            Ad Space
          </div>

          <p className="text-xl text-muted-foreground">
            Free, private, and secure. All conversions happen in your browser.
            No files are ever uploaded to a server.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-muted-foreground pt-4">
            <span className="flex items-center gap-1 bg-muted/50 px-3 py-1 rounded-full">
              🔒 Browser-based processing
            </span>
            <span className="flex items-center gap-1 bg-muted/50 px-3 py-1 rounded-full">
              ⚡ No Server Upload
            </span>
            <span className="flex items-center gap-1 bg-muted/50 px-3 py-1 rounded-full">
              📂 Bulk Support
            </span>
          </div>
        </section>

        <ConverterSettings
          format={format}
          setFormat={setFormat}
          quality={quality}
          setQuality={setQuality}
          disabled={files.some(f => f.status === 'processing')}
        />

        <section className="w-full max-w-4xl">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Files ({files.length})</h3>
              <div className="flex items-center gap-2">
                {files.length > 0 && (
                  <Button variant="outline" size="sm" onClick={handleClearAll} className="cursor-pointer">
                    <Trash2 className="w-4 h-4 mr-2" /> Clear All
                  </Button>
                )}
                <DownloadButton files={files} />
              </div>
            </div>

            {/* Cross-Sell Link */}
            {files.some(f => f.status === 'done') && (
              <div className="flex justify-end">
                <Link href="/tools/image-compressor" className="text-sm text-primary hover:underline flex items-center gap-1">
                  Need to reduce file size? Compress Now <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
          <Dropzone onDrop={handleDrop} />
          <FileList files={files} onRemove={handleRemove} />
        </section>

        <section className="w-full max-w-3xl mt-16 prose prose-slate dark:prose-invert">
          <h2>How to convert HEIC to JPG?</h2>
          <p>
            HEIC is a modern image format used by Apple devices. While it offers great quality at small file sizes,
            it's not widely supported on Windows or Android. Our tool lets you convert HEIC files to standard JPG or PNG images
            directly in your browser.
          </p>
          <ul>
            <li><strong>Step 1:</strong> Drag and drop your HEIC files into the box above.</li>
            <li><strong>Step 2:</strong> Choose your output format (JPG or PNG) and quality.</li>
            <li><strong>Step 3:</strong> Wait for the conversion to finish and download your images.</li>
          </ul>
        </section>
      </main>

      <DownloadButton files={files} />
    </div>
  );
}
