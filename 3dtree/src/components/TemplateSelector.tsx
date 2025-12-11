import { motion } from 'framer-motion'
import { Check, ShoppingCart, ArrowLeft } from 'lucide-react'
import { useStore } from '../store'
import { useState } from 'react'
import { PricingModal } from './PricingModal'
import type { Template } from '../store'

import { TEMPLATES } from '../store'

export function TemplateSelector() {
    const { setPage, selectTemplate } = useStore()
    const [showPricing, setShowPricing] = useState(false)
    const [pendingTemplate, setPendingTemplate] = useState<Template | null>(null)

    const handleTemplateSelect = (template: Template) => {
        if (template.price === 0) {
            selectTemplate(template)
        } else {
            setPendingTemplate(template)
            setShowPricing(true)
        }
    }

    const handlePlanSelect = () => {
        setShowPricing(false)
        if (pendingTemplate) {
            selectTemplate(pendingTemplate)
            setPendingTemplate(null)
        }
    }

    return (
        <div className="w-full min-h-screen bg-[#0a0a15] text-white p-8 overflow-y-auto">
            <PricingModal
                isOpen={showPricing}
                onClose={() => setShowPricing(false)}
                onSelectPlan={handlePlanSelect}
            />

            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => setPage('landing')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    返回首页
                </button>

                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">选择您的风格</h2>
                    <p className="text-gray-400">选择一款最适合您的 3D 场景模版</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TEMPLATES.map((template, index) => (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all group"
                        >
                            <div className="aspect-[4/3] bg-gray-900 relative overflow-hidden">
                                <img
                                    src={template.previewImage}
                                    alt={template.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                    <span className={`px-3 py-1 backdrop-blur-md rounded-full text-sm border ${template.price === 0
                                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                        : 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                                        }`}>
                                        {template.price === 0 ? '免费' : `¥${template.price}`}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                                <p className="text-gray-400 text-sm mb-6 h-12 leading-relaxed">
                                    {template.description}
                                </p>

                                <button
                                    onClick={() => handleTemplateSelect(template)}
                                    className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${template.price === 0
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
                                            <ShoppingCart className="w-4 h-4" />
                                            购买模版
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
