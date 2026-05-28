import { create } from 'zustand'

interface ToastMessage {
  id: string
  message: string
}

interface UIState {
  saveDialogOpen: boolean
  libraryOpen: boolean
  toast: ToastMessage | null
  openSaveDialog: () => void
  closeSaveDialog: () => void
  openLibrary: () => void
  closeLibrary: () => void
  showToast: (message: string) => void
  clearToast: () => void
}

const TOAST_MS = 2400

export const useUIStore = create<UIState>((set, get) => ({
  saveDialogOpen: false,
  libraryOpen: false,
  toast: null,
  openSaveDialog: () => set({ saveDialogOpen: true }),
  closeSaveDialog: () => set({ saveDialogOpen: false }),
  openLibrary: () => set({ libraryOpen: true }),
  closeLibrary: () => set({ libraryOpen: false }),
  showToast: (message) => {
    const id = Math.random().toString(36).slice(2, 10)
    set({ toast: { id, message } })
    setTimeout(() => {
      if (get().toast?.id === id) set({ toast: null })
    }, TOAST_MS)
  },
  clearToast: () => set({ toast: null }),
}))
