import { create } from 'zustand'

export type EditorTool = 'select' | 'ball' | 'path' | 'cone'

interface EditorState {
  activeStepIndex: number
  tool: EditorTool
  selectedPlayerId: string | null
  showCoverage: boolean
  showDangerZones: boolean
  showMeasurements: boolean
  /** lateral reach (meters) applied to every defender when computing coverage */
  coverageReach: number
  /** multiplier on the attack cone's width at the defender baseline; 1 = corner-to-corner */
  attackWidthScale: number
  setActiveStep: (index: number) => void
  setTool: (tool: EditorTool) => void
  setSelectedPlayer: (id: string | null) => void
  toggleCoverage: () => void
  toggleDangerZones: () => void
  toggleMeasurements: () => void
  setCoverageReach: (meters: number) => void
  setAttackWidthScale: (value: number) => void
}

export const COVERAGE_REACH_MIN = 0.8
export const COVERAGE_REACH_MAX = 3.5
export const COVERAGE_REACH_DEFAULT = 1.8

export const ATTACK_WIDTH_MIN = 0.4
export const ATTACK_WIDTH_MAX = 1.5
export const ATTACK_WIDTH_DEFAULT = 1.0

const clamp = (n: number, min: number, max: number, fallback: number) =>
  Math.min(max, Math.max(min, Number.isFinite(n) ? n : fallback))

export const useEditorStore = create<EditorState>((set) => ({
  activeStepIndex: 0,
  tool: 'select',
  selectedPlayerId: null,
  showCoverage: true,
  showDangerZones: true,
  showMeasurements: false,
  coverageReach: COVERAGE_REACH_DEFAULT,
  attackWidthScale: ATTACK_WIDTH_DEFAULT,
  setActiveStep: (index) => set({ activeStepIndex: index }),
  setTool: (tool) => set({ tool }),
  setSelectedPlayer: (id) => set({ selectedPlayerId: id }),
  toggleCoverage: () => set((s) => ({ showCoverage: !s.showCoverage })),
  toggleDangerZones: () => set((s) => ({ showDangerZones: !s.showDangerZones })),
  toggleMeasurements: () => set((s) => ({ showMeasurements: !s.showMeasurements })),
  setCoverageReach: (m) =>
    set({ coverageReach: clamp(m, COVERAGE_REACH_MIN, COVERAGE_REACH_MAX, COVERAGE_REACH_DEFAULT) }),
  setAttackWidthScale: (v) =>
    set({ attackWidthScale: clamp(v, ATTACK_WIDTH_MIN, ATTACK_WIDTH_MAX, ATTACK_WIDTH_DEFAULT) }),
}))
