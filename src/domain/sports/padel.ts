import type { CourtConfig } from './types'

// Padel court — 20m long × 10m wide. Net at center (y = 10).
// Service line 3m from net on each side. Center service line splits service boxes.
// Walls/glass surround the playable area; for v1 we render court only.

const W = 10
const H = 20
const NET_Y = 10
const SERVICE_OFFSET = 3 // distance from net to service line

export const PADEL_DOUBLES: CourtConfig = {
  sport: 'padel_doubles',
  displayName: 'Padel · Doubles',
  width: W,
  height: H,
  hasWalls: true,
  netY: NET_Y,
  lines: [
    // Outer rectangle (court boundary)
    { id: 'outer', points: [
      { x: 0, y: 0 }, { x: W, y: 0 }, { x: W, y: H }, { x: 0, y: H }, { x: 0, y: 0 },
    ], weight: 0.08 },
    // Net
    { id: 'net', points: [
      { x: 0, y: NET_Y }, { x: W, y: NET_Y },
    ], weight: 0.12 },
    // Service lines (top + bottom halves)
    { id: 'svc-top', points: [
      { x: 0, y: NET_Y - SERVICE_OFFSET }, { x: W, y: NET_Y - SERVICE_OFFSET },
    ], weight: 0.05 },
    { id: 'svc-bottom', points: [
      { x: 0, y: NET_Y + SERVICE_OFFSET }, { x: W, y: NET_Y + SERVICE_OFFSET },
    ], weight: 0.05 },
    // Center service line (between service line and net on each half)
    { id: 'csl-top', points: [
      { x: W / 2, y: NET_Y - SERVICE_OFFSET }, { x: W / 2, y: NET_Y },
    ], weight: 0.05 },
    { id: 'csl-bottom', points: [
      { x: W / 2, y: NET_Y }, { x: W / 2, y: NET_Y + SERVICE_OFFSET },
    ], weight: 0.05 },
  ],
  regions: [],
  defaultPlayers: [
    // Home (bottom): one at net, one at back
    { label: 'H1', team: 'home', position: { x: W * 0.3, y: H - 3.5 }, role: 'baseline' },
    { label: 'H2', team: 'home', position: { x: W * 0.7, y: H - 3.5 }, role: 'baseline' },
    // Away (top): one at net, one at back
    { label: 'A1', team: 'away', position: { x: W * 0.3, y: 3.5 }, role: 'baseline' },
    { label: 'A2', team: 'away', position: { x: W * 0.7, y: 3.5 }, role: 'baseline' },
  ],
}
