import { useEffect, useState } from 'react'
import { Modal } from '../ui/Modal'
import { useUIStore } from '@/store/uiStore'
import { useScenarioStore } from '@/store/scenarioStore'
import { deleteScenario, listScenarios } from '@/services/scenarios'
import { COURT_CONFIGS } from '@/domain/sports'
import type { Scenario } from '@/domain/models/scenario'
import { timeAgo } from '@/lib/timeAgo'
import { ScenarioThumbnail } from './ScenarioThumbnail'

export function LibraryPanel() {
  const open = useUIStore((s) => s.libraryOpen)
  const close = useUIStore((s) => s.closeLibrary)
  const showToast = useUIStore((s) => s.showToast)

  const replaceScenario = useScenarioStore((s) => s.replaceScenario)
  const newScenario = useScenarioStore((s) => s.newScenario)
  const currentId = useScenarioStore((s) => s.scenario.id)

  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    listScenarios()
      .then(setScenarios)
      .finally(() => setLoading(false))
  }, [open])

  const handleLoad = (scenario: Scenario) => {
    replaceScenario(scenario)
    close()
    showToast(`Loaded “${scenario.title}”`)
  }

  const handleDelete = async (id: string) => {
    await deleteScenario(id)
    setScenarios((prev) => prev.filter((s) => s.id !== id))
    setConfirmDelete(null)
    showToast('Scenario deleted')
  }

  const handleNew = () => {
    newScenario()
    close()
    showToast('Started new scenario')
  }

  return (
    <Modal
      open={open}
      onClose={close}
      size="lg"
      title="Library"
      description={
        scenarios.length === 0
          ? 'Your saved scenarios will appear here.'
          : `${scenarios.length} scenario${scenarios.length === 1 ? '' : 's'} on this device.`
      }
    >
      <div className="space-y-3">
        <button
          onClick={handleNew}
          className="btn btn-primary w-full text-sm"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          New scenario
        </button>

        {loading ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.02]"
              />
            ))}
          </div>
        ) : scenarios.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="grid max-h-[60vh] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
            {scenarios.map((s) => (
              <li
                key={s.id}
                className={`group flex items-stretch overflow-hidden rounded-xl border bg-white/[0.02] transition ${
                  currentId === s.id
                    ? 'border-accent/40 ring-1 ring-accent/30'
                    : 'border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex aspect-[1/2] h-24 w-12 shrink-0 items-center justify-center bg-ink-950/40 p-1">
                  <ScenarioThumbnail scenario={s} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold">{s.title}</span>
                      {currentId === s.id && (
                        <span className="chip text-accent border-accent/30 bg-accent/10 px-1.5 py-0">
                          Open
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-[11px] text-ink-400">
                      {COURT_CONFIGS[s.sport].displayName} · {timeAgo(s.updatedAt)}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <button
                      onClick={() => handleLoad(s)}
                      className="btn btn-primary px-2 py-1 text-[11px]"
                    >
                      Load
                    </button>
                    {confirmDelete === s.id ? (
                      <>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="btn px-2 py-1 text-[11px] text-rose-300 ring-1 ring-rose-500/30 hover:bg-rose-500/15"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="btn btn-ghost px-2 py-1 text-[11px]"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(s.id)}
                        className="btn btn-ghost px-2 py-1 text-[11px] text-ink-400 hover:text-rose-300"
                        aria-label="Delete"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  )
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02] p-6 text-center">
      <p className="text-sm text-ink-200">No saved scenarios yet</p>
      <p className="mt-1 text-xs text-ink-400">
        Build a tactic, then hit <span className="text-accent">Save</span> in the top bar.
      </p>
    </div>
  )
}
