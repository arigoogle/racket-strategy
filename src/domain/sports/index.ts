import type { Sport } from '../models/scenario'
import { PADEL_DOUBLES } from './padel'
import { TENNIS_DOUBLES, TENNIS_SINGLES } from './tennis'
import type { CourtConfig } from './types'

export const COURT_CONFIGS: Record<Sport, CourtConfig> = {
  padel_doubles: PADEL_DOUBLES,
  tennis_singles: TENNIS_SINGLES,
  tennis_doubles: TENNIS_DOUBLES,
}

export const SPORTS: Sport[] = ['padel_doubles', 'tennis_singles', 'tennis_doubles']

export const getCourtConfig = (sport: Sport): CourtConfig => COURT_CONFIGS[sport]

export type { CourtConfig } from './types'
