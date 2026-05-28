import { create } from 'zustand'
import type { Point } from '@/domain/models/geometry'
import type {
  BallPath,
  PlayerPosition,
  Scenario,
  ShotSpeed,
  ShotType,
  Sport,
} from '@/domain/models/scenario'
import { createDefaultScenario } from '@/domain/scenario/factory'

interface ScenarioState {
  scenario: Scenario
  setSport: (sport: Sport) => void
  setTitle: (title: string) => void
  replaceScenario: (scenario: Scenario) => void
  newScenario: (sport?: Sport) => void
  movePlayer: (stepIndex: number, playerId: string, x: number, y: number) => void
  placeBall: (stepIndex: number, point: Point) => void
  clearBall: (stepIndex: number) => void
  setBallPath: (stepIndex: number, path: BallPath | undefined) => void
  appendBallPathPoint: (stepIndex: number, point: Point) => void
  setShotType: (stepIndex: number, type: ShotType) => void
  setShotSpeed: (stepIndex: number, speed: ShotSpeed) => void
  resetToDefault: () => void
}

const touch = (s: Scenario): Scenario => ({ ...s, updatedAt: new Date().toISOString() })

function updateStep(
  state: ScenarioState,
  stepIndex: number,
  updater: (step: Scenario['steps'][number]) => Scenario['steps'][number],
): Partial<ScenarioState> {
  const steps = state.scenario.steps.slice()
  const step = steps[stepIndex]
  if (!step) return {}
  steps[stepIndex] = updater(step)
  return { scenario: touch({ ...state.scenario, steps }) }
}

export const useScenarioStore = create<ScenarioState>((set, get) => ({
  scenario: createDefaultScenario('padel_doubles'),

  setSport: (sport) => {
    if (get().scenario.sport === sport) return
    set({ scenario: createDefaultScenario(sport) })
  },

  setTitle: (title) =>
    set((state) => ({ scenario: touch({ ...state.scenario, title }) })),

  replaceScenario: (scenario) => set({ scenario }),

  newScenario: (sport) =>
    set({ scenario: createDefaultScenario(sport ?? get().scenario.sport) }),

  movePlayer: (stepIndex, playerId, x, y) =>
    set((state) =>
      updateStep(state, stepIndex, (step) => ({
        ...step,
        playerPositions: step.playerPositions.map<PlayerPosition>((p) =>
          p.playerId === playerId ? { ...p, x, y } : p,
        ),
      })),
    ),

  placeBall: (stepIndex, point) =>
    set((state) =>
      updateStep(state, stepIndex, (step) => {
        const existing = step.ballPath
        if (existing) {
          // moving the ball moves the path's starting point
          const points = existing.points.slice()
          points[0] = point
          return { ...step, ballPath: { ...existing, points } }
        }
        return {
          ...step,
          ballPath: { points: [point], shotType: 'drive', speed: 'medium' },
        }
      }),
    ),

  clearBall: (stepIndex) =>
    set((state) =>
      updateStep(state, stepIndex, (step) => ({ ...step, ballPath: undefined })),
    ),

  setBallPath: (stepIndex, path) =>
    set((state) => updateStep(state, stepIndex, (step) => ({ ...step, ballPath: path }))),

  appendBallPathPoint: (stepIndex, point) =>
    set((state) =>
      updateStep(state, stepIndex, (step) => {
        const existing = step.ballPath
        if (!existing) {
          return {
            ...step,
            ballPath: { points: [point], shotType: 'drive', speed: 'medium' },
          }
        }
        return { ...step, ballPath: { ...existing, points: [...existing.points, point] } }
      }),
    ),

  setShotType: (stepIndex, type) =>
    set((state) =>
      updateStep(state, stepIndex, (step) => {
        if (!step.ballPath) return step
        return { ...step, ballPath: { ...step.ballPath, shotType: type } }
      }),
    ),

  setShotSpeed: (stepIndex, speed) =>
    set((state) =>
      updateStep(state, stepIndex, (step) => {
        if (!step.ballPath) return step
        return { ...step, ballPath: { ...step.ballPath, speed } }
      }),
    ),

  resetToDefault: () => set({ scenario: createDefaultScenario(get().scenario.sport) }),
}))
