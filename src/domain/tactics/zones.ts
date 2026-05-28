import { difference, intersect, polygon, union } from '@turf/turf'
import type { Feature, MultiPolygon, Polygon as GeoPolygon } from 'geojson'
import { featureCollection } from '@turf/helpers'
import type { Point } from '@/domain/models/geometry'
import type { CourtConfig } from '@/domain/sports'
import type { PlayerPosition } from '@/domain/models/scenario'

export interface TacticalZones {
  /** Full attack triangle from ball to defender baseline corners */
  attack: Point[][]
  /** Coverage area (intersection of defender cones with attack) */
  coverage: Point[][]
  /** Attack area minus coverage */
  danger: Point[][]
}

interface ComputeZonesArgs {
  ball: Point
  court: CourtConfig
  /** All player positions on the current step */
  positions: PlayerPosition[]
  /** Defender reach in meters from each side of the player (lateral wingspan) */
  reach?: number
  /** Multiplier on the attack cone's half-width at the defender baseline. 1 = corner-to-corner. */
  attackWidthScale?: number
}

/**
 * Returns the y-coordinate of the defender baseline (opposite side of the net from the ball).
 * Returns null if the ball sits on the net line.
 */
function defenderBaseline(ball: Point, court: CourtConfig): number | null {
  const tolerance = 0.05
  if (Math.abs(ball.y - court.netY) < tolerance) return null
  return ball.y < court.netY ? court.height : 0
}

/**
 * Find positions that are on the OPPOSITE side of the net from the ball.
 * Those players are the defenders for this scenario.
 */
function findDefenders(ball: Point, court: CourtConfig, positions: PlayerPosition[]): PlayerPosition[] {
  const ballOnTop = ball.y < court.netY
  return positions.filter((p) => (ballOnTop ? p.y > court.netY : p.y < court.netY))
}

/**
 * Project a ray from `origin` through `through`, returning the point where it
 * crosses the horizontal line y = targetY.
 */
function rayToY(origin: Point, through: Point, targetY: number): Point {
  const dy = through.y - origin.y
  if (Math.abs(dy) < 1e-9) {
    return { x: through.x, y: targetY }
  }
  const t = (targetY - origin.y) / dy
  return {
    x: origin.x + (through.x - origin.x) * t,
    y: targetY,
  }
}

function toGeoPolygon(points: Point[]): Feature<GeoPolygon> {
  const ring: [number, number][] = points.map((p) => [p.x, p.y])
  const first = ring[0]
  const last = ring[ring.length - 1]
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push(first)
  }
  return polygon([ring])
}

function featureToRings(f: Feature<GeoPolygon | MultiPolygon> | null): Point[][] {
  if (!f) return []
  const geom = f.geometry
  if (geom.type === 'Polygon') {
    return [geom.coordinates[0].slice(0, -1).map(([x, y]) => ({ x, y }))]
  }
  return geom.coordinates.map((rings) =>
    rings[0].slice(0, -1).map(([x, y]) => ({ x, y })),
  )
}

/**
 * Build the attack cone from the ball to two points on the defender baseline,
 * symmetric around the court centre. `widthScale` of 1 gives the corner-to-corner
 * default. Values >1 push the edges past the court (representing wall bounces /
 * exaggerated shot range); values <1 narrow the cone.
 */
function buildAttackTriangle(
  ball: Point,
  court: CourtConfig,
  baselineY: number,
  widthScale: number,
): Point[] {
  const midX = court.width / 2
  const halfSpan = (court.width / 2) * widthScale
  return [
    ball,
    { x: midX - halfSpan, y: baselineY },
    { x: midX + halfSpan, y: baselineY },
  ]
}

/**
 * From the ball's perspective, project each defender's lateral reach forward
 * to the defender's baseline. The resulting triangle is the angular slice
 * the defender can intercept.
 */
function buildDefenderCone(
  ball: Point,
  defender: PlayerPosition,
  baselineY: number,
  reach: number,
): Point[] {
  const left = { x: defender.x - reach, y: defender.y }
  const right = { x: defender.x + reach, y: defender.y }
  const leftEdge = rayToY(ball, left, baselineY)
  const rightEdge = rayToY(ball, right, baselineY)
  return [ball, leftEdge, rightEdge]
}

export function computeTacticalZones({
  ball,
  court,
  positions,
  reach = 1.8,
  attackWidthScale = 1,
}: ComputeZonesArgs): TacticalZones {
  const baselineY = defenderBaseline(ball, court)
  if (baselineY === null) {
    return { attack: [], coverage: [], danger: [] }
  }

  const defenders = findDefenders(ball, court, positions)
  const attackTriangle = buildAttackTriangle(ball, court, baselineY, attackWidthScale)
  const rawAttackPoly = toGeoPolygon(attackTriangle)

  // Clip the attack against the court rectangle so the polygon never bleeds
  // outside the playing surface, no matter how wide the spread is.
  const courtPoly = toGeoPolygon([
    { x: 0, y: 0 },
    { x: court.width, y: 0 },
    { x: court.width, y: court.height },
    { x: 0, y: court.height },
  ])
  const attackPoly =
    intersect(featureCollection([rawAttackPoly, courtPoly])) ?? rawAttackPoly

  if (defenders.length === 0) {
    return {
      attack: featureToRings(attackPoly),
      coverage: [],
      danger: featureToRings(attackPoly),
    }
  }

  const defenderPolys = defenders.map((d) =>
    toGeoPolygon(buildDefenderCone(ball, d, baselineY, reach)),
  )

  let coverageUnion: Feature<GeoPolygon | MultiPolygon> | null = defenderPolys[0]
  for (let i = 1; i < defenderPolys.length; i += 1) {
    coverageUnion = union(featureCollection([coverageUnion!, defenderPolys[i]]))
  }

  const coverageClipped = coverageUnion
    ? intersect(featureCollection([attackPoly, coverageUnion]))
    : null

  const danger = coverageClipped
    ? difference(featureCollection([attackPoly, coverageClipped]))
    : attackPoly

  return {
    attack: featureToRings(attackPoly),
    coverage: featureToRings(coverageClipped),
    danger: featureToRings(danger),
  }
}
