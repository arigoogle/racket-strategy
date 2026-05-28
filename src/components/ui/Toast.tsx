import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useUIStore } from '@/store/uiStore'

export function Toast() {
  const toast = useUIStore((s) => s.toast)
  return createPortal(
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ y: -28, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -16, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          className="pointer-events-none fixed left-1/2 top-3 z-[60] -translate-x-1/2 rounded-full border border-white/[0.08] bg-ink-800/95 px-3.5 py-1.5 text-[12px] font-medium text-ink-50 shadow-glow ring-1 ring-accent/30 backdrop-blur"
          role="status"
          aria-live="polite"
        >
          <span className="mr-1.5 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-accent" />
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
