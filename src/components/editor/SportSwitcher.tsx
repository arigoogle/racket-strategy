import { motion } from 'framer-motion'
import { COURT_CONFIGS, SPORTS } from '@/domain/sports'
import { useScenarioStore } from '@/store/scenarioStore'
import clsx from 'clsx'

interface SportSwitcherProps {
  variant?: 'full' | 'compact'
}

export function SportSwitcher({ variant = 'full' }: SportSwitcherProps) {
  const sport = useScenarioStore((s) => s.scenario.sport)
  const setSport = useScenarioStore((s) => s.setSport)
  const compact = variant === 'compact'

  return (
    <div
      role="tablist"
      aria-label="Sport"
      className={clsx(
        'inline-flex items-center gap-1 rounded-xl border border-white/[0.06] bg-ink-900/70 p-1 shadow-panel backdrop-blur',
        compact && 'text-[11px]',
      )}
    >
      {SPORTS.map((s) => {
        const active = sport === s
        const config = COURT_CONFIGS[s]
        const label = compact ? config.shortName : config.displayName
        return (
          <button
            key={s}
            role="tab"
            aria-selected={active}
            onClick={() => setSport(s)}
            className={clsx(
              'relative font-medium tracking-wide transition rounded-lg',
              compact ? 'px-2.5 py-1' : 'px-3 py-1.5 text-xs',
              active ? 'text-ink-50' : 'text-ink-300 hover:text-ink-100',
            )}
          >
            {active && (
              <motion.span
                layoutId={compact ? 'sport-pill-compact' : 'sport-pill'}
                className="absolute inset-0 rounded-lg bg-white/[0.08] ring-1 ring-white/[0.08]"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative whitespace-nowrap">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
