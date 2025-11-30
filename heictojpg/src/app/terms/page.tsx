import { Header } from '@/components/header';
import { FileCheck, Scale, AlertCircle } from 'lucide-react';

export const metadata = {
    title: 'Terms of Service - ImageTools',
    description: 'Terms and conditions for using ImageTools image processing tools.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 container max-w-4xl mx-auto px-4 py-12 md:py-16">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                            <Scale className="w-4 h-4" /> Legal Terms
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            Terms of Service
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    {/* Key Points */}
                    <div className="grid md:grid-cols-3 gap-6 my-12">
                        <div className="bg-card border border-border/50 p-6 rounded-xl">
                            <FileCheck className="w-8 h-8 text-primary mb-3" />
                            <h3 className="font-bold mb-2">Free to Use</h3>
                            <p className="text-sm text-muted-foreground">No registration, no fees, no hidden costs. Use our tools freely.</p>
                        </div>
                        <div className="bg-card border border-border/50 p-6 rounded-xl">
                            <AlertCircle className="w-8 h-8 text-primary mb-3" />
                            <h3 className="font-bold mb-2">As-Is Service</h3>
                            <p className="text-sm text-muted-foreground">We provide tools without warranties. Use at your own discretion.</p>
                        </div>
                        <div className="bg-card border border-border/50 p-6 rounded-xl">
                            <Scale className="w-8 h-8 text-primary mb-3" />
                            <h3 className="font-bold mb-2">Fair Use</h3>
                            <p className="text-sm text-muted-foreground">Use responsibly and respect intellectual property rights.</p>
                        </div>
                    </div>

                    {/* Content */}
                    <article className="prose prose-slate dark:prose-invert max-w-none">
                        <h2>1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using ImageTools ("the Service"), you accept and agree to be bound by the terms and provisions
                            of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
                        </p>

                        <h2>2. Description of Service</h2>
                        <p>
                            ImageTools provides free, client-side image processing tools including:
                        </p>
                        <ul>
                            <li>HEIC to JPG/PNG conversion</li>
                            <li>Image compression</li>
                            <li>Other image processing utilities as they become available</li>
                        </ul>
                        <p>
                            All processing occurs entirely in your web browser. We do not upload, store, or process your images on our servers.
                        </p>

                        <h2>3. User Responsibilities</h2>
                        <p>
                            You agree to:
                        </p>
                        <ul>
                            <li>Use the Service only for lawful purposes</li>
                            <li>Not use the Service to process images you don't have the right to use</li>
                            <li>Respect intellectual property rights and copyrights</li>
                            <li>Not attempt to reverse engineer, decompile, or disassemble any part of the Service</li>
                            <li>Not use the Service in any way that could damage, disable, or impair the Service</li>
                        </ul>

                        <h2>4. Intellectual Property</h2>
                        <p>
                            The Service and its original content, features, and functionality are owned by ImageTools and are protected
                            by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                        </p>
                        <p>
                            Your images remain your property. Since we never receive your images (they're processed locally in your browser),
                            we make no claim to any rights over your content.
                        </p>

                        <h2>5. Open Source</h2>
                        <p>
                            ImageTools is open source software. The source code is available for review, modification, and distribution
                            under the terms of our open source license. Please refer to our GitHub repository for specific licensing terms.
                        </p>

                        <h2>6. Disclaimer of Warranties</h2>
                        <p>
                            The Service is provided on an "AS IS" and "AS AVAILABLE" basis without any warranties of any kind,
                            either express or implied, including but not limited to:
                        </p>
                        <ul>
                            <li>Warranties of merchantability or fitness for a particular purpose</li>
                            <li>Warranties that the Service will be uninterrupted, timely, secure, or error-free</li>
                            <li>Warranties regarding the quality, accuracy, or reliability of any results obtained from the Service</li>
                        </ul>

                        <h2>7. Limitation of Liability</h2>
                        <p>
                            In no event shall ImageTools, its directors, employees, partners, agents, suppliers, or affiliates be liable for:
                        </p>
                        <ul>
                            <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                            <li>Any loss of profits, revenue, data, or use</li>
                            <li>Any damages arising from your use or inability to use the Service</li>
                        </ul>
                        <p>
                            This limitation applies whether the alleged liability is based on contract, tort, negligence, strict liability,
                            or any other basis, even if we have been advised of the possibility of such damage.
                        </p>

                        <h2>8. Browser Compatibility</h2>
                        <p>
                            The Service requires a modern web browser with JavaScript and WebAssembly support. We recommend using
                            the latest version of Chrome, Firefox, Safari, or Edge. We are not responsible for issues arising from
                            using outdated or unsupported browsers.
                        </p>

                        <h2>9. No Data Backup</h2>
                        <p>
                            Since all processing happens in your browser and we don't store your images, you are solely responsible for:
                        </p>
                        <ul>
                            <li>Maintaining backups of your original images</li>
                            <li>Saving processed images before closing your browser</li>
                            <li>Any data loss that may occur</li>
                        </ul>

                        <h2>10. Modifications to Service</h2>
                        <p>
                            We reserve the right to:
                        </p>
                        <ul>
                            <li>Modify or discontinue the Service at any time without notice</li>
                            <li>Change these Terms of Service at any time</li>
                            <li>Add or remove features from the Service</li>
                        </ul>
                        <p>
                            Your continued use of the Service after any such changes constitutes your acceptance of the new Terms of Service.
                        </p>

                        <h2>11. Third-Party Links</h2>
                        <p>
                            The Service may contain links to third-party websites or services that are not owned or controlled by ImageTools.
                            We have no control over and assume no responsibility for the content, privacy policies, or practices of any
                            third-party websites or services.
                        </p>

                        <h2>12. Governing Law</h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with applicable laws, without regard to
                            conflict of law provisions.
                        </p>

                        <h2>13. Severability</h2>
                        <p>
                            If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or
                            eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.
                        </p>

                        <h2>14. Entire Agreement</h2>
                        <p>
                            These Terms constitute the entire agreement between you and ImageTools regarding the use of the Service,
                            superseding any prior agreements between you and ImageTools relating to your use of the Service.
                        </p>

                        <h2>15. Contact Information</h2>
                        <p>
                            If you have any questions about these Terms of Service, please contact us through our GitHub repository.
                        </p>

                        <div className="bg-muted/50 border border-border/50 rounded-xl p-6 mt-8">
                            <p className="text-sm text-muted-foreground mb-0">
                                <strong>Note:</strong> By using ImageTools, you acknowledge that you have read, understood, and agree to be
                                bound by these Terms of Service and our Privacy Policy.
                            </p>
                        </div>
                    </article>
                </div>
            </main>
        </div>
    );
}
