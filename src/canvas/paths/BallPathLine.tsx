import { Arrow, Group, Line } from 'react-konva'
import type { BallPath } from '@/domain/models/scenario'
import type { CourtViewport } from '../court/useCourtViewport'

interface BallPathLineProps {
  path: BallPath
  viewport: CourtViewport
  draft?: boolean
}

const shotColor: Record<BallPath['shotType'], string> = {
  drive: '#fde047',
  lob: '#60a5fa',
  volley: '#7af7c8',
  smash: '#f87171',
  drop: '#c084fc',
  serve: '#fbbf24',
}

export function BallPathLine({ path, viewport, draft = false }: BallPathLineProps) {
  if (path.points.length < 2) return null
  const flat = path.points.flatMap((p) => {
    const s = viewport.toStage(p.x, p.y)
    return [s.x, s.y]
  })
  const color = shotColor[path.shotType]
  const baseDash = draft ? [10, 7] : undefined

  return (
    <Group listening={false}>
      {/* halo */}
      <Line
        points={flat}
        stroke={color}
        strokeWidth={Math.max(viewport.scale * 0.18, 5)}
        opacity={0.18}
        lineCap="round"
        lineJoin="round"
        tension={0.18}
      />
      {/* arrow body */}
      <Arrow
        points={flat}
        stroke={color}
        fill={color}
        strokeWidth={Math.max(viewport.scale * 0.07, 2)}
        pointerLength={Math.max(viewport.scale * 0.38, 10)}
        pointerWidth={Math.max(viewport.scale * 0.32, 10)}
        lineCap="round"
        lineJoin="round"
        tension={0.18}
        dash={baseDash}
        shadowColor={color}
        shadowBlur={draft ? 6 : 10}
        shadowOpacity={0.5}
      />
    </Group>
  )
}
