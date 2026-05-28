import { Line } from 'react-konva'
import type { Point } from '@/domain/models/geometry'
import type { CourtViewport } from '../court/useCourtViewport'

interface ZonePolygonProps {
  rings: Point[][]
  viewport: CourtViewport
  fill?: string
  stroke?: string
  strokeWidth?: number
  fillOpacity?: number
  strokeOpacity?: number
  dashed?: boolean
}

export function ZonePolygon({
  rings,
  viewport,
  fill,
  stroke,
  strokeWidth = 2,
  fillOpacity = 1,
  strokeOpacity = 1,
  dashed = false,
}: ZonePolygonProps) {
  return (
    <>
      {rings.map((ring, i) => {
        if (ring.length < 3) return null
        const flat = ring.flatMap((p) => {
          const s = viewport.toStage(p.x, p.y)
          return [s.x, s.y]
        })
        return (
          <Line
            key={i}
            points={flat}
            closed
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={fillOpacity}
            shadowForStrokeEnabled={false}
            perfectDrawEnabled={false}
            lineJoin="round"
            lineCap="round"
            dash={dashed ? [10, 8] : undefined}
            listening={false}
            // Konva does not support separate stroke vs fill opacity on Line;
            // we paint stroke as a separate translucent overlay below.
          />
        )
      })}
      {stroke &&
        rings.map((ring, i) => {
          if (ring.length < 3) return null
          const flat = ring.flatMap((p) => {
            const s = viewport.toStage(p.x, p.y)
            return [s.x, s.y]
          })
          return (
            <Line
              key={`stroke-${i}`}
              points={flat}
              closed
              stroke={stroke}
              strokeWidth={strokeWidth}
              opacity={strokeOpacity}
              shadowForStrokeEnabled={false}
              perfectDrawEnabled={false}
              lineJoin="round"
              lineCap="round"
              dash={dashed ? [10, 8] : undefined}
              listening={false}
            />
          )
        })}
    </>
  )
}
