import type { CourtConfig } from './types'

// Tennis court — full doubles 10.97m × 23.77m. Net at center.
// Service line 6.4m from net. Singles sidelines are 1.37m inside doubles sidelines.

const W = 10.97
const H = 23.77
const NET_Y = H / 2
const SERVICE_OFFSET = 6.4
const ALLEY = 1.37

const baseLines = [
  { id: 'outer', points: [
    { x: 0, y: 0 }, { x: W, y: 0 }, { x: W, y: H }, { x: 0, y: H }, { x: 0, y: 0 },
  ], weight: 0.08 },
  { id: 'net', points: [
    { x: 0, y: NET_Y }, { x: W, y: NET_Y },
  ], weight: 0.1 },
  { id: 'svc-top', points: [
    { x: ALLEY, y: NET_Y - SERVICE_OFFSET }, { x: W - ALLEY, y: NET_Y - SERVICE_OFFSET },
  ], weight: 0.05 },
  { id: 'svc-bottom', points: [
    { x: ALLEY, y: NET_Y + SERVICE_OFFSET }, { x: W - ALLEY, y: NET_Y + SERVICE_OFFSET },
  ], weight: 0.05 },
  { id: 'csl', points: [
    { x: W / 2, y: NET_Y - SERVICE_OFFSET }, { x: W / 2, y: NET_Y + SERVICE_OFFSET },
  ], weight: 0.05 },
  // singles sidelines
  { id: 'singles-left', points: [
    { x: ALLEY, y: 0 }, { x: ALLEY, y: H },
  ], weight: 0.05 },
  { id: 'singles-right', points: [
    { x: W - ALLEY, y: 0 }, { x: W - ALLEY, y: H },
  ], weight: 0.05 },
  // center mark on baselines
  { id: 'center-mark-top', points: [
    { x: W / 2, y: 0 }, { x: W / 2, y: 0.3 },
  ], weight: 0.05 },
  { id: 'center-mark-bottom', points: [
    { x: W / 2, y: H - 0.3 }, { x: W / 2, y: H },
  ], weight: 0.05 },
]

export const TENNIS_SINGLES: CourtConfig = {
  sport: 'tennis_singles',
  displayName: 'Tennis · Singles',
  width: W,
  height: H,
  hasWalls: false,
  netY: NET_Y,
  lines: baseLines,
  regions: [],
  defaultPlayers: [
    { label: 'H', team: 'home', position: { x: W / 2, y: H - 1.5 }, role: 'baseline' },
    { label: 'A', team: 'away', position: { x: W / 2, y: 1.5 }, role: 'baseline' },
  ],
}

export const TENNIS_DOUBLES: CourtConfig = {
  sport: 'tennis_doubles',
  displayName: 'Tennis · Doubles',
  width: W,
  height: H,
  hasWalls: false,
  netY: NET_Y,
  lines: baseLines,
  regions: [],
  defaultPlayers: [
    { label: 'H1', team: 'home', position: { x: W * 0.3, y: H - 1.5 }, role: 'baseline' },
    { label: 'H2', team: 'home', position: { x: W * 0.7, y: H - 5.5 }, role: 'net' },
    { label: 'A1', team: 'away', position: { x: W * 0.3, y: 5.5 }, role: 'net' },
    { label: 'A2', team: 'away', position: { x: W * 0.7, y: 1.5 }, role: 'baseline' },
  ],
}
