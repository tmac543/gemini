import Link from 'next/link';
import { ArrowRight, Image as ImageIcon, FileImage, Shield, Zap, Wallet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';

export default function Home() {
    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            <Header />

            <main className="flex-1 container max-w-screen-xl mx-auto px-4 py-16 md:py-24 flex flex-col items-center gap-12 relative z-10">
                <section className="text-center space-y-6 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
                        Free Online <span className="text-primary">Image Tools</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Privacy-focused, client-side image tools. No server uploads, secure, and fast.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                    {/* HEIC Converter Card */}
                    <Card className="flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-muted-foreground/10">
                        <CardHeader>
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                <FileImage className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">HEIC to JPG Converter</CardTitle>
                            <CardDescription>
                                Convert HEIC/HEIF images to JPG or PNG format instantly.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                                <li>Batch conversion support</li>
                                <li>Adjustable quality</li>
                                <li>Client-side processing</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full cursor-pointer">
                                <Link href="/tools/heic-to-jpg">
                                    Open Converter <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Image Compressor Card */}
                    <Card className="flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-muted-foreground/10">
                        <CardHeader>
                            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                                <ImageIcon className="w-6 h-6 text-blue-500" />
                            </div>
                            <CardTitle className="text-2xl">Image Compressor</CardTitle>
                            <CardDescription>
                                Compress PNG and JPG images to reduce file size without losing quality.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                                <li>Adjustable compression level</li>
                                <li>Visual size comparison</li>
                                <li>Supports PNG & JPG</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button asChild variant="secondary" className="w-full cursor-pointer">
                                <Link href="/tools/image-compressor">
                                    Open Compressor <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl pt-8 border-t">
                    <div className="flex flex-col items-center text-center space-y-2">
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                            <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="font-semibold">100% Client-Side</h3>
                        <p className="text-sm text-muted-foreground">Your files never leave your device. Maximum privacy guaranteed.</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-2">
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                            <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="font-semibold">Instant Speed</h3>
                        <p className="text-sm text-muted-foreground">No upload or download wait times. Processing happens instantly.</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-2">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                            <Wallet className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="font-semibold">Forever Free</h3>
                        <p className="text-sm text-muted-foreground">No hidden fees, subscriptions, or limits. Use it as much as you want.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
