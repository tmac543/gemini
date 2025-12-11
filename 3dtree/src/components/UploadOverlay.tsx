import { useCallback } from 'react'
import { useStore } from '../store'
import { Upload } from 'lucide-react'

export function UploadOverlay() {
    const { addPhoto, photos, setUiState } = useStore()

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            Array.from(e.target.files).forEach((file) => {
                const reader = new FileReader()
                reader.onload = (event) => {
                    if (event.target?.result) {
                        addPhoto(event.target.result as string)
                    }
                }
                reader.readAsDataURL(file)
            })
        }
    }, [addPhoto])

    const handleStart = () => {
        if (photos.length > 0) {
            setUiState('interactive')
        }
    }

    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm text-white p-8">
            <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700 text-center">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-red-500 to-green-500 bg-clip-text text-transparent">
                    Magic Christmas Tree
                </h2>
                <p className="text-gray-400 mb-8">Upload your photos to decorate the tree!</p>

                <div className="mb-8">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-400">
                                <span className="font-semibold">Click to upload</span>
                            </p>
                            <p className="text-xs text-gray-500">JPG, PNG (Max 20)</p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>

                {photos.length > 0 && (
                    <div className="mb-8">
                        <p className="text-sm text-gray-400 mb-2">{photos.length} photos uploaded</p>
                        <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
                            {photos.map((p, i) => (
                                <img key={i} src={p} alt={`upload-${i}`} className="w-12 h-12 object-cover rounded-md border border-gray-600 shrink-0" />
                            ))}
                        </div>
                    </div>
                )}

                <button
                    onClick={handleStart}
                    disabled={photos.length === 0}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${photos.length > 0
                            ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-lg transform hover:scale-[1.02]'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    Decorate Tree
                </button>
            </div>
        </div>
    )
}
