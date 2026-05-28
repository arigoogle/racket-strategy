import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { AnimatePresence, motion } from 'framer-motion'

interface AuthChipProps {
  compact?: boolean
}

export function AuthChip({ compact = false }: AuthChipProps) {
  const configured = useAuthStore((s) => s.configured)
  const user = useAuthStore((s) => s.user)
  const openSignIn = () => useAuthStore.getState().setSignInDialogOpen(true)
  const signOut = useAuthStore((s) => s.signOut)
  const showToast = useUIStore((s) => s.showToast)

  const [menuOpen, setMenuOpen] = useState(false)

  if (!configured) return null

  if (!user) {
    return (
      <button
        onClick={openSignIn}
        className={
          compact
            ? 'flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-ink-200 transition hover:bg-white/[0.08]'
            : 'btn btn-ghost text-xs'
        }
        aria-label="Sign in"
      >
        {compact ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" strokeLinecap="round" />
          </svg>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
              <path d="M16 11V7a4 4 0 0 0-8 0v4M5 11h14v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9z" strokeLinejoin="round" />
            </svg>
            Sign in
          </>
        )}
      </button>
    )
  }

  const initial = (user.email ?? '?').charAt(0).toUpperCase()

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="flex h-9 items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-2 text-xs font-medium text-accent transition hover:bg-accent/15"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/30 text-[11px] font-semibold text-ink-50">
          {initial}
        </span>
        {!compact && (
          <span className="hidden max-w-[140px] truncate sm:inline">{user.email}</span>
        )}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-[calc(100%+6px)] z-40 w-56 overflow-hidden rounded-xl border border-white/[0.08] bg-ink-900/95 p-1 shadow-panel backdrop-blur-xl"
              role="menu"
            >
              <div className="border-b border-white/[0.06] px-3 py-2">
                <div className="text-[10px] uppercase tracking-widest2 text-ink-400">
                  Signed in as
                </div>
                <div className="truncate text-sm text-ink-50">{user.email}</div>
              </div>
              <button
                onClick={async () => {
                  setMenuOpen(false)
                  await signOut()
                  showToast('Signed out')
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-ink-100 transition hover:bg-white/[0.06]"
                role="menuitem"
              >
                Sign out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
