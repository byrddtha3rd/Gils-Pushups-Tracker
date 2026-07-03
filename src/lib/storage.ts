import type { PushUpEntry } from '../types'

export const STORAGE_KEY = 'tenk-pushups:data'
const VERSION = 1

interface StoredData {
  version: number
  entries: PushUpEntry[]
}

const isEntry = (value: unknown): value is PushUpEntry => {
  if (!value || typeof value !== 'object') return false
  const entry = value as Partial<PushUpEntry>
  return (
    typeof entry.id === 'string' &&
    typeof entry.date === 'string' &&
    typeof entry.count === 'number' &&
    typeof entry.createdAt === 'string' &&
    typeof entry.updatedAt === 'string'
  )
}

export const decodeEntries = (raw: string | null): PushUpEntry[] => {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    // Early development builds stored the array directly; preserve it as a v0 migration.
    if (Array.isArray(parsed)) return parsed.filter(isEntry)
    if (
      parsed &&
      typeof parsed === 'object' &&
      Array.isArray((parsed as StoredData).entries)
    ) {
      return (parsed as StoredData).entries.filter(isEntry)
    }
  } catch {
    return []
  }
  return []
}

export const loadEntries = (storage: Pick<Storage, 'getItem'> = localStorage): PushUpEntry[] => {
  try {
    return decodeEntries(storage.getItem(STORAGE_KEY))
  } catch {
    return []
  }
}

export const saveEntries = (
  entries: PushUpEntry[],
  storage: Pick<Storage, 'setItem'> = localStorage,
): boolean => {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, entries }))
    return true
  } catch {
    return false
  }
}
