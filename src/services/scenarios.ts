import type { Scenario } from '@/domain/models/scenario'
import { db } from './db'
import { useAuthStore } from '@/store/authStore'
import { cloudDeleteScenario, cloudUpsertScenario } from './sync'

/**
 * Local-first save: always write to Dexie, then opportunistically push to
 * Supabase if the user is signed in. Cloud failures are logged but don't
 * block the local save — sync layer will reconcile on next sign-in.
 */
export async function saveScenario(scenario: Scenario): Promise<Scenario> {
  const next: Scenario = { ...scenario, updatedAt: new Date().toISOString() }
  await db.scenarios.put(next)

  const userId = useAuthStore.getState().user?.id
  if (userId) {
    cloudUpsertScenario(next, userId).catch((err) =>
      console.warn('[sync] cloud push failed:', err),
    )
  }

  return next
}

export async function listScenarios(): Promise<Scenario[]> {
  return db.scenarios.orderBy('updatedAt').reverse().toArray()
}

export async function getScenario(id: string): Promise<Scenario | undefined> {
  return db.scenarios.get(id)
}

export async function deleteScenario(id: string): Promise<void> {
  await db.scenarios.delete(id)

  const userId = useAuthStore.getState().user?.id
  if (userId) {
    cloudDeleteScenario(id).catch((err) =>
      console.warn('[sync] cloud delete failed:', err),
    )
  }
}
