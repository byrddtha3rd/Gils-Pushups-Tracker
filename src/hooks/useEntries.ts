import { useCallback, useEffect, useState } from 'react'
import type { PushUpEntry } from '../types'
import { isValidEntry } from '../lib/stats'
import { loadEntries, saveEntries } from '../lib/storage'

const makeId = (): string =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`

export const useEntries = () => {
  const [entries, setEntries] = useState<PushUpEntry[]>(() => loadEntries())
  const [storageError, setStorageError] = useState(false)

  useEffect(() => {
    setStorageError(!saveEntries(entries))
  }, [entries])

  const addEntry = useCallback((count: number, date: string) => {
    if (!isValidEntry(count, date)) return null
    const now = new Date().toISOString()
    const entry: PushUpEntry = { id: makeId(), date, count, createdAt: now, updatedAt: now }
    setEntries((current) => [...current, entry])
    return entry
  }, [])

  const updateEntry = useCallback((id: string, count: number, date: string) => {
    if (!isValidEntry(count, date)) return false
    setEntries((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, count, date, updatedAt: new Date().toISOString() } : entry,
      ),
    )
    return true
  }, [])

  const removeEntry = useCallback((id: string) => {
    const removed = entries.find((entry) => entry.id === id) ?? null
    setEntries((current) => current.filter((entry) => entry.id !== id))
    return removed
  }, [entries])

  const restoreEntry = useCallback((entry: PushUpEntry) => {
    setEntries((current) => [...current.filter((item) => item.id !== entry.id), entry])
  }, [])

  return { entries, addEntry, updateEntry, removeEntry, restoreEntry, storageError }
}
