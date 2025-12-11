import { create } from 'zustand'

export interface Template {
    id: string
    name: string
    price: number
    description: string
    previewImage: string
    style: 'classic' | 'cyberpunk' | 'snow'
}

interface AppState {
    page: 'landing' | 'templates' | 'editor'
    selectedTemplate: Template | null
    photos: string[]
    uiState: 'uploading' | 'viewing' | 'interactive'
    gestureEnabled: boolean

    setPage: (page: 'landing' | 'templates' | 'editor') => void
    selectTemplate: (template: Template) => void
    addPhoto: (url: string) => void
    setUiState: (state: 'uploading' | 'viewing' | 'interactive') => void
    toggleGesture: () => void
}

export const TEMPLATES: Template[] = [
    {
        id: 'classic',
        name: '经典温馨',
        price: 0,
        description: '传统的红绿配色，搭配温暖的黄色灯光，营造最纯正的圣诞氛围。',
        previewImage: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&q=80&w=800',
        style: 'classic'
    },
    {
        id: 'cyberpunk',
        name: '赛博朋克',
        price: 9.9,
        description: '霓虹灯光，未来感十足的科技风格，适合追求个性的你。',
        previewImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800',
        style: 'cyberpunk'
    },
    {
        id: 'snow',
        name: '冰雪奇缘',
        price: 19.9,
        description: '纯净的白色与蓝色交织，仿佛置身于童话般的冰雪世界。',
        previewImage: 'https://images.unsplash.com/photo-1482638588003-9939840f291c?auto=format&fit=crop&q=80&w=800',
        style: 'snow'
    }
]

export const useStore = create<AppState>((set) => ({
    page: 'landing',
    selectedTemplate: null,
    photos: [],
    uiState: 'uploading',
    gestureEnabled: false,

    setPage: (page) => set({ page }),
    selectTemplate: (template) => set({ selectedTemplate: template, page: 'editor' }),
    addPhoto: (url) => set((state) => ({ photos: [...state.photos, url] })),
    setUiState: (uiState) => set({ uiState }),
    toggleGesture: () => set((state) => ({ gestureEnabled: !state.gestureEnabled })),
}))
