import { Group, Line, Rect, Text } from 'react-konva'
import type { CourtConfig } from '@/domain/sports'
import type { CourtViewport } from './useCourtViewport'

interface MeasurementOverlayProps {
  court: CourtConfig
  viewport: CourtViewport
}

/**
 * Renders y-axis distance markers along the left edge of the court.
 * Pulls every distinct horizontal line from the court config (baselines,
 * service lines, net) so the marker set is dimension-driven, not hardcoded.
 */
export function MeasurementOverlay({ court, viewport }: MeasurementOverlayProps) {
  const ys = new Set<number>()
  ys.add(0)
  ys.add(court.height)
  ys.add(court.netY)
  for (const line of court.lines) {
    if (line.points.length >= 2 && line.points.every((p) => p.y === line.points[0].y)) {
      ys.add(line.points[0].y)
    }
  }
  const sorted = [...ys].sort((a, b) => a - b)

  return (
    <Group listening={false}>
      {sorted.map((y) => {
        const stage = viewport.toStage(0, y)
        const isNet = y === court.netY
        const isBaseline = y === 0 || y === court.height
        const dist = y // canonical meters from top baseline
        const label = isNet ? `${dist} m · net` : `${dist} m`
        const labelW = isNet ? 70 : 36
        const accent = isNet ? '#fde047' : isBaseline ? '#7af7c8' : '#ffffff'

        return (
          <Group key={y}>
            <Line
              points={[stage.x + 4, stage.y, stage.x + 14, stage.y]}
              stroke={accent}
              strokeWidth={1.5}
              opacity={0.85}
            />
            <Rect
              x={stage.x + 18}
              y={stage.y - 9}
              width={labelW}
              height={18}
              cornerRadius={4}
              fill="rgba(8, 8, 10, 0.78)"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />
            <Text
              text={label}
              x={stage.x + 22}
              y={stage.y - 6}
              width={labelW - 8}
              height={14}
              fontSize={10.5}
              fontFamily="ui-monospace, monospace"
              fontStyle="600"
              fill={accent}
              align="left"
              verticalAlign="middle"
            />
          </Group>
        )
      })}

      {/* Width annotation along the top — confirms 10m / 10.97m */}
      {(() => {
        const a = viewport.toStage(0, 0)
        const b = viewport.toStage(court.width, 0)
        const mid = (a.x + b.x) / 2
        const label = `${court.width.toFixed(court.width % 1 === 0 ? 0 : 2)} m wide`
        return (
          <Group>
            <Line
              points={[a.x + 4, a.y - 18, b.x - 4, a.y - 18]}
              stroke="#7af7c8"
              strokeWidth={1.2}
              opacity={0.7}
              dash={[6, 4]}
            />
            <Rect
              x={mid - 38}
              y={a.y - 30}
              width={76}
              height={18}
              cornerRadius={4}
              fill="rgba(8, 8, 10, 0.78)"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />
            <Text
              text={label}
              x={mid - 38}
              y={a.y - 27}
              width={76}
              height={14}
              fontSize={10.5}
              fontFamily="ui-monospace, monospace"
              fontStyle="600"
              fill="#7af7c8"
              align="center"
              verticalAlign="middle"
            />
          </Group>
        )
      })()}
    </Group>
  )
}
