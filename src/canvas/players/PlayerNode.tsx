import { Circle, Group, Text } from 'react-konva'
import type Konva from 'konva'
import { useRef } from 'react'
import type { Player, PlayerPosition } from '@/domain/models/scenario'
import type { CourtConfig } from '@/domain/sports'
import type { CourtViewport } from '../court/useCourtViewport'
import { clamp } from '@/domain/models/geometry'

interface PlayerNodeProps {
  player: Player
  position: PlayerPosition
  court: CourtConfig
  viewport: CourtViewport
  selected: boolean
  onSelect: (id: string) => void
  onMove: (id: string, x: number, y: number) => void
}

const palette = {
  home: { fill: '#7af7c8', border: '#34d399', text: '#062e23', glow: 'rgba(122,247,200,0.45)' },
  away: { fill: '#fb7185', border: '#f43f5e', text: '#3a0612', glow: 'rgba(251,113,133,0.45)' },
}

export function PlayerNode({
  player,
  position,
  court,
  viewport,
  selected,
  onSelect,
  onMove,
}: PlayerNodeProps) {
  const groupRef = useRef<Konva.Group>(null)
  const stagePos = viewport.toStage(position.x, position.y)
  const radius = Math.max(viewport.scale * 0.55, 14)
  const colors = palette[player.team]

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target
    // Convert current stage coords back to court space
    const { x, y } = viewport.toCourt(node.x(), node.y())
    const cx = clamp(x, 0, court.width)
    const cy = clamp(y, 0, court.height)
    // Reflect clamping back to the node so it does not escape the court
    const corrected = viewport.toStage(cx, cy)
    node.position({ x: corrected.x, y: corrected.y })
  }

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target
    const { x, y } = viewport.toCourt(node.x(), node.y())
    const cx = clamp(x, 0, court.width)
    const cy = clamp(y, 0, court.height)
    onMove(player.id, cx, cy)
  }

  return (
    <Group
      ref={groupRef}
      x={stagePos.x}
      y={stagePos.y}
      draggable
      onClick={() => onSelect(player.id)}
      onTap={() => onSelect(player.id)}
      onDragStart={() => onSelect(player.id)}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
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
      {/* Outer glow / selection ring */}
      <Circle
        radius={radius + (selected ? 10 : 6)}
        fill={colors.glow}
        opacity={selected ? 0.55 : 0.25}
        listening={false}
      />
      {/* Shadow */}
      <Circle
        radius={radius + 1}
        fill="#000"
        opacity={0.35}
        y={2}
        listening={false}
      />
      {/* Body */}
      <Circle
        radius={radius}
        fillRadialGradientStartPoint={{ x: -radius * 0.3, y: -radius * 0.4 }}
        fillRadialGradientStartRadius={0}
        fillRadialGradientEndPoint={{ x: 0, y: 0 }}
        fillRadialGradientEndRadius={radius}
        fillRadialGradientColorStops={[0, '#ffffff', 0.4, colors.fill, 1, colors.border]}
        stroke={selected ? '#ffffff' : colors.border}
        strokeWidth={selected ? 2.5 : 1.5}
        hitStrokeWidth={Math.max(radius * 0.8, 20)}
      />
      {/* Label */}
      <Text
        text={player.label}
        fontSize={radius * 0.95}
        fontStyle="700"
        fontFamily='Inter, system-ui, sans-serif'
        fill={colors.text}
        align="center"
        verticalAlign="middle"
        offsetX={radius}
        offsetY={radius}
        width={radius * 2}
        height={radius * 2}
        listening={false}
      />
    </Group>
  )
}
