import type { Scenario } from '@/domain/models/scenario'
import { supabase } from './supabase'
import { db } from './db'

interface ScenarioRow {
  id: string
  user_id: string
  title: string
  sport: Scenario['sport']
  tags: string[]
  players: Scenario['players']
  steps: Scenario['steps']
  background: Scenario['background'] | null
  is_public: boolean
  created_at: string
  updated_at: string
}

const toRow = (s: Scenario, userId: string): ScenarioRow => ({
  id: s.id,
  user_id: userId,
  title: s.title,
  sport: s.sport,
  tags: s.tags,
  players: s.players,
  steps: s.steps,
  background: s.background ?? null,
  is_public: s.isPublic,
  created_at: s.createdAt,
  updated_at: s.updatedAt,
})

const fromRow = (r: ScenarioRow): Scenario => ({
  id: r.id,
  title: r.title,
  sport: r.sport,
  tags: r.tags ?? [],
  players: r.players,
  steps: r.steps,
  background: r.background ?? undefined,
  isPublic: r.is_public,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
  authorId: r.user_id,
})

export async function cloudUpsertScenario(scenario: Scenario, userId: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('scenarios').upsert(toRow(scenario, userId))
  if (error) throw error
}

export async function cloudDeleteScenario(id: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('scenarios').delete().eq('id', id)
  if (error) throw error
}

export async function cloudListScenarios(): Promise<Scenario[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('scenarios')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map((r) => fromRow(r as ScenarioRow))
}

/**
 * On sign-in: reconcile local (Dexie) with cloud (Supabase).
 *
 * Strategy:
 *  - Fetch all cloud scenarios for this user.
 *  - Fetch all local scenarios.
 *  - For each id present in either set, keep the one with the larger `updatedAt`.
 *  - Push any local-only scenarios up; pull any cloud-only scenarios down.
 *
 * Returns a summary so the caller can show a toast.
 */
export async function reconcileWithCloud(userId: string): Promise<{
  pulled: number
  pushed: number
  resolved: number
}> {
  if (!supabase) return { pulled: 0, pushed: 0, resolved: 0 }

  const [cloud, local] = await Promise.all([cloudListScenarios(), db.scenarios.toArray()])
  const cloudMap = new Map(cloud.map((s) => [s.id, s]))
  const localMap = new Map(local.map((s) => [s.id, s]))
  const allIds = new Set([...cloudMap.keys(), ...localMap.keys()])

  const toPush: Scenario[] = []
  const toWriteLocal: Scenario[] = []
  let resolved = 0

  for (const id of allIds) {
    const c = cloudMap.get(id)
    const l = localMap.get(id)
    if (c && !l) {
      toWriteLocal.push(c)
    } else if (l && !c) {
      toPush.push(l)
    } else if (c && l) {
      const cT = new Date(c.updatedAt).getTime()
      const lT = new Date(l.updatedAt).getTime()
      if (cT > lT) toWriteLocal.push(c)
      else if (lT > cT) toPush.push(l)
      resolved += 1
    }
  }

  if (toWriteLocal.length) await db.scenarios.bulkPut(toWriteLocal)

  if (toPush.length) {
    const rows = toPush.map((s) => toRow(s, userId))
    const { error } = await supabase.from('scenarios').upsert(rows)
    if (error) throw error
  }

  return { pulled: toWriteLocal.length, pushed: toPush.length, resolved }
}
