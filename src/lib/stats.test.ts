import { describe, expect, it } from 'vitest'
import type { PushUpEntry } from '../types'
import { getMonthStats, getStreaks, isValidEntry, monthSummaries } from './stats'

const entry = (date: string, count: number, id = `${date}-${count}`): PushUpEntry => ({
  id,
  date,
  count,
  createdAt: `${date}T12:00:00.000Z`,
  updatedAt: `${date}T12:00:00.000Z`,
})

describe('monthly stats', () => {
  it('aggregates entries and handles a leap-year month', () => {
    const stats = getMonthStats([entry('2024-02-01', 100), entry('2024-02-01', 50, 'two')], '2024-02', '2024-02-10')
    expect(stats.total).toBe(150)
    expect(stats.daysInMonth).toBe(29)
    expect(stats.activeDays).toBe(1)
    expect(stats.missedDays).toBe(7)
    expect(stats.projectedTotal).toBe(417)
  })

  it('uses the five-percent pace band', () => {
    expect(getMonthStats([entry('2026-04-15', 5000)], '2026-04', '2026-04-15').status).toBe('On Pace')
    expect(getMonthStats([entry('2026-04-15', 5300)], '2026-04', '2026-04-15').status).toBe('Ahead of Pace')
    expect(getMonthStats([entry('2026-04-15', 4700)], '2026-04', '2026-04-15').status).toBe('Behind Pace')
  })

  it('calculates past-month missed days and archive summaries', () => {
    const entries = [entry('2026-04-01', 400), entry('2026-03-01', 300)]
    expect(getMonthStats(entries, '2026-04', '2026-05-01').missedDays).toBe(25)
    expect(monthSummaries(entries)).toEqual([
      { month: '2026-04', total: 400 },
      { month: '2026-03', total: 300 },
    ])
  })
})

describe('streaks and validation', () => {
  it('keeps a current streak alive when today is not finished', () => {
    const entries = [entry('2026-07-01', 25), entry('2026-07-02', 25)]
    expect(getStreaks(entries, '2026-07-03')).toEqual({ current: 2, best: 2 })
  })

  it('finds the best run even when current streak is broken', () => {
    const entries = [
      entry('2026-06-01', 1),
      entry('2026-06-02', 1),
      entry('2026-06-03', 1),
      entry('2026-07-02', 1),
    ]
    expect(getStreaks(entries, '2026-07-03')).toEqual({ current: 1, best: 3 })
  })

  it('bridges streaks across Sunday without counting the rest day', () => {
    const entries = [
      entry('2026-07-04', 50),
      entry('2026-07-05', 75),
      entry('2026-07-06', 50),
    ]
    expect(getStreaks(entries, '2026-07-06')).toEqual({ current: 2, best: 2 })
  })

  it('excludes Sundays from pace-day and activity calculations', () => {
    const entries = [entry('2026-07-05', 100), entry('2026-07-06', 200)]
    const stats = getMonthStats(entries, '2026-07', '2026-07-06')
    expect(stats.total).toBe(300)
    expect(stats.activeDays).toBe(1)
    expect(stats.elapsedDays).toBe(5)
    expect(stats.missedDays).toBe(4)
  })

  it('rejects invalid and future entries', () => {
    expect(isValidEntry(25, '2026-07-03', '2026-07-03')).toBe(true)
    expect(isValidEntry(0, '2026-07-03', '2026-07-03')).toBe(false)
    expect(isValidEntry(2.5, '2026-07-03', '2026-07-03')).toBe(false)
    expect(isValidEntry(25, '2026-02-31', '2026-07-03')).toBe(false)
    expect(isValidEntry(25, '2026-07-04', '2026-07-03')).toBe(false)
  })
})
