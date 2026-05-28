import type { Point } from '../models/geometry'
import type { Sport, Team } from '../models/scenario'

export interface CourtLine {
  id: string
  points: Point[]
  /** stroke width in meters (will scale with court) */
  weight?: number
  dashed?: boolean
}

export interface CourtRegion {
  id: string
  polygon: Point[]
  label?: string
}

export interface ServingPosition {
  team: Team
  side: 'deuce' | 'ad'
  point: Point
}

export interface CourtConfig {
  sport: Sport
  displayName: string
  /** ultra-short label for mobile pills (≤8 chars) */
  shortName: string
  /** full playable area in meters (includes walls for padel) */
  width: number
  height: number
  /** for padel: includes the back glass; for tennis: just doubles alley extents */
  hasWalls: boolean
  /** the net runs horizontally at this y in meters */
  netY: number
  lines: CourtLine[]
  regions: CourtRegion[]
  /** baseline positions where players typically start each team */
  defaultPlayers: Array<{
    label: string
    team: Team
    position: Point
    role?: 'net' | 'baseline'
  }>
}
