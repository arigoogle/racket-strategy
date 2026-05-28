import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { supabase } from '@/services/supabase'

export function SignInDialog() {
  const open = useAuthStore((s) => s.signInDialogOpen)
  const close = () => useAuthStore.getState().setSignInDialogOpen(false)
  const configured = useAuthStore((s) => s.configured)
  const showToast = useUIStore((s) => s.showToast)

  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    const trimmed = email.trim()
    if (!trimmed) return
    setSending(true)
    setError(null)
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: window.location.origin,
        },
      })
      if (err) {
        setError(err.message)
      } else {
        setSent(true)
        showToast('Magic link sent. Check your inbox.')
      }
    } catch (err) {
      // Most commonly a DNS / offline / CORS failure — surface it clearly.
      const message = err instanceof TypeError && err.message === 'Failed to fetch'
        ? "Couldn't reach Supabase. Double-check the project URL in your env vars and that the project isn't paused."
        : err instanceof Error
          ? err.message
          : 'Unknown error reaching Supabase.'
      setError(message)
    } finally {
      setSending(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        close()
        setSent(false)
        setError(null)
      }}
      title="Sign in to sync"
      description={
        configured
          ? 'Enter your email — we send a one-time login link. No password needed.'
          : 'Cloud sync is not configured for this build.'
      }
    >
      {!configured ? (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">
          Add <code className="font-mono">VITE_SUPABASE_URL</code> and{' '}
          <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> in your env to enable.
        </div>
      ) : sent ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-accent/30 bg-accent/10 p-4 text-sm text-accent">
            <div className="font-semibold">Magic link sent ✓</div>
            <p className="mt-1 text-xs text-accent/80">
              Open the email from Supabase on this device. The link will sign you in
              and bring you back here.
            </p>
          </div>
          <button onClick={() => close()} className="btn btn-ghost w-full text-xs">
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest2 text-ink-400">
              Email
            </span>
            <input
              autoFocus
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-ink-50 placeholder:text-ink-500 transition focus:border-accent/40 focus:bg-white/[0.06] focus:outline-none"
            />
          </label>
          {error && (
            <p className="rounded-md border border-rose-500/30 bg-rose-500/10 p-2 text-xs text-rose-200">
              {error}
            </p>
          )}
          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={close} className="btn btn-ghost text-xs">
              Cancel
            </button>
            <button type="submit" disabled={sending} className="btn btn-primary text-xs">
              {sending ? 'Sending…' : 'Send magic link'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
