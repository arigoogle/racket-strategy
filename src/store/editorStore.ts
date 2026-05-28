import { create } from 'zustand'

export type EditorTool = 'select' | 'ball' | 'path' | 'cone'

interface EditorState {
  activeStepIndex: number
  tool: EditorTool
  selectedPlayerId: string | null
  showCoverage: boolean
  showDangerZones: boolean
  setActiveStep: (index: number) => void
  setTool: (tool: EditorTool) => void
  setSelectedPlayer: (id: string | null) => void
  toggleCoverage: () => void
  toggleDangerZones: () => void
}

export const useEditorStore = create<EditorState>((set) => ({
  activeStepIndex: 0,
  tool: 'select',
  selectedPlayerId: null,
  showCoverage: true,
  showDangerZones: true,
  setActiveStep: (index) => set({ activeStepIndex: index }),
  setTool: (tool) => set({ tool }),
  setSelectedPlayer: (id) => set({ selectedPlayerId: id }),
  toggleCoverage: () => set((s) => ({ showCoverage: !s.showCoverage })),
  toggleDangerZones: () => set((s) => ({ showDangerZones: !s.showDangerZones })),
}))
