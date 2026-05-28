import { motion } from 'framer-motion'
import { COURT_CONFIGS, SPORTS } from '@/domain/sports'
import { useScenarioStore } from '@/store/scenarioStore'
import clsx from 'clsx'

export function SportSwitcher() {
  const sport = useScenarioStore((s) => s.scenario.sport)
  const setSport = useScenarioStore((s) => s.setSport)

  return (
    <div
      role="tablist"
      aria-label="Sport"
      className="inline-flex items-center gap-1 rounded-xl border border-white/[0.06] bg-ink-900/70 p-1 shadow-panel backdrop-blur"
    >
      {SPORTS.map((s) => {
        const active = sport === s
        return (
          <button
            key={s}
            role="tab"
            aria-selected={active}
            onClick={() => setSport(s)}
            className={clsx(
              'relative px-3 py-1.5 text-xs font-medium tracking-wide transition rounded-lg',
              active ? 'text-ink-50' : 'text-ink-300 hover:text-ink-100',
            )}
          >
            {active && (
              <motion.span
                layoutId="sport-pill"
                className="absolute inset-0 rounded-lg bg-white/[0.08] ring-1 ring-white/[0.08]"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{COURT_CONFIGS[s].displayName}</span>
          </button>
        )
      })}
    </div>
  )
}
