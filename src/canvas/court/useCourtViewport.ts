import { useEffect, useMemo, useState } from 'react'
import type { CourtConfig } from '@/domain/sports'

export interface CourtViewport {
  /** scale factor: pixels per meter */
  scale: number
  /** offset (px) of the court within the stage so it is centered */
  offsetX: number
  offsetY: number
  stageWidth: number
  stageHeight: number
  /** convert court meters → stage pixels */
  toStage: (xM: number, yM: number) => { x: number; y: number }
  /** convert stage pixels → court meters */
  toCourt: (xPx: number, yPx: number) => { x: number; y: number }
}

interface UseCourtViewportArgs {
  container: HTMLElement | null
  court: CourtConfig
  padding?: number
}

export function useCourtViewport({
  container,
  court,
  padding = 32,
}: UseCourtViewportArgs): CourtViewport {
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 })

  useEffect(() => {
    if (!container) return
    const update = () => {
      const rect = container.getBoundingClientRect()
      setSize({ w: rect.width, h: rect.height })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(container)
    return () => ro.disconnect()
  }, [container])

  return useMemo(() => {
    const { w, h } = size
    if (w === 0 || h === 0) {
      const noop = (x: number, y: number) => ({ x, y })
      return {
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        stageWidth: 0,
        stageHeight: 0,
        toStage: noop,
        toCourt: noop,
      }
    }
    const availableW = Math.max(w - padding * 2, 1)
    const availableH = Math.max(h - padding * 2, 1)
    const scale = Math.min(availableW / court.width, availableH / court.height)
    const courtPxW = court.width * scale
    const courtPxH = court.height * scale
    const offsetX = (w - courtPxW) / 2
    const offsetY = (h - courtPxH) / 2

    return {
      scale,
      offsetX,
      offsetY,
      stageWidth: w,
      stageHeight: h,
      toStage: (xM: number, yM: number) => ({
        x: offsetX + xM * scale,
        y: offsetY + yM * scale,
      }),
      toCourt: (xPx: number, yPx: number) => ({
        x: (xPx - offsetX) / scale,
        y: (yPx - offsetY) / scale,
      }),
    }
  }, [size, court, padding])
}
