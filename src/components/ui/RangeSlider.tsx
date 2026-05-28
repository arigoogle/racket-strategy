import type { CSSProperties } from 'react'

interface RangeSliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (value: number) => void
  onReset?: () => void
  resetLabel?: string
}

export function RangeSlider({
  label,
  value,
  min,
  max,
  step = 0.1,
  unit = '',
  onChange,
  onReset,
  resetLabel = 'Reset',
}: RangeSliderProps) {
  const progress = ((value - min) / (max - min)) * 100
  const style = { '--range-progress': `${progress}%` } as CSSProperties

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest2 text-ink-400">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-ink-100">
            {value.toFixed(1)}
            {unit && <span className="text-ink-400">{unit}</span>}
          </span>
          {onReset && (
            <button
              onClick={onReset}
              className="text-[10px] uppercase tracking-widest2 text-ink-400 transition hover:text-accent"
              type="button"
            >
              {resetLabel}
            </button>
          )}
        </div>
      </div>
      <input
        type="range"
        className="range-accent"
        min={min}
        max={max}
        step={step}
        value={value}
        style={style}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <div className="flex justify-between text-[10px] font-mono text-ink-500">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}
