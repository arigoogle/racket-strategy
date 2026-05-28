import { type ReactNode, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

interface TooltipProps {
  label: string
  children: ReactNode
  side?: 'top' | 'bottom' | 'right' | 'left'
  offset?: number
}

interface Coords {
  top: number
  left: number
  transform: string
}

export function Tooltip({ label, children, side = 'bottom', offset = 8 }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<Coords | null>(null)
  const wrapperRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (!open || !wrapperRef.current) return
    const rect = wrapperRef.current.getBoundingClientRect()
    let top = 0
    let left = 0
    let transform = ''
    switch (side) {
      case 'top':
        top = rect.top - offset
        left = rect.left + rect.width / 2
        transform = 'translate(-50%, -100%)'
        break
      case 'bottom':
        top = rect.bottom + offset
        left = rect.left + rect.width / 2
        transform = 'translate(-50%, 0)'
        break
      case 'right':
        top = rect.top + rect.height / 2
        left = rect.right + offset
        transform = 'translate(0, -50%)'
        break
      case 'left':
        top = rect.top + rect.height / 2
        left = rect.left - offset
        transform = 'translate(-100%, -50%)'
        break
    }
    setCoords({ top, left, transform })
  }, [open, side, offset])

  return (
    <>
      <span
        ref={wrapperRef}
        className="relative inline-flex"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </span>
      {createPortal(
        <AnimatePresence>
          {open && coords && (
            <motion.span
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.12 }}
              style={{
                position: 'fixed',
                top: coords.top,
                left: coords.left,
                transform: coords.transform,
                zIndex: 9999,
                pointerEvents: 'none',
              }}
              className="whitespace-nowrap rounded-md bg-ink-800 px-2 py-1 text-[11px] font-medium tracking-wide text-ink-50 shadow-panel ring-1 ring-white/10"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
