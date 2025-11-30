import { Header } from '@/components/header';
import { Shield, Lock, Eye, Database } from 'lucide-react';

export const metadata = {
    title: 'Privacy Policy - ImageTools',
    description: 'Learn how ImageTools protects your privacy with 100% client-side image processing.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 container max-w-4xl mx-auto px-4 py-12 md:py-16">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                            <Shield className="w-4 h-4" /> Privacy First
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            Privacy Policy
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    {/* Key Points */}
                    <div className="grid md:grid-cols-3 gap-6 my-12">
                        <div className="bg-card border border-border/50 p-6 rounded-xl">
                            <Lock className="w-8 h-8 text-primary mb-3" />
                            <h3 className="font-bold mb-2">100% Client-Side</h3>
                            <p className="text-sm text-muted-foreground">All processing happens in your browser. Your files never leave your device.</p>
                        </div>
                        <div className="bg-card border border-border/50 p-6 rounded-xl">
                            <Eye className="w-8 h-8 text-primary mb-3" />
                            <h3 className="font-bold mb-2">No Tracking</h3>
                            <p className="text-sm text-muted-foreground">We don't use analytics, cookies, or any tracking mechanisms.</p>
                        </div>
                        <div className="bg-card border border-border/50 p-6 rounded-xl">
                            <Database className="w-8 h-8 text-primary mb-3" />
                            <h3 className="font-bold mb-2">Zero Data Storage</h3>
                            <p className="text-sm text-muted-foreground">We don't collect, store, or transmit any of your personal data or files.</p>
                        </div>
                    </div>

                    {/* Content */}
                    <article className="prose prose-slate dark:prose-invert max-w-none">
                        <h2>Overview</h2>
                        <p>
                            ImageTools is committed to protecting your privacy. This Privacy Policy explains how our service works
                            and why we can guarantee complete privacy for your images and data.
                        </p>

                        <h2>How ImageTools Works</h2>
                        <p>
                            ImageTools is a 100% client-side application. This means:
                        </p>
                        <ul>
                            <li><strong>No Server Uploads:</strong> Your images are never uploaded to our servers or any third-party servers.</li>
                            <li><strong>Browser Processing:</strong> All image conversion and compression happens directly in your web browser using WebAssembly technology.</li>
                            <li><strong>Local Storage Only:</strong> Processed images exist only in your browser's memory and are automatically cleared when you close the page.</li>
                        </ul>

                        <h2>Information We Don't Collect</h2>
                        <p>
                            Because all processing happens on your device, we do not and cannot:
                        </p>
                        <ul>
                            <li>Access, view, or store your images</li>
                            <li>Collect personal information such as names, email addresses, or IP addresses</li>
                            <li>Track your usage patterns or behavior</li>
                            <li>Use cookies for tracking purposes</li>
                            <li>Share any data with third parties (because we don't have any data to share)</li>
                        </ul>

                        <h2>Technical Information</h2>
                        <p>
                            Our web server may collect standard technical information such as:
                        </p>
                        <ul>
                            <li>Browser type and version</li>
                            <li>Operating system</li>
                            <li>Referring website</li>
                            <li>Pages visited and time spent</li>
                        </ul>
                        <p>
                            This information is used solely for maintaining and improving our service and is not linked to any personal information.
                        </p>

                        <h2>Third-Party Services</h2>
                        <p>
                            ImageTools does not integrate with any third-party analytics, advertising, or tracking services.
                            The application runs entirely in your browser without external dependencies for processing.
                        </p>

                        <h2>Data Security</h2>
                        <p>
                            Since your images never leave your device, they are as secure as your own computer. We recommend:
                        </p>
                        <ul>
                            <li>Using HTTPS (which we enforce) to prevent man-in-the-middle attacks</li>
                            <li>Keeping your browser updated for the latest security patches</li>
                            <li>Using reputable antivirus software on your device</li>
                        </ul>

                        <h2>Children's Privacy</h2>
                        <p>
                            Our service does not collect any personal information from anyone, including children under 13.
                            Parents and guardians can be confident that their children's images are processed privately on their own devices.
                        </p>

                        <h2>Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
                            We encourage you to review this policy periodically.
                        </p>

                        <h2>Open Source</h2>
                        <p>
                            ImageTools is open source. You can review our code to verify our privacy claims and see exactly how your images are processed.
                        </p>

                        <h2>Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us through our GitHub repository.
                        </p>
                    </article>
                </div>
            </main>
        </div>
    );
}
