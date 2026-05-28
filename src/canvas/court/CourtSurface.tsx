import { Group, Line, Rect } from 'react-konva'
import type { CourtConfig } from '@/domain/sports'
import type { CourtViewport } from './useCourtViewport'

const surfaceColors: Record<CourtConfig['sport'], { fill: string; line: string; accent: string }> = {
  padel_doubles: { fill: '#1a5a4b', line: '#f4f1e8', accent: '#0f3b32' },
  tennis_singles: { fill: '#1f4e83', line: '#f4f1e8', accent: '#143560' },
  tennis_doubles: { fill: '#1f4e83', line: '#f4f1e8', accent: '#143560' },
}

interface CourtSurfaceProps {
  court: CourtConfig
  viewport: CourtViewport
}

export function CourtSurface({ court, viewport }: CourtSurfaceProps) {
  const { scale, offsetX, offsetY } = viewport
  const w = court.width * scale
  const h = court.height * scale
  const palette = surfaceColors[court.sport]

  return (
    <Group listening={false}>
      {/* Outer mat / margin */}
      <Rect
        x={offsetX - 18}
        y={offsetY - 18}
        width={w + 36}
        height={h + 36}
        cornerRadius={14}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: 0, y: h + 36 }}
        fillLinearGradientColorStops={[0, palette.accent, 1, '#0a0a0b']}
        opacity={0.55}
      />
      {/* Court surface */}
      <Rect
        x={offsetX}
        y={offsetY}
        width={w}
        height={h}
        cornerRadius={6}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: w, y: h }}
        fillLinearGradientColorStops={[0, palette.fill, 1, palette.accent]}
        shadowColor="#000"
        shadowBlur={28}
        shadowOpacity={0.35}
        shadowOffsetY={6}
      />
      {/* Subtle inner sheen */}
      <Rect
        x={offsetX}
        y={offsetY}
        width={w}
        height={h * 0.5}
        cornerRadius={[6, 6, 0, 0]}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: 0, y: h * 0.5 }}
        fillLinearGradientColorStops={[0, 'rgba(255,255,255,0.06)', 1, 'rgba(255,255,255,0)']}
      />
      {/* Court lines */}
      {court.lines.map((line) => {
        const flat = line.points.flatMap((p) => {
          const s = viewport.toStage(p.x, p.y)
          return [s.x, s.y]
        })
        const isNet = line.id === 'net'
        return (
          <Line
            key={line.id}
            points={flat}
            stroke={isNet ? '#0b0b0b' : palette.line}
            strokeWidth={(line.weight ?? 0.05) * scale}
            opacity={isNet ? 0.9 : 0.95}
            lineCap="round"
            lineJoin="round"
            dash={line.dashed ? [scale * 0.3, scale * 0.2] : undefined}
            shadowColor={isNet ? '#000' : undefined}
            shadowBlur={isNet ? 6 : 0}
          />
        )
      })}
      {/* Net plate label glow */}
    </Group>
  )
}
