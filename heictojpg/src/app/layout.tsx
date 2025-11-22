import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Free HEIC to JPG Converter - Private & Fast',
  description: 'Convert HEIC/HEIF images to JPG or PNG instantly in your browser. No server uploads, 100% private and free.',
  keywords: ['HEIC to JPG', 'HEIC converter', 'HEIF to JPG', 'online converter', 'client-side converter'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
