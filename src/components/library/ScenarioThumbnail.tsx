import { getCourtConfig } from '@/domain/sports'
import type { Scenario } from '@/domain/models/scenario'

/**
 * Small SVG preview of a scenario — court rectangle, net line, players, and the
 * ball if it exists on the first step. Avoids spinning up a Konva stage.
 */
export function ScenarioThumbnail({ scenario }: { scenario: Scenario }) {
  const court = getCourtConfig(scenario.sport)
  const step = scenario.steps[0]
  if (!step) return null

  const padding = 1
  const w = court.width + padding * 2
  const h = court.height + padding * 2

  return (
    <svg
      viewBox={`-${padding} -${padding} ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id={`grad-${scenario.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f5a4b" />
          <stop offset="100%" stopColor="#0d3f33" />
        </linearGradient>
      </defs>
      <rect
        x={0}
        y={0}
        width={court.width}
        height={court.height}
        rx={0.3}
        fill={`url(#grad-${scenario.id})`}
        stroke="#7af7c8"
        strokeWidth={0.06}
        opacity={0.95}
      />
      <line
        x1={0}
        y1={court.netY}
        x2={court.width}
        y2={court.netY}
        stroke="#0b0b0b"
        strokeWidth={0.12}
      />
      {step.playerPositions.map((p) => {
        const player = scenario.players.find((pl) => pl.id === p.playerId)
        if (!player) return null
        const fill = player.team === 'home' ? '#7af7c8' : '#fb7185'
        return (
          <circle
            key={player.id}
            cx={p.x}
            cy={p.y}
            r={0.55}
            fill={fill}
            stroke="#0a0a0b"
            strokeWidth={0.06}
          />
        )
      })}
      {step.ballPath && step.ballPath.points[0] && (
        <circle
          cx={step.ballPath.points[0].x}
          cy={step.ballPath.points[0].y}
          r={0.28}
          fill="#fde047"
          stroke="#0a0a0b"
          strokeWidth={0.04}
        />
      )}
    </svg>
  )
}
