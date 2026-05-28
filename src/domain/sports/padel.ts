import type { CourtConfig } from './types'

// Official padel court — 20m long × 10m wide.
//
// Coordinate system (portrait, top-down):
//   x: 0 → 10 m  (width)
//   y: 0 → 20 m  (length)
//
// Key dimensions:
//   Net                   y = 10   (dead center)
//   Service line top      y = 3    (3 m from top baseline, 7 m from net)
//   Service line bottom   y = 17   (3 m from bottom baseline, 7 m from net)
//   Center service line   x = 5    (from service line to net, each half)
//   Service box           7 m deep × 5 m wide

const W = 10
const H = 20
const NET_Y = H / 2                    // 10 m
const SVC_FROM_BASELINE = 3            // 3 m from each baseline
const SVC_Y_TOP = SVC_FROM_BASELINE    // 3 m
const SVC_Y_BOT = H - SVC_FROM_BASELINE // 17 m

export const PADEL_DOUBLES: CourtConfig = {
  sport: 'padel_doubles',
  displayName: 'Padel · Doubles',
  shortName: 'Padel',
  width: W,
  height: H,
  hasWalls: true,
  netY: NET_Y,
  lines: [
    // Outer boundary
    {
      id: 'outer',
      points: [
        { x: 0, y: 0 }, { x: W, y: 0 }, { x: W, y: H }, { x: 0, y: H }, { x: 0, y: 0 },
      ],
      weight: 0.08,
    },
    // Net (y = 10)
    {
      id: 'net',
      points: [{ x: 0, y: NET_Y }, { x: W, y: NET_Y }],
      weight: 0.12,
    },
    // Service lines — 3 m from each baseline (7 m from net)
    {
      id: 'svc-top',
      points: [{ x: 0, y: SVC_Y_TOP }, { x: W, y: SVC_Y_TOP }],
      weight: 0.05,
    },
    {
      id: 'svc-bottom',
      points: [{ x: 0, y: SVC_Y_BOT }, { x: W, y: SVC_Y_BOT }],
      weight: 0.05,
    },
    // Center service line — divides service boxes, from service line to net
    {
      id: 'csl-top',
      points: [{ x: W / 2, y: SVC_Y_TOP }, { x: W / 2, y: NET_Y }],
      weight: 0.05,
    },
    {
      id: 'csl-bottom',
      points: [{ x: W / 2, y: NET_Y }, { x: W / 2, y: SVC_Y_BOT }],
      weight: 0.05,
    },
  ],
  regions: [],
  defaultPlayers: [
    // Home (bottom half) — standard baseline starting positions
    { label: 'H1', team: 'home', position: { x: W * 0.28, y: H - 1.5 }, role: 'baseline' },
    { label: 'H2', team: 'home', position: { x: W * 0.72, y: H - 1.5 }, role: 'baseline' },
    // Away (top half) — standard baseline starting positions
    { label: 'A1', team: 'away', position: { x: W * 0.28, y: 1.5 }, role: 'baseline' },
    { label: 'A2', team: 'away', position: { x: W * 0.72, y: 1.5 }, role: 'baseline' },
  ],
}
