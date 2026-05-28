import { useMemo } from 'react'
import { Group } from 'react-konva'
import type { Point } from '@/domain/models/geometry'
import type { CourtConfig } from '@/domain/sports'
import type { PlayerPosition } from '@/domain/models/scenario'
import { computeTacticalZones } from '@/domain/tactics/zones'
import type { CourtViewport } from '../court/useCourtViewport'
import { ZonePolygon } from './ZonePolygon'

interface ZonesLayerProps {
  ball: Point | null
  court: CourtConfig
  positions: PlayerPosition[]
  viewport: CourtViewport
  showCoverage: boolean
  showDanger: boolean
  reach?: number
}

export function ZonesLayer({
  ball,
  court,
  positions,
  viewport,
  showCoverage,
  showDanger,
  reach,
}: ZonesLayerProps) {
  const zones = useMemo(() => {
    if (!ball) return null
    return computeTacticalZones({ ball, court, positions, reach })
  }, [ball, court, positions, reach])

  if (!zones || zones.attack.length === 0) return null
  if (!showCoverage && !showDanger) return null

  return (
    <Group listening={false}>
      {/* Attack cone — the underlying "what could be hit" layer */}
      {showDanger && (
        <ZonePolygon
          rings={zones.attack}
          viewport={viewport}
          fill="rgba(250, 204, 21, 0.12)"
          stroke="rgba(250, 204, 21, 0.55)"
          strokeWidth={2}
          strokeOpacity={1}
        />
      )}

      {/* Coverage — painted ON TOP of attack so the difference reveals danger */}
      {showCoverage && (
        <ZonePolygon
          rings={zones.coverage}
          viewport={viewport}
          fill="rgba(94, 234, 212, 0.32)"
          stroke="rgba(122, 247, 200, 0.9)"
          strokeWidth={2}
        />
      )}

      {/* Danger outline — emphasise the exposed gap */}
      {showDanger && zones.danger.length > 0 && (
        <ZonePolygon
          rings={zones.danger}
          viewport={viewport}
          stroke="rgba(251, 191, 36, 1)"
          strokeWidth={2.5}
          dashed
        />
      )}
    </Group>
  )
}
