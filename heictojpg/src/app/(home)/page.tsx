import Link from 'next/link';
import { ArrowRight, Image as ImageIcon, RefreshCw, Minimize2, Shield, Zap, Wallet, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0" />

            <Header />

            <main className="flex-1 container max-w-screen-xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center gap-8 relative z-10">
                {/* Hero Section */}
                <section className="text-center space-y-8 max-w-4xl relative">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        2026 New Release
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        The Privacy-First <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Image Toolkit</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Convert HEIC to JPG and compress images directly in your browser. No server uploads, no file limits, 100% private.
                    </p>


                </section>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                    {/* HEIC Converter Card */}
                    <Link href="/tools/heic-to-jpg" className="block">
                        <Card className="group relative overflow-hidden border-primary/10 bg-background/40 backdrop-blur-md hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 cursor-pointer h-full">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <RefreshCw className="w-5 h-5 text-primary" />
                                    </div>
                                    HEIC to JPG Converter
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Convert iPhone photos (HEIC/HEIF) to widely supported JPG or PNG formats instantly.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Batch conversion support
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Preserve image quality
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Works offline
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <div className="w-full px-4 py-3 rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-between text-sm font-semibold text-primary transition-all duration-300">
                                    Launch Tool <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </CardFooter>
                        </Card>
                    </Link>

                    {/* Image Compressor Card */}
                    <Link href="/tools/image-compressor" className="block">
                        <Card className="group relative overflow-hidden border-blue-500/10 bg-background/40 backdrop-blur-md hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5 cursor-pointer h-full">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Minimize2 className="w-5 h-5 text-blue-600" />
                                    </div>
                                    Image Compressor
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Smartly compress PNG and JPG images to reduce file size by up to 80% without visible quality loss.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Adjustable compression levels
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Real-time preview
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" /> No file size limits
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <div className="w-full px-4 py-3 rounded-lg bg-blue-500/10 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-between text-sm font-semibold text-blue-600 transition-all duration-300">
                                    Launch Tool <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </CardFooter>
                        </Card>
                    </Link>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl pt-16 border-t border-border/50">
                    <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-background/50 border border-border/50 hover:border-primary/20 transition-colors">
                        <div className="p-4 bg-green-500/10 rounded-full">
                            <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">100% Client-Side</h3>
                            <p className="text-sm text-muted-foreground mt-2">Your files never leave your device. Maximum privacy guaranteed.</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-background/50 border border-border/50 hover:border-amber-500/20 transition-colors">
                        <div className="p-4 bg-amber-500/10 rounded-full">
                            <Zap className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Instant Speed</h3>
                            <p className="text-sm text-muted-foreground mt-2">No upload or download wait times. Processing happens instantly via WebAssembly.</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-background/50 border border-border/50 hover:border-purple-500/20 transition-colors">
                        <div className="p-4 bg-purple-500/10 rounded-full">
                            <Wallet className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Free</h3>
                            <p className="text-sm text-muted-foreground mt-2">No hidden fees, subscriptions, or limits. Open source and community driven.</p>
                        </div>
                    </div>
                </div>

                {/* How It Works Section */}
                <section className="w-full max-w-5xl pt-16">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary">1</div>
                            <h3 className="text-xl font-semibold">Select Files</h3>
                            <p className="text-muted-foreground">Drag and drop your images or click to select them from your device.</p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary">2</div>
                            <h3 className="text-xl font-semibold">Process Instantly</h3>
                            <p className="text-muted-foreground">Our intelligent engine processes your files directly in your browser.</p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary">3</div>
                            <h3 className="text-xl font-semibold">Download</h3>
                            <p className="text-muted-foreground">Save your converted or compressed images instantly. No waiting.</p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="w-full max-w-3xl pt-16">
                    <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Is it really free?</AccordionTrigger>
                            <AccordionContent>
                                Yes, ImageTools is 100% free to use. There are no hidden fees, subscriptions, or limits on the number of files you can process.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Are my photos safe?</AccordionTrigger>
                            <AccordionContent>
                                Absolutely. We use client-side processing technology, which means your images never leave your computer. They are not uploaded to any server, ensuring complete privacy.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Does it work offline?</AccordionTrigger>
                            <AccordionContent>
                                Yes! Once the page is loaded, you can disconnect from the internet and continue using all tools. This is possible because the processing engine runs entirely within your browser.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>What formats do you support?</AccordionTrigger>
                            <AccordionContent>
                                Currently, we support converting HEIC/HEIF files to JPG/PNG and compressing JPG/PNG/WebP images. We are constantly adding support for more formats.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                {/* Social Proof / Trust */}
                <section className="w-full max-w-4xl pt-16 pb-8 text-center">
                    <p className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">Trusted by users worldwide</p>
                    <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholders for logos - using text for now to keep it clean */}
                        <span className="text-xl font-bold">PrivacyFirst</span>
                        <span className="text-xl font-bold">SecureWeb</span>
                        <span className="text-xl font-bold">OpenSource</span>
                        <span className="text-xl font-bold">WebAssembly</span>
                    </div>
                </section>

                {/* SEO Content Section */}
                <article className="w-full max-w-4xl mt-16 prose prose-slate dark:prose-invert prose-headings:font-bold prose-h2:text-3xl prose-p:text-muted-foreground prose-p:leading-relaxed">
                    <h2 className="text-center mb-8">Why choose Client-Side Image Processing?</h2>
                    <div className="grid md:grid-cols-2 gap-8 not-prose">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <Shield className="w-5 h-5 text-primary" /> Privacy First
                            </h3>
                            <p className="text-muted-foreground">
                                Traditional online image tools require you to upload your files to a server, where they're processed and then sent back to you.
                                This approach raises serious privacy concerns. Our toolkit processes everything directly in your browser using modern web technologies.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <Zap className="w-5 h-5 text-primary" /> Blazing Fast
                            </h3>
                            <p className="text-muted-foreground">
                                Because your images never leave your device, there's no time spent uploading or downloading large files.
                                Everything happens instantly, utilizing your computer's processing power for maximum efficiency.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-muted/30 rounded-2xl border border-border/50">
                        <h3 className="text-xl font-bold mb-4">Supported Formats</h3>
                        <p className="mb-4">
                            Whether you're converting HEIC photos from your iPhone or compressing images for web use, our client-side approach gives you
                            professional-grade tools without compromising your privacy.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {['HEIC', 'HEIF', 'JPG', 'JPEG', 'PNG', 'WEBP'].map((fmt) => (
                                <span key={fmt} className="px-3 py-1 bg-background border rounded-md text-xs font-mono font-medium text-muted-foreground">
                                    {fmt}
                                </span>
                            ))}
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
}
