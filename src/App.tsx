import { CourtCanvas } from './canvas/CourtCanvas'
import { InspectorPanel } from './components/editor/InspectorPanel'
import { Toolbar } from './components/editor/Toolbar'
import { TopBar } from './components/editor/TopBar'

export default function App() {
  return (
    <div className="flex h-full w-full flex-col">
      <TopBar />
      <main className="grid min-h-0 flex-1 grid-cols-[auto_minmax(0,1fr)_auto] gap-4 p-4">
        <div className="flex flex-col">
          <Toolbar />
        </div>
        <section className="panel relative min-w-0 overflow-hidden">
          <CourtCanvas />
          <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2">
            <span className="chip">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Editing
            </span>
            <span className="chip text-ink-300">Step 1</span>
          </div>
        </section>
        <InspectorPanel />
      </main>
    </div>
  )
}
