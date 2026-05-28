import Dexie, { type Table } from 'dexie'
import type { Scenario } from '@/domain/models/scenario'

class RacketStrategyDB extends Dexie {
  scenarios!: Table<Scenario, string>

  constructor() {
    super('racket-strategy')
    this.version(1).stores({
      // primary key: id; secondary indexes: sport, updatedAt
      scenarios: 'id, sport, updatedAt',
    })
  }
}

export const db = new RacketStrategyDB()
