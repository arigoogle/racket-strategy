import { useEffect, useRef, useState } from 'react'
import { CourtCanvas } from './canvas/CourtCanvas'
import { InspectorPanel } from './components/editor/InspectorPanel'
import { Toolbar } from './components/editor/Toolbar'
import { TopBar } from './components/editor/TopBar'
import { BottomSheet } from './components/ui/BottomSheet'
import { Toast } from './components/ui/Toast'
import { LibraryPanel } from './components/library/LibraryPanel'
import { SaveDialog } from './components/library/SaveDialog'
import { SignInDialog } from './components/auth/SignInDialog'
import { useIsMobile } from './hooks/useMediaQuery'
import { useScenarioStore } from './store/scenarioStore'
import { useEditorStore } from './store/editorStore'
import { useAuthStore } from './store/authStore'
import { useUIStore } from './store/uiStore'
import { reconcileWithCloud } from './services/sync'
import { getCourtConfig } from './domain/sports'

export default function App() {
  const isMobile = useIsMobile()
  useAuthBootstrap()
  return (
    <div className="flex h-full w-full flex-col">
      <TopBar />
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
      <SaveDialog />
      <LibraryPanel />
      <SignInDialog />
      <Toast />
    </div>
  )
}

/**
 * On mount: initialise the Supabase session (also reads any magic-link token
 * from the URL). When the user signs in, reconcile their local Dexie library
 * with the cloud so they see the same scenarios everywhere.
 */
function useAuthBootstrap() {
  const initialize = useAuthStore((s) => s.initialize)
  const userId = useAuthStore((s) => s.user?.id ?? null)
  const showToast = useUIStore((s) => s.showToast)
  const lastReconciledFor = useRef<string | null>(null)

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (!userId || lastReconciledFor.current === userId) return
    lastReconciledFor.current = userId
    reconcileWithCloud(userId)
      .then(({ pulled, pushed }) => {
        if (pulled || pushed) {
          const parts: string[] = []
          if (pulled) parts.push(`${pulled} pulled`)
          if (pushed) parts.push(`${pushed} pushed`)
          showToast(`Synced — ${parts.join(', ')}`)
        }
      })
      .catch((err) => {
        console.warn('[sync] reconcile failed:', err)
        const message =
          err instanceof TypeError && err.message === 'Failed to fetch'
            ? 'Cloud unreachable — working locally'
            : 'Cloud sync failed — working locally'
        showToast(message)
      })
  }, [userId, showToast])
}

function DesktopLayout() {
  return (
    <main className="grid min-h-0 flex-1 grid-cols-[auto_minmax(0,1fr)_auto] gap-4 p-4">
      <div className="flex flex-col">
        <Toolbar />
      </div>
      <section className="panel relative min-w-0 overflow-hidden">
        <CourtCanvas />
        <CanvasOverlayTopChips />
      </section>
      <InspectorPanel />
    </main>
  )
}

function MobileLayout() {
  const [sheetOpen, setSheetOpen] = useState(false)
  return (
    <main className="relative flex min-h-0 flex-1 flex-col">
      {/* Canvas fills the whole screen, behind toolbar and sheet */}
      <section className="panel relative m-2 mb-0 flex-1 overflow-hidden rounded-2xl">
        <CourtCanvas />
        <CanvasOverlayTopChips />
      </section>

      {/* Horizontal toolbar pinned above the bottom sheet peek */}
      <div className="z-20 px-2 pt-2" style={{ paddingBottom: 'calc(88px + env(safe-area-inset-bottom))' }}>
        <Toolbar orientation="horizontal" />
      </div>

      <BottomSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        peekHeight={88}
        headerSlot={<MobileSheetHeader />}
      >
        <InspectorPanel mobile />
      </BottomSheet>
    </main>
  )
}

function MobileSheetHeader() {
  const scenario = useScenarioStore((s) => s.scenario)
  const selectedId = useEditorStore((s) => s.selectedPlayerId)
  const court = getCourtConfig(scenario.sport)
  const selectedPlayer = scenario.players.find((p) => p.id === selectedId)

  return (
    <div className="flex w-full items-center justify-between px-3">
      <div className="flex flex-col items-start text-left">
        <span className="text-[10px] uppercase tracking-widest2 text-ink-400">
          {court.displayName}
        </span>
        <span className="text-sm font-semibold leading-tight">
          {selectedPlayer ? `Player · ${selectedPlayer.label}` : scenario.title}
        </span>
      </div>
      <span className="chip text-accent border-accent/30 bg-accent/10">Inspect</span>
    </div>
  )
}

function CanvasOverlayTopChips() {
  return (
    <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-2 md:left-4 md:top-4">
      <span className="chip">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Editing
      </span>
      <span className="chip text-ink-300">Step 1</span>
    </div>
  )
}
