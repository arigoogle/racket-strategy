import { type ReactNode, useEffect } from 'react'
import { motion, useAnimation, type PanInfo } from 'framer-motion'

interface BottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  peekHeight?: number
  expandedHeight?: string
  headerSlot?: ReactNode
  children: ReactNode
}

/**
 * A two-snap bottom sheet that lives above any bottom toolbar.
 *
 * It is fixed at the bottom of the viewport with full expanded height; we
 * translate it down by (expandedHeight - peekHeight) when collapsed so only
 * the header peeks. The grab handle is draggable; vertical drag with enough
 * offset or velocity toggles open/closed.
 */
export function BottomSheet({
  open,
  onOpenChange,
  peekHeight = 88,
  expandedHeight = '74vh',
  headerSlot,
  children,
}: BottomSheetProps) {
  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      y: open ? '0%' : `calc(100% - ${peekHeight}px)`,
      transition: { type: 'spring', stiffness: 320, damping: 34 },
    })
  }, [open, peekHeight, controls])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const distance = info.offset.y
    const velocity = info.velocity.y
    if (open) {
      // currently open — drag down to close
      if (distance > 120 || velocity > 500) onOpenChange(false)
      else controls.start({ y: '0%', transition: { type: 'spring', stiffness: 320, damping: 34 } })
    } else {
      // currently closed — drag up to open
      if (distance < -80 || velocity < -400) onOpenChange(true)
      else
        controls.start({
          y: `calc(100% - ${peekHeight}px)`,
          transition: { type: 'spring', stiffness: 320, damping: 34 },
        })
    }
  }

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.04}
      onDragEnd={onDragEnd}
      initial={{ y: `calc(100% - ${peekHeight}px)` }}
      animate={controls}
      style={{ height: expandedHeight }}
      className="fixed inset-x-0 bottom-0 z-30 flex flex-col rounded-t-3xl border-t border-white/[0.06] bg-ink-900/95 backdrop-blur-xl shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.6)]"
    >
      <button
        type="button"
        aria-label={open ? 'Collapse panel' : 'Expand panel'}
        onClick={() => onOpenChange(!open)}
        className="flex w-full cursor-grab touch-none flex-col items-center gap-2 px-4 pt-3 pb-2 active:cursor-grabbing"
      >
        <span className="h-1.5 w-12 rounded-full bg-ink-500" />
        {headerSlot}
      </button>
      <div className="flex-1 overflow-y-auto overscroll-contain px-1 pb-[env(safe-area-inset-bottom)]">
        {children}
      </div>
    </motion.div>
  )
}
