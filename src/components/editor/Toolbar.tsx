import clsx from 'clsx'
import { useEditorStore, type EditorTool } from '@/store/editorStore'
import { Tooltip } from '../ui/Tooltip'

const TOOLS: Array<{ id: EditorTool; label: string; hint: string; icon: JSX.Element }> = [
  {
    id: 'select',
    label: 'Select',
    hint: 'Drag players',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <path d="M5 3l14 7-6 2-2 6-6-15z" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'ball',
    label: 'Ball',
    hint: 'Place / move ball',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <circle cx="12" cy="12" r="8" />
        <path d="M4.5 9c4 1.5 11 1.5 15 0M4.5 15c4-1.5 11-1.5 15 0" />
      </svg>
    ),
  },
  {
    id: 'path',
    label: 'Path',
    hint: 'Draw ball path',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <path d="M4 18C7 8 14 14 20 5" strokeLinecap="round" />
        <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="20" cy="5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'cone',
    label: 'Cone',
    hint: 'Project attack cone',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <path d="M12 4L4 20h16L12 4z" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export function Toolbar() {
  const tool = useEditorStore((s) => s.tool)
  const setTool = useEditorStore((s) => s.setTool)

  return (
    <div className="panel flex flex-col gap-1 p-1.5">
      {TOOLS.map((t) => {
        const active = tool === t.id
        return (
          <Tooltip key={t.id} label={`${t.label} — ${t.hint}`} side="right">
            <button
              onClick={() => setTool(t.id)}
              aria-pressed={active}
              className={clsx(
                'group flex h-10 w-10 items-center justify-center rounded-lg transition',
                active
                  ? 'bg-accent/15 text-accent ring-1 ring-accent/30 shadow-glow'
                  : 'text-ink-300 hover:bg-white/[0.06] hover:text-ink-50',
              )}
            >
              {t.icon}
            </button>
          </Tooltip>
        )
      })}
    </div>
  )
}
