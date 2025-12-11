import { Loader2 } from 'lucide-react'

export function LoadingScreen({ message = '加载中...' }: { message?: string }) {
    return (
        <div className="fixed inset-0 bg-[#0a0a15] flex flex-col items-center justify-center z-50">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-white text-lg">{message}</p>
            <p className="text-gray-400 text-sm mt-2">正在为您准备魔法...</p>
        </div>
    )
}
