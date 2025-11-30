import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-muted/30 border-t border-border/40 pt-16 pb-8">
            <div className="container max-w-screen-xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-3 group w-fit">
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
                            <span className="font-bold text-xl tracking-tight text-foreground/90">ImageTools</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Privacy-first image tools running entirely in your browser. No server uploads.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Github className="w-5 h-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Twitter className="w-5 h-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                        </div>
                    </div>

                    {/* Tools Column */}
                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">Tools</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link href="/tools/image-compressor" className="hover:text-primary transition-colors">
                                    Image Compressor
                                </Link>
                            </li>
                            <li>
                                <Link href="/tools/heic-to-jpg" className="hover:text-primary transition-colors">
                                    HEIC to JPG Converter
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link href="/privacy" className="hover:text-primary transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-primary transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} ImageTools. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            All Systems Operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
