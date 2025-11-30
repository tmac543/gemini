import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { Footer } from '@/components/footer';
import { JsonLd } from '@/components/json-ld';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Free HEIC to JPG Converter - Private & Fast',
    template: '%s | ImageTools',
  },
  description: 'Convert HEIC/HEIF images to JPG or PNG instantly in your browser. No server uploads, 100% private and free.',
  keywords: ['HEIC to JPG', 'HEIC converter', 'HEIF to JPG', 'online converter', 'client-side converter', 'image compressor', 'privacy focused'],
  authors: [{ name: 'ImageTools' }],
  creator: 'ImageTools',
  publisher: 'ImageTools',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://heictojpg.app/', // Placeholder URL
    title: 'Free HEIC to JPG Converter - Private & Fast',
    description: 'Convert HEIC/HEIF images to JPG or PNG instantly in your browser. No server uploads, 100% private and free.',
    siteName: 'ImageTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free HEIC to JPG Converter - Private & Fast',
    description: 'Convert HEIC/HEIF images to JPG or PNG instantly in your browser. No server uploads, 100% private and free.',
    creator: '@ImageTools',
  },
  alternates: {
    canonical: 'https://heictojpg.app/', // Placeholder URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ImageTools',
    url: 'https://heictojpg.app/',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://heictojpg.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <JsonLd data={jsonLdData} />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
