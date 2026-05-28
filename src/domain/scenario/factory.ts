import { getCourtConfig } from '../sports'
import type { Player, PlayerPosition, Scenario, Sport, Step } from '../models/scenario'

const uid = (() => {
  let n = 0
  return (prefix = 'id') => `${prefix}_${Date.now().toString(36)}_${(++n).toString(36)}`
})()

export function createDefaultScenario(sport: Sport): Scenario {
  const config = getCourtConfig(sport)
  const now = new Date().toISOString()

  const players: Player[] = config.defaultPlayers.map((p, i) => ({
    id: uid(`p${i}`),
    label: p.label,
    team: p.team,
    role: p.role,
  }))

  const playerPositions: PlayerPosition[] = players.map((player, i) => ({
    playerId: player.id,
    x: config.defaultPlayers[i].position.x,
    y: config.defaultPlayers[i].position.y,
  }))

  const initialStep: Step = {
    id: uid('step'),
    order: 0,
    playerPositions,
    zones: [],
    durationMs: 0,
    annotation: 'Starting formation',
  }

  return {
    id: uid('scn'),
    title: 'Untitled scenario',
    sport,
    tags: [],
    players,
    steps: [initialStep],
    createdAt: now,
    updatedAt: now,
    isPublic: false,
  }
}
