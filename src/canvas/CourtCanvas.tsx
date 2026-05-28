import { Layer, Stage } from 'react-konva'
import type Konva from 'konva'
import { useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useScenarioStore } from '@/store/scenarioStore'
import { useEditorStore } from '@/store/editorStore'
import { getCourtConfig } from '@/domain/sports'
import { clamp, type Point } from '@/domain/models/geometry'
import { CourtSurface } from './court/CourtSurface'
import { MeasurementOverlay } from './court/MeasurementOverlay'
import { PlayerNode } from './players/PlayerNode'
import { BallNode } from './paths/BallNode'
import { BallPathLine } from './paths/BallPathLine'
import { PathDraftLayer } from './paths/PathDraftLayer'
import { ZonesLayer } from './zones/ZonesLayer'
import { useCourtViewport } from './court/useCourtViewport'

export function CourtCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  useEffect(() => setContainer(containerRef.current), [])

  const scenario = useScenarioStore((s) => s.scenario)
  const movePlayer = useScenarioStore((s) => s.movePlayer)
  const placeBall = useScenarioStore((s) => s.placeBall)
  const setBallPath = useScenarioStore((s) => s.setBallPath)

  const tool = useEditorStore((s) => s.tool)
  const setTool = useEditorStore((s) => s.setTool)
  const activeStepIndex = useEditorStore((s) => s.activeStepIndex)
  const selectedPlayerId = useEditorStore((s) => s.selectedPlayerId)
  const setSelectedPlayer = useEditorStore((s) => s.setSelectedPlayer)
  const showCoverage = useEditorStore((s) => s.showCoverage)
  const showDanger = useEditorStore((s) => s.showDangerZones)
  const showMeasurements = useEditorStore((s) => s.showMeasurements)
  const coverageReach = useEditorStore((s) => s.coverageReach)
  const attackWidthScale = useEditorStore((s) => s.attackWidthScale)

  const court = getCourtConfig(scenario.sport)
  const viewport = useCourtViewport({ container, court })
  const step = scenario.steps[activeStepIndex]
  const ball = step?.ballPath?.points[0]

  // Path-draft state — collects points while the user is drawing.
  const [draftPoints, setDraftPoints] = useState<Point[]>([])
  const [cursor, setCursor] = useState<Point | null>(null)

  // When tool changes away from 'path', commit or discard any in-flight draft.
  useEffect(() => {
    if (tool !== 'path' && draftPoints.length > 0) {
      if (draftPoints.length >= 2) {
        setBallPath(activeStepIndex, {
          points: draftPoints,
          shotType: 'drive',
          speed: 'medium',
        })
      }
      setDraftPoints([])
      setCursor(null)
    }
  }, [tool, draftPoints, activeStepIndex, setBallPath])

  // Keyboard: Enter finishes path, Esc cancels.
  useEffect(() => {
    if (tool !== 'path') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (draftPoints.length >= 2) {
          setBallPath(activeStepIndex, {
            points: draftPoints,
            shotType: 'drive',
            speed: 'medium',
          })
        }
        setDraftPoints([])
        setCursor(null)
        setTool('select')
      } else if (e.key === 'Escape') {
        setDraftPoints([])
        setCursor(null)
        setTool('select')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tool, draftPoints, activeStepIndex, setBallPath, setTool])

  const stageToCourtPoint = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>): Point | null => {
      const stage = e.target.getStage()
      if (!stage) return null
      const pointer = stage.getPointerPosition()
      if (!pointer) return null
      const { x, y } = viewport.toCourt(pointer.x, pointer.y)
      return { x: clamp(x, 0, court.width), y: clamp(y, 0, court.height) }
    },
    [viewport, court.width, court.height],
  )

  const onStageDown = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const isBackground = e.target === e.target.getStage()

    if (tool === 'select') {
      if (isBackground) setSelectedPlayer(null)
      return
    }

    const pt = stageToCourtPoint(e)
    if (!pt) return

    if (tool === 'ball') {
      placeBall(activeStepIndex, pt)
      return
    }

    if (tool === 'path') {
      // First click without a ball uses the ball-start. If there's already a ball,
      // we seed the draft from the ball position. Otherwise the first click becomes the origin.
      setDraftPoints((prev) => {
        if (prev.length === 0) {
          const start = ball ?? pt
          return ball ? [start, pt] : [pt]
        }
        return [...prev, pt]
      })
    }
  }

  const onStageMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (tool !== 'path' || draftPoints.length === 0) return
    const pt = stageToCourtPoint(e)
    if (pt) setCursor(pt)
  }

  const onStageDblClick = () => {
    if (tool !== 'path') return
    if (draftPoints.length >= 2) {
      setBallPath(activeStepIndex, {
        points: draftPoints,
        shotType: 'drive',
        speed: 'medium',
      })
    }
    setDraftPoints([])
    setCursor(null)
    setTool('select')
  }

  const showGlow = tool !== 'select'
  const cursorCss =
    tool === 'ball'
      ? 'cursor-crosshair'
      : tool === 'path'
      ? 'cursor-crosshair'
      : 'cursor-default'

  return (
    <div
      ref={containerRef}
      className={clsx(
        'relative h-full w-full overflow-hidden grid-court-dot transition touch-none select-none',
        cursorCss,
      )}
    >
      {showGlow && (
        <div className="pointer-events-none absolute inset-2 rounded-2xl ring-1 ring-accent/30 shadow-[inset_0_0_60px_rgba(122,247,200,0.08)]" />
      )}
      {viewport.stageWidth > 0 && (
        <Stage
          width={viewport.stageWidth}
          height={viewport.stageHeight}
          onMouseDown={onStageDown}
          onTouchStart={onStageDown}
          onMouseMove={onStageMouseMove}
          onDblClick={onStageDblClick}
          onDblTap={onStageDblClick}
        >
          <Layer listening={false}>
            <CourtSurface court={court} viewport={viewport} />
            {showMeasurements && (
              <MeasurementOverlay court={court} viewport={viewport} />
            )}
          </Layer>

          {/* Tactical zones — between court and players */}
          {ball && (
            <Layer listening={false}>
              <ZonesLayer
                ball={ball}
                court={court}
                positions={step?.playerPositions ?? []}
                viewport={viewport}
                showCoverage={showCoverage}
                showDanger={showDanger}
                reach={coverageReach}
                attackWidthScale={attackWidthScale}
              />
            </Layer>
          )}

          {/* Persisted ball path (not while drawing) */}
          {step?.ballPath && draftPoints.length === 0 && (
            <Layer listening={false}>
              <BallPathLine path={step.ballPath} viewport={viewport} />
            </Layer>
          )}

          {/* Draft polyline */}
          {tool === 'path' && draftPoints.length > 0 && (
            <Layer listening={false}>
              <PathDraftLayer points={draftPoints} cursor={cursor} viewport={viewport} />
            </Layer>
          )}

          {/* Players */}
          <Layer>
            {step?.playerPositions.map((pos) => {
              const player = scenario.players.find((p) => p.id === pos.playerId)
              if (!player) return null
              return (
                <PlayerNode
                  key={player.id}
                  player={player}
                  position={pos}
                  court={court}
                  viewport={viewport}
                  selected={selectedPlayerId === player.id}
                  onSelect={setSelectedPlayer}
                  onMove={(id, x, y) => movePlayer(activeStepIndex, id, x, y)}
                />
              )
            })}
          </Layer>

          {/* Ball — on its own top layer so it sits above everything except cones */}
          {ball && tool !== 'path' && (
            <Layer>
              <BallNode
                point={ball}
                court={court}
                viewport={viewport}
                onMove={(p) => placeBall(activeStepIndex, p)}
              />
            </Layer>
          )}
        </Stage>
      )}

      {/* Tool hint overlay */}
      <ToolHint tool={tool} drafting={draftPoints.length > 0} />
    </div>
  )
}

function ToolHint({ tool, drafting }: { tool: string; drafting: boolean }) {
  const text =
    tool === 'ball'
      ? 'Click the court to place / move the ball'
      : tool === 'path'
      ? drafting
        ? 'Click to add waypoints · Enter or double-click to finish · Esc to cancel'
        : 'Click on the court to start a ball path'
      : tool === 'cone'
      ? 'Cone tool — coming soon'
      : null
  if (!text) return null
  return (
    <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
      <div className="chip text-accent border-accent/30 bg-accent/10">{text}</div>
    </div>
  )
}
