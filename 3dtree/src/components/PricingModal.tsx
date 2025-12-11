import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Shield, Zap, Star } from 'lucide-react'

interface PricingModalProps {
    isOpen: boolean
    onClose: () => void
    onSelectPlan: (planId: string) => void
}

export function PricingModal({ isOpen, onClose, onSelectPlan }: PricingModalProps) {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-4xl bg-[#0f0f1a] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Left Side - Value Prop */}
                        <div className="p-8 md:p-12 bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex flex-col justify-center">
                            <h2 className="text-3xl font-bold mb-6 text-white">
                                解锁完整<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                    魔法体验
                                </span>
                            </h2>

                            <div className="space-y-6">
                                <FeatureItem icon={<Star className="w-5 h-5 text-yellow-400" />} text="访问所有高级 3D 模版" />
                                <FeatureItem icon={<Zap className="w-5 h-5 text-blue-400" />} text="去除水印 & 高清导出" />
                                <FeatureItem icon={<Shield className="w-5 h-5 text-green-400" />} text="永久保存您的作品" />
                            </div>
                        </div>

                        {/* Right Side - Plans */}
                        <div className="p-8 md:p-12 bg-[#0f0f1a]">
                            <h3 className="text-xl font-bold text-white mb-8">选择您的方案</h3>

                            <div className="space-y-4">
                                {/* Single Tree Plan */}
                                <div
                                    onClick={() => onSelectPlan('single')}
                                    className="group relative p-4 rounded-xl border border-gray-700 hover:border-blue-500 cursor-pointer transition-all hover:bg-blue-500/5"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-white">单次制作</h4>
                                        <span className="text-xl font-bold text-white">¥9.9</span>
                                    </div>
                                    <p className="text-sm text-gray-400">制作并下载 1 个 3D 圣诞树场景</p>
                                    <div className="absolute inset-0 border-2 border-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </div>

                                {/* Holiday Pass */}
                                <div
                                    onClick={() => onSelectPlan('pass')}
                                    className="group relative p-4 rounded-xl border-2 border-purple-500 bg-purple-500/10 cursor-pointer transition-all hover:bg-purple-500/20"
                                >
                                    <div className="absolute -top-3 left-4 px-2 py-0.5 bg-purple-500 text-white text-xs font-bold rounded-full">
                                        最受欢迎
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-white">节日通票</h4>
                                        <div className="text-right">
                                            <span className="text-sm text-gray-400 line-through mr-2">¥29.9</span>
                                            <span className="text-xl font-bold text-white">¥19.9</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-300">无限制作，解锁所有模版 (限时特惠)</p>
                                </div>
                            </div>

                            <p className="mt-8 text-xs text-center text-gray-500">
                                安全支付 • 满意保证 • 随时取消
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

function FeatureItem({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg">
                {icon}
            </div>
            <span className="text-gray-300 font-medium">{text}</span>
        </div>
    )
}
