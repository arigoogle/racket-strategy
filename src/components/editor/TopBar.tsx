import { InstallButton } from './InstallButton'
import { SportSwitcher } from './SportSwitcher'
import { useIsMobile } from '@/hooks/useMediaQuery'

export function TopBar() {
  const isMobile = useIsMobile()

  return (
    <header className="flex items-center justify-between gap-3 border-b border-white/[0.04] bg-ink-950/70 px-3 py-2.5 backdrop-blur md:px-5 md:py-3">
      <div className="flex min-w-0 items-center gap-2.5 md:gap-3">
        <Logo />
        {!isMobile && (
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">Racket Strategy</span>
            <span className="text-[10px] uppercase tracking-widest2 text-ink-400">
              Tactical Visualizer
            </span>
          </div>
        )}
        {isMobile && (
          <span className="text-sm font-semibold tracking-tight">Racket</span>
        )}
      </div>

      <div className="flex min-w-0 items-center">
        <SportSwitcher variant={isMobile ? 'compact' : 'full'} />
      </div>

      <div className="flex items-center gap-1.5 md:gap-2">
        <InstallButton />
        {!isMobile && (
          <>
            <button className="btn btn-ghost text-xs">Library</button>
            <button className="btn btn-ghost text-xs">Save</button>
          </>
        )}
      </div>
    </header>
  )
}

function Logo() {
  return (
    <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent/30 to-accent/5 ring-1 ring-accent/40 md:h-9 md:w-9">
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-accent">
        <path
          d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.5" />
      </svg>
    </div>
  )
}
