import { describe, expect, it } from 'vitest'
import type { PushUpEntry } from '../types'
import { decodeEntries, loadEntries, saveEntries, STORAGE_KEY } from './storage'

const sample: PushUpEntry = {
  id: 'one',
  date: '2026-07-03',
  count: 50,
  createdAt: '2026-07-03T12:00:00.000Z',
  updatedAt: '2026-07-03T12:00:00.000Z',
}

describe('storage', () => {
  it('migrates a legacy direct array', () => {
    expect(decodeEntries(JSON.stringify([sample]))).toEqual([sample])
  })

  it('returns an empty list for corrupt data or blocked reads', () => {
    expect(decodeEntries('{broken')).toEqual([])
    expect(loadEntries({ getItem: () => { throw new Error('blocked') } })).toEqual([])
  })

  it('writes versioned data and reports a blocked write', () => {
    let value = ''
    expect(saveEntries([sample], { setItem: (key, next) => { expect(key).toBe(STORAGE_KEY); value = next } })).toBe(true)
    expect(JSON.parse(value)).toMatchObject({ version: 1, entries: [sample] })
    expect(saveEntries([sample], { setItem: () => { throw new Error('blocked') } })).toBe(false)
  })
})
