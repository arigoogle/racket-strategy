import { useEffect, useState } from 'react'
import { Modal } from '../ui/Modal'
import { useUIStore } from '@/store/uiStore'
import { useScenarioStore } from '@/store/scenarioStore'
import { saveScenario } from '@/services/scenarios'

const PLACEHOLDER = 'Untitled scenario'

export function SaveDialog() {
  const open = useUIStore((s) => s.saveDialogOpen)
  const close = useUIStore((s) => s.closeSaveDialog)
  const showToast = useUIStore((s) => s.showToast)

  const scenario = useScenarioStore((s) => s.scenario)
  const replaceScenario = useScenarioStore((s) => s.replaceScenario)

  const initialTitle = scenario.title === PLACEHOLDER ? '' : scenario.title
  const [title, setTitle] = useState(initialTitle)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) setTitle(scenario.title === PLACEHOLDER ? '' : scenario.title)
  }, [open, scenario.title])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    try {
      const finalTitle = title.trim() || PLACEHOLDER
      const saved = await saveScenario({ ...scenario, title: finalTitle })
      replaceScenario(saved)
      close()
      showToast(`Saved “${finalTitle}”`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Save scenario"
      description="Stored locally on this device — works offline."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest2 text-ink-400">
            Title
          </span>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Cover parallel and the middle"
            maxLength={80}
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-ink-50 placeholder:text-ink-500 transition focus:border-accent/40 focus:bg-white/[0.06] focus:outline-none"
          />
        </label>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={close}
            disabled={saving}
            className="btn btn-ghost text-xs"
          >
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn btn-primary text-xs">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
