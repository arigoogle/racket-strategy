import { Arrow, Circle, Group } from 'react-konva'
import type { Point } from '@/domain/models/geometry'
import type { CourtViewport } from '../court/useCourtViewport'

interface PathDraftLayerProps {
  points: Point[]
  cursor: Point | null
  viewport: CourtViewport
}

export function PathDraftLayer({ points, cursor, viewport }: PathDraftLayerProps) {
  if (points.length === 0) return null
  const all = cursor ? [...points, cursor] : points
  if (all.length < 2) {
    // show just the start node
    const s = viewport.toStage(points[0].x, points[0].y)
    return <Circle x={s.x} y={s.y} radius={6} fill="#7af7c8" opacity={0.8} listening={false} />
  }
  const flat = all.flatMap((p) => {
    const s = viewport.toStage(p.x, p.y)
    return [s.x, s.y]
  })

  return (
    <Group listening={false}>
      <Arrow
        points={flat}
        stroke="#7af7c8"
        fill="#7af7c8"
        strokeWidth={Math.max(viewport.scale * 0.06, 2)}
        pointerLength={Math.max(viewport.scale * 0.34, 10)}
        pointerWidth={Math.max(viewport.scale * 0.3, 10)}
        dash={[10, 6]}
        opacity={0.9}
        lineCap="round"
        lineJoin="round"
        tension={0.15}
        shadowColor="#7af7c8"
        shadowBlur={8}
        shadowOpacity={0.5}
      />
      {points.map((p, i) => {
        const s = viewport.toStage(p.x, p.y)
        return (
          <Circle
            key={i}
            x={s.x}
            y={s.y}
            radius={5}
            fill="#ffffff"
            stroke="#7af7c8"
            strokeWidth={2}
          />
        )
      })}
    </Group>
  )
}
