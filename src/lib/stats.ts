import type { MonthStats, PaceStatus, PushUpEntry } from '../types'
import {
  dateKeyForDay,
  daysInMonthKey,
  isSunday,
  monthKey,
  nextWorkoutDay,
  parseDateKey,
  previousWorkoutDay,
  todayKey,
  toDateKey,
  workoutDaysInRange,
} from './date'

export const MONTHLY_GOAL = 10_000

export const entriesForMonth = (entries: PushUpEntry[], month: string): PushUpEntry[] =>
  entries.filter((entry) => monthKey(entry.date) === month)

export const dailyTotals = (entries: PushUpEntry[], month?: string): Record<string, number> =>
  entries.reduce<Record<string, number>>((totals, entry) => {
    if (!month || monthKey(entry.date) === month) {
      totals[entry.date] = (totals[entry.date] ?? 0) + entry.count
    }
    return totals
  }, {})

export const getMonthStats = (
  entries: PushUpEntry[],
  month: string,
  nowKey = todayKey(),
): MonthStats => {
  const totals = dailyTotals(entries, month)
  const values = Object.entries(totals)
  const total = values.reduce((sum, [, count]) => sum + count, 0)
  const daysInMonth = daysInMonthKey(month)
  const workoutDays = workoutDaysInRange(month, 1, daysInMonth)
  const isCurrentMonth = month === monthKey(nowKey)
  const isPastMonth = month < monthKey(nowKey)
  const todayDay = Number(nowKey.slice(8, 10))
  const elapsedDays = isCurrentMonth
    ? workoutDaysInRange(month, 1, todayDay)
    : isPastMonth
      ? workoutDays
      : 0
  const remainingDays = isCurrentMonth
    ? workoutDaysInRange(month, todayDay, daysInMonth)
    : isPastMonth
      ? 0
      : workoutDays
  const workoutValues = values.filter(([date, count]) => count > 0 && !isSunday(date))
  const activeDays = workoutValues.length
  let missedDays = 0

  if (isCurrentMonth) {
    for (let day = 1; day < todayDay; day += 1) {
      const date = dateKeyForDay(month, day)
      if (!isSunday(date) && !totals[date]) missedDays += 1
    }
  } else if (isPastMonth) {
    missedDays = workoutDays - activeDays
  }

  const expected = elapsedDays ? (MONTHLY_GOAL * elapsedDays) / workoutDays : 0
  const paceRatio = expected ? total / expected : 1
  const status: PaceStatus =
    paceRatio > 1.05 ? 'Ahead of Pace' : paceRatio < 0.95 ? 'Behind Pace' : 'On Pace'
  const best = workoutValues.sort((a, b) => b[1] - a[1])[0]

  return {
    month,
    total,
    remaining: Math.max(0, MONTHLY_GOAL - total),
    percent: Math.min(100, (total / MONTHLY_GOAL) * 100),
    daysInMonth,
    elapsedDays,
    remainingDays,
    activeDays,
    missedDays,
    averagePerDay: elapsedDays ? total / elapsedDays : 0,
    neededPerDay: remainingDays ? Math.ceil(Math.max(0, MONTHLY_GOAL - total) / remainingDays) : 0,
    projectedTotal: elapsedDays ? Math.round((total / elapsedDays) * workoutDays) : 0,
    status,
    highOutputTarget: Math.ceil(MONTHLY_GOAL / workoutDays),
    bestDay: best ? { date: best[0], count: best[1] } : null,
  }
}

export const getStreaks = (
  entries: PushUpEntry[],
  nowKey = todayKey(),
): { current: number; best: number } => {
  const activeDates = [
    ...new Set(
      entries
        .filter((entry) => entry.count > 0 && !isSunday(entry.date))
        .map((entry) => entry.date),
    ),
  ]
    .filter((date) => date <= nowKey)
    .sort()
  if (!activeDates.length) return { current: 0, best: 0 }

  let best = 1
  let run = 1
  for (let index = 1; index < activeDates.length; index += 1) {
    if (activeDates[index] === nextWorkoutDay(activeDates[index - 1])) {
      run += 1
      best = Math.max(best, run)
    } else {
      run = 1
    }
  }

  const activeSet = new Set(activeDates)
  let cursor =
    !isSunday(nowKey) && activeSet.has(nowKey) ? nowKey : previousWorkoutDay(nowKey)
  let current = 0
  while (activeSet.has(cursor)) {
    current += 1
    cursor = previousWorkoutDay(cursor)
  }
  return { current, best }
}

export const getAllTimeTotal = (entries: PushUpEntry[]): number =>
  entries.reduce((sum, entry) => sum + entry.count, 0)

export const monthSummaries = (entries: PushUpEntry[]): Array<{ month: string; total: number }> => {
  const totals = entries.reduce<Record<string, number>>((result, entry) => {
    const month = monthKey(entry.date)
    result[month] = (result[month] ?? 0) + entry.count
    return result
  }, {})
  return Object.entries(totals)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => b.month.localeCompare(a.month))
}

export const isValidEntry = (count: number, date: string, nowKey = todayKey()): boolean => {
  if (!Number.isInteger(count) || count <= 0 || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
  const parsed = parseDateKey(date)
  return !Number.isNaN(parsed.getTime()) && toDateKey(parsed) === date && date <= nowKey
}
