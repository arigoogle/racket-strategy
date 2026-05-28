import clsx from 'clsx'
import {
  ATTACK_WIDTH_DEFAULT,
  ATTACK_WIDTH_MAX,
  ATTACK_WIDTH_MIN,
  COVERAGE_REACH_DEFAULT,
  COVERAGE_REACH_MAX,
  COVERAGE_REACH_MIN,
  useEditorStore,
} from '@/store/editorStore'
import { useScenarioStore } from '@/store/scenarioStore'
import { getCourtConfig } from '@/domain/sports'
import type { ShotSpeed, ShotType } from '@/domain/models/scenario'
import { RangeSlider } from '../ui/RangeSlider'

const SHOT_TYPES: ShotType[] = ['drive', 'lob', 'volley', 'smash', 'drop', 'serve']
const SHOT_SPEEDS: ShotSpeed[] = ['slow', 'medium', 'fast']

interface InspectorPanelProps {
  mobile?: boolean
}

export function InspectorPanel({ mobile = false }: InspectorPanelProps) {
  const scenario = useScenarioStore((s) => s.scenario)
  const reset = useScenarioStore((s) => s.resetToDefault)
  const clearBall = useScenarioStore((s) => s.clearBall)
  const setShotType = useScenarioStore((s) => s.setShotType)
  const setShotSpeed = useScenarioStore((s) => s.setShotSpeed)
  const setTitle = useScenarioStore((s) => s.setTitle)

  const selectedId = useEditorStore((s) => s.selectedPlayerId)
  const activeStepIndex = useEditorStore((s) => s.activeStepIndex)
  const showCoverage = useEditorStore((s) => s.showCoverage)
  const showDanger = useEditorStore((s) => s.showDangerZones)
  const toggleCoverage = useEditorStore((s) => s.toggleCoverage)
  const toggleDanger = useEditorStore((s) => s.toggleDangerZones)
  const coverageReach = useEditorStore((s) => s.coverageReach)
  const setCoverageReach = useEditorStore((s) => s.setCoverageReach)
  const attackWidthScale = useEditorStore((s) => s.attackWidthScale)
  const setAttackWidthScale = useEditorStore((s) => s.setAttackWidthScale)

  const court = getCourtConfig(scenario.sport)
  const step = scenario.steps[activeStepIndex]
  const selectedPos = step?.playerPositions.find((p) => p.playerId === selectedId)
  const selectedPlayer = scenario.players.find((p) => p.id === selectedId)
  const ballPath = step?.ballPath
  const ball = ballPath?.points[0]
  const hasPath = (ballPath?.points.length ?? 0) >= 2

  return (
    <aside
      className={clsx(
        'flex flex-col gap-4 overflow-y-auto p-4',
        mobile ? 'h-full w-full' : 'panel h-full w-72',
      )}
    >
      {!mobile && (
        <header className="flex flex-col gap-2">
          <span className="chip self-start text-accent border-accent/30 bg-accent/10">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" /> Scenario
          </span>
          <input
            value={scenario.title}
            onChange={(e) => setTitle(e.target.value)}
            className="-mx-1 rounded-md bg-transparent px-1 text-lg font-semibold tracking-tight text-ink-50 transition hover:bg-white/[0.04] focus:bg-white/[0.06] focus:outline-none"
            aria-label="Scenario title"
            maxLength={80}
          />
          <p className="text-xs text-ink-300">{court.displayName}</p>
        </header>
      )}

      <section className="space-y-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest2 text-ink-400">
          Visualization
        </h3>
        <ToggleRow label="Coverage zones" enabled={showCoverage} onToggle={toggleCoverage} />
        <ToggleRow label="Danger zones" enabled={showDanger} onToggle={toggleDanger} />
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <RangeSlider
            label="Attack spread"
            value={attackWidthScale}
            min={ATTACK_WIDTH_MIN}
            max={ATTACK_WIDTH_MAX}
            step={0.1}
            unit="×"
            onChange={setAttackWidthScale}
            onReset={() => setAttackWidthScale(ATTACK_WIDTH_DEFAULT)}
          />
          <p className="mt-2 text-[10px] leading-relaxed text-ink-400">
            How wide the attacker can place the ball. 1× = corner-to-corner.
            Above 1× picks up extra lateral angles (shots that land short along the sidelines).
            Always clipped to the court — nothing leaves the playing surface.
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <RangeSlider
            label="Defender reach"
            value={coverageReach}
            min={COVERAGE_REACH_MIN}
            max={COVERAGE_REACH_MAX}
            step={0.1}
            unit=" m"
            onChange={setCoverageReach}
            onReset={() => setCoverageReach(COVERAGE_REACH_DEFAULT)}
          />
          <p className="mt-2 text-[10px] leading-relaxed text-ink-400">
            Lateral wingspan each defender covers when intercepting. Wider reach &rarr;
            larger cyan area &rarr; smaller danger zone.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest2 text-ink-400">
          Ball
        </h3>
        {ball ? (
          <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">
                {hasPath ? 'Shot in progress' : 'Ball placed'}
              </span>
              <button
                onClick={() => clearBall(activeStepIndex)}
                className="text-[11px] text-ink-300 hover:text-accent transition"
              >
                Clear
              </button>
            </div>
            <dl className="grid grid-cols-2 gap-2 text-xs">
              <DataCell label="x" value={`${ball.x.toFixed(2)} m`} />
              <DataCell label="y" value={`${ball.y.toFixed(2)} m`} />
            </dl>
            {hasPath && ballPath && (
              <>
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-widest2 text-ink-400">Shot type</p>
                  <div className="grid grid-cols-3 gap-1">
                    {SHOT_TYPES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setShotType(activeStepIndex, t)}
                        className={clsx(
                          'rounded-md px-2 py-1 text-[11px] font-medium capitalize transition',
                          ballPath.shotType === t
                            ? 'bg-accent/15 text-accent ring-1 ring-accent/30'
                            : 'bg-white/[0.03] text-ink-200 hover:bg-white/[0.06]',
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-widest2 text-ink-400">Speed</p>
                  <div className="grid grid-cols-3 gap-1">
                    {SHOT_SPEEDS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setShotSpeed(activeStepIndex, s)}
                        className={clsx(
                          'rounded-md px-2 py-1 text-[11px] font-medium capitalize transition',
                          ballPath.speed === s
                            ? 'bg-accent/15 text-accent ring-1 ring-accent/30'
                            : 'bg-white/[0.03] text-ink-200 hover:bg-white/[0.06]',
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-xs text-ink-400">
            Select the <span className="text-accent">Ball</span> tool, then click the court to place it.
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest2 text-ink-400">
          Selection
        </h3>
        {selectedPlayer && selectedPos ? (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{selectedPlayer.label}</span>
              <span
                className={`chip ${
                  selectedPlayer.team === 'home'
                    ? 'text-team-home border-team-homeBorder/40 bg-team-homeBorder/10'
                    : 'text-team-away border-team-awayBorder/40 bg-team-awayBorder/10'
                }`}
              >
                {selectedPlayer.team}
              </span>
            </div>
            <dl className="grid grid-cols-2 gap-2 text-xs">
              <DataCell label="x" value={`${selectedPos.x.toFixed(2)} m`} />
              <DataCell label="y" value={`${selectedPos.y.toFixed(2)} m`} />
            </dl>
            {selectedPlayer.role && (
              <p className="text-[11px] text-ink-300">Role · {selectedPlayer.role}</p>
            )}
          </div>
        ) : (
          <p className="text-xs text-ink-400">Tap a player to inspect position.</p>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest2 text-ink-400">
          Court
        </h3>
        <dl className="grid grid-cols-2 gap-2 text-xs">
          <DataCell label="width" value={`${court.width} m`} />
          <DataCell label="length" value={`${court.height} m`} />
          <DataCell label="players" value={`${scenario.players.length}`} />
          <DataCell label="steps" value={`${scenario.steps.length}`} />
        </dl>
      </section>

      <div className="mt-auto flex flex-col gap-2">
        <button className="btn btn-ghost" onClick={() => reset()}>
          Reset formation
        </button>
        <p className="text-[10px] uppercase tracking-widest2 text-ink-500">
          v0.1 · MVP slice
        </p>
      </div>
    </aside>
  )
}

function ToggleRow({
  label,
  enabled,
  onToggle,
}: {
  label: string
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-sm transition hover:bg-white/[0.05]"
    >
      <span className="text-ink-100">{label}</span>
      <span
        className={`flex h-5 w-9 items-center rounded-full border transition ${
          enabled
            ? 'border-accent/40 bg-accent/30 justify-end'
            : 'border-white/10 bg-white/[0.04] justify-start'
        }`}
      >
        <span
          className={`mx-0.5 h-4 w-4 rounded-full transition ${
            enabled ? 'bg-accent shadow-glow' : 'bg-ink-300'
          }`}
        />
      </span>
    </button>
  )
}

function DataCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-2.5 py-1.5">
      <div className="text-[10px] uppercase tracking-widest2 text-ink-400">{label}</div>
      <div className="font-mono text-sm text-ink-50">{value}</div>
    </div>
  )
}
