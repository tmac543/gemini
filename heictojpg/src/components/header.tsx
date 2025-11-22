'use client';



import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function Header() {
    return (
        <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-8">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg md:text-xl">
                    <div className="bg-primary text-primary-foreground p-1 rounded-md">
                        <span className="font-mono">H2J</span>
                    </div>
                    <span>ImageTools</span>
                </Link>

                <nav className="flex items-center gap-6">
                    <Link href="/tools/heic-to-jpg" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        HEIC Converter
                    </Link>
                    <Link href="/tools/image-compressor" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Compressor
                    </Link>
                    <Link
                        href="#"
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        <span className="hidden sm:inline">Privacy Policy</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
