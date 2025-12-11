import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Check, Upload, Wand2, Share2, Crown } from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { SciFiParticleTree } from './SciFiParticleTree'
import { TemplatePreviewModal } from './TemplatePreviewModal'
import { PricingModal } from './PricingModal'
import { useStore } from '../store'
import type { Template } from '../store'
import { useState } from 'react'

import { TEMPLATES } from '../store'

export function LandingPage() {
    const { setPage, selectTemplate } = useStore()
    const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
    const [showPricing, setShowPricing] = useState(false)

    const handleTemplateClick = (template: Template) => {
        if (template.price === 0) {
            // 免费模版直接使用
            selectTemplate(template)
        } else {
            // 付费模版先预览
            setPreviewTemplate(template)
        }
    }

    const handlePurchase = () => {
        if (previewTemplate) {
            setPreviewTemplate(null)
            setShowPricing(true)
        }
    }

    const handlePlanSelect = () => {
        // 模拟支付成功
        setShowPricing(false)
        if (previewTemplate) {
            selectTemplate(previewTemplate)
        } else {
            // 如果是从定价页直接购买，默认去模版页
            setPage('templates')
        }
    }

    return (
        <div className="w-full h-full bg-[#0a0a15] text-white overflow-y-auto">
            {/* Modals */}
            {previewTemplate && (
                <TemplatePreviewModal
                    templateName={previewTemplate.name}
                    isPaid={previewTemplate.price > 0}
                    onClose={() => setPreviewTemplate(null)}
                    onPurchase={handlePurchase}
                />
            )}

            <PricingModal
                isOpen={showPricing}
                onClose={() => setShowPricing(false)}
                onSelectPlan={handlePlanSelect}
            />
            {/* Header Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                        <span className="text-xl font-bold">Magic Tree</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#templates" className="text-gray-300 hover:text-white transition-colors">模版</a>
                        <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">使用教程</a>
                        <button onClick={() => setShowPricing(true)} className="text-gray-300 hover:text-white transition-colors">定价</button>
                    </nav>

                    <div className="flex items-center gap-4">
                        <button onClick={() => setShowPricing(true)} className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 text-yellow-400 rounded-lg border border-yellow-500/30 hover:bg-yellow-500/30 transition-all">
                            <Crown className="w-4 h-4" />
                            <span className="text-sm font-bold">升级会员</span>
                        </button>
                        <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-all border border-white/20">
                            登录
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden pt-16">
                <div className="absolute inset-0 z-0">
                    <Canvas camera={{ position: [0, 1, 6], fov: 50 }}>
                        <color attach="background" args={['#000500']} />
                        <ambientLight intensity={0.1} />
                        <pointLight position={[10, 10, 10]} intensity={0.8} color="#00ff41" />
                        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#008f11" />
                        <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffd700" />
                        <fog attach="fog" args={['#000500', 5, 35]} />

                        <Stars radius={100} depth={50} count={7000} factor={4} saturation={1} fade speed={2} />

                        <EffectComposer>
                            <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.9} height={300} intensity={1.2} />
                        </EffectComposer>

                        <group rotation={[0, 0, 0]}>
                            <SciFiParticleTree position={[0, -2, 0]} />
                        </group>

                        <OrbitControls
                            enableZoom={false}
                            enablePan={false}
                            autoRotate
                            autoRotateSpeed={0.8}
                            maxPolarAngle={Math.PI / 2}
                            minPolarAngle={Math.PI / 3}
                        />
                    </Canvas>

                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-[#0a0a15] pointer-events-none" />
                </div>

                <div className="relative z-10 text-center px-8 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                            <span className="text-sm font-medium text-green-400">2077 赛博朋克版已上线</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-2xl">
                            让回忆在 3D 世界中
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                闪耀起来
                            </span>
                        </h1>

                        <p className="text-xl text-gray-300 mb-8 drop-shadow-lg max-w-2xl mx-auto">
                            上传照片，选择精美模版，AI 自动生成魔幻 3D 圣诞树
                            <br />
                            支持手势互动，一键分享，送给亲友最独特的数字礼物
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => setPage('templates')}
                                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all transform hover:scale-105 inline-flex items-center gap-2"
                            >
                                免费开始创作
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setShowPricing(true)}
                                className="px-10 py-4 bg-white/10 border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-all inline-flex items-center gap-2"
                            >
                                查看会员权益
                            </button>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                        <div className="w-1 h-2 bg-white/50 rounded-full" />
                    </div>
                </div>
            </div>


            {/* Templates Section - Now First */}
            <section id="templates" className="py-16 px-8 bg-gradient-to-b from-[#0a0a15] to-[#0f0f1a]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">精选模版</h2>
                        <p className="text-gray-400">多种风格，总有一款适合您</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {TEMPLATES.map((template, index) => (
                            <motion.div
                                key={template.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/10"
                            >
                                <div className="aspect-[4/3] bg-gray-900 relative overflow-hidden">
                                    <img
                                        src={template.previewImage}
                                        alt={template.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    <div className="absolute top-3 right-3">
                                        <span className="px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-full text-sm font-bold border border-white/20">
                                            {template.price === 0 ? '免费' : `¥${template.price}`}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{template.description}</p>

                                    <button
                                        onClick={() => handleTemplateClick(template)}
                                        className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${template.price === 0
                                            ? 'bg-white text-black hover:bg-gray-200'
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                                            }`}
                                    >
                                        {template.price === 0 ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                立即使用
                                            </>
                                        ) : (
                                            <>
                                                立即购买
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => setPage('templates')}
                            className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all inline-flex items-center gap-2"
                        >
                            查看全部 12+ 模版
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </section>

            {/* How It Works - Now Second */}
            <section id="how-it-works" className="py-16 px-8 bg-[#0f0f1a]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">三步创建您的魔法圣诞树</h2>
                        <p className="text-gray-400">简单快捷，无需任何设计经验</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StepCard
                            number="01"
                            icon={<Upload className="w-8 h-8" />}
                            title="上传照片"
                            description="选择 1-20 张您珍贵的照片，支持拖拽上传"
                        />
                        <StepCard
                            number="02"
                            icon={<Wand2 className="w-8 h-8" />}
                            title="选择模版"
                            description="从多种精美风格中选择最适合您的 3D 场景"
                        />
                        <StepCard
                            number="03"
                            icon={<Share2 className="w-8 h-8" />}
                            title="分享作品"
                            description="一键生成，支持手势互动，轻松分享给亲友"
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black/40 border-t border-white/10 py-12 px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-6 h-6 text-yellow-400" />
                                <span className="text-xl font-bold">Magic Tree</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                让每一个回忆都闪耀起来
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">产品</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">模版库</a></li>
                                <li><button onClick={() => setShowPricing(true)} className="hover:text-white transition-colors">定价</button></li>
                                <li><a href="#" className="hover:text-white transition-colors">案例展示</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">支持</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">使用教程</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">常见问题</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">法律</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">隐私政策</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">服务条款</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">退款政策</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                        <p>© 2024 Magic Christmas Tree. All rights reserved.</p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="hover:text-white transition-colors">微信</a>
                            <a href="#" className="hover:text-white transition-colors">微博</a>
                            <a href="#" className="hover:text-white transition-colors">抖音</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

function StepCard({ number, icon, title, description }: { number: string, icon: React.ReactNode, title: string, description: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700 p-8 rounded-2xl hover:border-blue-500/30 transition-all"
        >
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center font-bold text-lg">
                {number}
            </div>
            <div className="mb-4 p-3 bg-white/5 rounded-xl w-fit text-blue-400">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </motion.div>
    )
}
