import { Circle, Group } from 'react-konva'
import type Konva from 'konva'
import type { Point } from '@/domain/models/geometry'
import type { CourtConfig } from '@/domain/sports'
import { clamp } from '@/domain/models/geometry'
import type { CourtViewport } from '../court/useCourtViewport'

interface BallNodeProps {
  point: Point
  court: CourtConfig
  viewport: CourtViewport
  onMove: (point: Point) => void
}

export function BallNode({ point, court, viewport, onMove }: BallNodeProps) {
  const stagePos = viewport.toStage(point.x, point.y)
  const r = Math.max(viewport.scale * 0.18, 6)

  const onDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target
    const { x, y } = viewport.toCourt(node.x(), node.y())
    const cx = clamp(x, 0, court.width)
    const cy = clamp(y, 0, court.height)
    const corrected = viewport.toStage(cx, cy)
    node.position(corrected)
  }

  const onDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target
    const { x, y } = viewport.toCourt(node.x(), node.y())
    onMove({ x: clamp(x, 0, court.width), y: clamp(y, 0, court.height) })
  }

  return (
    <Group
      x={stagePos.x}
      y={stagePos.y}
      draggable
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onMouseEnter={(e) => {
        const stage = e.target.getStage()
        if (stage) stage.container().style.cursor = 'grab'
      }}
      onMouseDown={(e) => {
        const stage = e.target.getStage()
        if (stage) stage.container().style.cursor = 'grabbing'
      }}
      onMouseUp={(e) => {
        const stage = e.target.getStage()
        if (stage) stage.container().style.cursor = 'grab'
      }}
      onMouseLeave={(e) => {
        const stage = e.target.getStage()
        if (stage) stage.container().style.cursor = 'default'
      }}
    >
      {/* aura */}
      <Circle radius={r + 6} fill="rgba(250, 204, 21, 0.18)" listening={false} />
      <Circle radius={r + 3} fill="rgba(250, 204, 21, 0.28)" listening={false} />
      {/* shadow */}
      <Circle radius={r + 0.5} fill="#000" opacity={0.45} y={1.5} listening={false} />
      {/* body — fluorescent ball */}
      <Circle
        radius={r}
        fillRadialGradientStartPoint={{ x: -r * 0.4, y: -r * 0.5 }}
        fillRadialGradientStartRadius={0}
        fillRadialGradientEndPoint={{ x: 0, y: 0 }}
        fillRadialGradientEndRadius={r}
        fillRadialGradientColorStops={[0, '#ffffff', 0.3, '#fde047', 1, '#a16207']}
        stroke="#fef9c3"
        strokeWidth={1}
      />
    </Group>
  )
}
