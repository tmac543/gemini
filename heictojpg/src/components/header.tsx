'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
    const pathname = usePathname();

    return (
        <header className="w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 transition-all duration-300">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white">
                                <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.9" />
                                <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.7" />
                                <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.7" />
                                <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.5" />
                                <path d="M10 8L14 12L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                            </svg>
                        </div>
                    </div>
                    <span className="font-bold text-xl tracking-tight text-foreground/90 group-hover:text-foreground transition-colors">ImageTools</span>
                </Link>

                <nav className="flex items-center gap-6">
                    <Link
                        href="/"
                        className={cn(
                            "text-sm font-medium transition-colors relative after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full",
                            pathname === "/"
                                ? "text-primary after:w-full"
                                : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        Home
                    </Link>
                    <Link
                        href="/tools/image-compressor"
                        className={cn(
                            "text-sm font-medium transition-colors relative after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full",
                            pathname === "/tools/image-compressor"
                                ? "text-primary after:w-full"
                                : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        Image Compressor
                    </Link>
                    <Link
                        href="/tools/heic-to-jpg"
                        className={cn(
                            "text-sm font-medium transition-colors relative after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full",
                            pathname === "/tools/heic-to-jpg"
                                ? "text-primary after:w-full"
                                : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        HEIC to JPG
                    </Link>
                </nav>
            </div>
        </header>
    );
}
